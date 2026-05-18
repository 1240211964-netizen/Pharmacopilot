import http from "node:http";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { getConfig, getMissingFanyaConfig, getMissingRagConfig, loadEnv } from "./config";
import { callFanya, renderFanyaStatus } from "./fanya";
import {
  renderFanyaKnowledgeStatus,
  serveFanyaKnowledgeFrame,
  serveFanyaKnowledgeProxy,
} from "./fanya-knowledge";
import { httpError, json, readJsonBody, readMultipartBody, serveStatic } from "./http-utils";
import type { AppConfig, GenerateRequestPayload, HttpError, JsonRecord } from "./types";
import { generateAssetSummary, generateLessonPlan } from "./generation";
import { citationsFromChunks, ingestKnowledgeFiles, retrieveKnowledge, saveSourceBoundary } from "./rag";
import { parseSourceBoundary, sourceBoundarySummary } from "./source-boundary";
import { runAgentSession } from "./agent/stream";
import type { AgentRunRequest, AgentStreamEvent } from "./agent/types";
import { callWendaoAgent, normalizeAgentChatRequest } from "./agent/wendao-chat";

const rootDir = path.resolve(__dirname, "../..");

async function handleApi(req: IncomingMessage, res: ServerResponse, pathname: string, config: AppConfig): Promise<void> {
  if (req.method === "POST" && pathname === "/api/agent/chat") {
    return handleAgentChat(req, res, config);
  }

  if (req.method === "POST" && pathname === "/api/agent/run") {
    return handleAgentRun(req, res, config);
  }

  if (req.method === "GET" && pathname === "/api/fanya/status") {
    const missing = getMissingFanyaConfig(config);
    return json(res, 200, renderFanyaStatus("configured", config, {
      message: missing.length
        ? "Connector is not configured. Copy .env.example to .env and fill in the school-authorized values."
        : "Connector configuration is present. Use /api/fanya/connect to verify the upstream API.",
    }));
  }

  if (req.method === "GET" && pathname === "/api/fanya/knowledge-graph/status") {
    return json(res, 200, renderFanyaKnowledgeStatus(config));
  }

  if (req.method === "GET" && pathname === "/api/fanya/knowledge-graph/frame") {
    return serveFanyaKnowledgeFrame(req, res, config);
  }

  if (pathname.startsWith("/api/fanya/knowledge-graph/proxy/")) {
    return serveFanyaKnowledgeProxy(req, res, config, pathname);
  }

  if (req.method === "POST" && pathname === "/api/fanya/connect") {
    const missing = getMissingFanyaConfig(config);
    if (missing.length) {
      return json(res, 200, renderFanyaStatus("not_configured", config, {
        message: "Missing required Fanya connector configuration.",
      }));
    }
    try {
      const endpointName = config.fanya.endpoints.health ? "health" : "courses";
      const upstream = await callFanya(config, endpointName);
      return json(res, 200, renderFanyaStatus("connected", config, {
        message: "Successfully verified the Fanya API connection.",
        upstream: { endpoint: endpointName, status: upstream.status },
      }));
    } catch (error) {
      return json(res, httpStatus(error, 502), renderFanyaStatus("error", config, {
        message: (error as Error).message,
        upstream: (error as HttpError).data,
      }));
    }
  }

  if (req.method === "GET" && pathname === "/api/fanya/courses") {
    const missing = getMissingFanyaConfig(config);
    if (missing.length) return json(res, 424, renderFanyaStatus("not_configured", config));
    try {
      const upstream = await callFanya(config, "courses");
      return json(res, 200, { ok: true, data: upstream.data });
    } catch (error) {
      return json(res, httpStatus(error, 502), {
        ok: false,
        message: (error as Error).message,
        upstream: (error as HttpError).data,
      });
    }
  }

  if (req.method === "POST" && pathname === "/api/fanya/sync-assignment") {
    const missing = getMissingFanyaConfig(config);
    if (missing.length) return json(res, 424, renderFanyaStatus("not_configured", config));
    const body = await readJsonBody(req);
    try {
      const upstream = await callFanya(config, "assignments", {
        method: "POST",
        values: {
          courseId: stringValue(body.courseId) || config.fanya.defaultCourseId,
          classId: stringValue(body.classId) || config.fanya.defaultClassId,
        },
        body,
      });
      return json(res, 200, { ok: true, data: upstream.data });
    } catch (error) {
      return json(res, httpStatus(error, 502), {
        ok: false,
        message: (error as Error).message,
        upstream: (error as HttpError).data,
      });
    }
  }

  if (req.method === "GET" && pathname === "/api/knowledge/status") {
    const missing = getMissingRagConfig(config);
    return json(res, 200, {
      ok: missing.length === 0,
      state: missing.length ? "not_configured" : "configured",
      missing,
      embeddingModel: config.openai.embeddingModel,
      embeddingDimensions: config.openai.embeddingDimensions,
      chunking: {
        minChars: config.rag.chunkMinChars,
        maxChars: config.rag.chunkMaxChars,
        overlapChars: config.rag.chunkOverlapChars,
      },
    });
  }

  if (req.method === "POST" && pathname === "/api/knowledge/upload") {
    const multipart = await readMultipartBody(req, config.rag.maxUploadBytes);
    const summaries = await ingestKnowledgeFiles(config, {
      userId: requireString(multipart.fields.userId || multipart.fields.user_id, "userId"),
      courseId: stringValue(multipart.fields.courseId || multipart.fields.course_id),
      files: multipart.files,
      sourceBoundary: stringValue(multipart.fields.sourceBoundary || multipart.fields.source_boundary),
      sourceType: stringValue(multipart.fields.sourceType || multipart.fields.source_type) || "upload",
      sourceUri: stringValue(multipart.fields.sourceUri || multipart.fields.source_uri),
      sourceLabel: stringValue(multipart.fields.sourceLabel || multipart.fields.source_label),
      metadata: parseMetadata(multipart.fields.metadata),
    });
    return json(res, 200, {
      ok: true,
      files: summaries,
      sourceTags: summaries.map((file) => file.sourceLabel || file.name),
    });
  }

  if (req.method === "POST" && pathname === "/api/knowledge/search") {
    const body = await readJsonBody(req);
    const result = await retrieveKnowledge(config, {
      userId: requireString(body.userId || body.user_id, "userId"),
      courseId: stringValue(body.courseId || body.course_id),
      topic: stringValue(body.topic) || stringValue(body.query) || "课程教学内容",
      teachingAction: stringValue(body.teachingAction || body.teaching_action),
      query: stringValue(body.query || body.prompt),
      sourceBoundary: stringValue(body.sourceBoundary || body.source_boundary),
      limit: numberValue(body.limit, config.rag.matchCount),
    });
    return json(res, 200, {
      ok: true,
      chunks: citationsFromChunks(result.chunks),
      sourceBoundary: result.sourceBoundary,
      sourceBoundarySummary: result.sourceBoundarySummary,
    });
  }

  if (req.method === "POST" && pathname === "/api/knowledge/source-boundary") {
    const body = await readJsonBody(req);
    const userId = stringValue(body.userId || body.user_id);
    const courseId = stringValue(body.courseId || body.course_id);
    const text = stringValue(body.sourceBoundary || body.source_boundary || body.text);
    const result = userId
      ? await saveSourceBoundary(config, userId, courseId, text)
      : { parsed: parseSourceBoundary(text), saved: false };
    return json(res, 200, {
      ok: true,
      saved: result.saved,
      sourceBoundary: result.parsed,
      sourceBoundarySummary: sourceBoundarySummary(result.parsed),
    });
  }

  if (req.method === "POST" && pathname === "/api/generate/lesson-plan") {
    const body = (await readJsonBody(req)) as GenerateRequestPayload;
    const result = await generateLessonPlan(config, body, "lesson-plan");
    return json(res, 200, result);
  }

  if (req.method === "POST" && pathname === "/api/generate/rubric") {
    const body = (await readJsonBody(req)) as GenerateRequestPayload;
    const result = await generateLessonPlan(config, body, "rubric");
    return json(res, 200, result);
  }

  if (req.method === "POST" && pathname === "/api/generate/asset-summary") {
    const body = (await readJsonBody(req)) as GenerateRequestPayload;
    const result = await generateAssetSummary(config, body);
    return json(res, 200, result);
  }

  return json(res, 404, { ok: false, message: "API route not found." });
}

async function handleAgentChat(req: IncomingMessage, res: ServerResponse, config: AppConfig): Promise<void> {
  const abortController = new AbortController();
  res.on("close", () => {
    if (!res.writableEnded) abortController.abort();
  });

  const body = await readJsonBody(req);
  const payload = normalizeAgentChatRequest(body);
  // Future multi-agent orchestration can branch here before selecting Wendao,
  // while keeping the browser contract fixed at /api/agent/chat.
  const result = await callWendaoAgent(payload, config.wendaoAgent, abortController.signal);
  return json(res, 200, result);
}

async function handleAgentRun(req: IncomingMessage, res: ServerResponse, config: AppConfig): Promise<void> {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders?.();

  const abortController = new AbortController();
  res.on("close", () => {
    if (!res.writableEnded) abortController.abort();
  });

  try {
    const body = (await readJsonBody(req)) as AgentRunRequest;
    for await (const event of runAgentSession(body, config, abortController.signal)) {
      writeSseEvent(res, event);
    }
  } catch (error) {
    writeSseEvent(res, {
      type: "error",
      message: (error as Error).message,
      data: (error as HttpError).data as JsonRecord | undefined,
    });
  } finally {
    if (!res.writableEnded) res.end();
  }
}

function writeSseEvent(res: ServerResponse, event: AgentStreamEvent): void {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

async function main(): Promise<void> {
  await loadEnv(rootDir);
  const config = getConfig(rootDir);
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
      if (url.pathname.startsWith("/api/")) {
        await handleApi(req, res, url.pathname, config);
        return;
      }
      await serveStatic(res, url.pathname, config);
    } catch (error) {
      json(res, httpStatus(error, 500), {
        ok: false,
        message: (error as Error).message,
        data: (error as HttpError).data,
      });
    }
  });

  server.listen(config.port, () => {
    console.log(`Pharmacopilot server running at http://localhost:${config.port}`);
  });
}

function httpStatus(error: unknown, fallback: number): number {
  const status = (error as HttpError).status;
  return status && status >= 400 && status < 600 ? status : fallback;
}

function requireString(value: unknown, name: string): string {
  const text = stringValue(value);
  if (!text) throw httpError(`${name} is required.`, 400);
  return text;
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : value === undefined || value === null ? "" : String(value).trim();
}

function numberValue(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseMetadata(value: unknown): JsonRecord {
  if (!value) return {};
  if (typeof value === "object" && !Array.isArray(value)) return value as JsonRecord;
  if (typeof value !== "string") return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as JsonRecord) : {};
  } catch {
    return {};
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
