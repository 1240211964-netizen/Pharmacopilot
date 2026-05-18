import { httpError } from "../http-utils";
import type { JsonRecord, WendaoAgentConfig } from "../types";

const DEFAULT_TIMEOUT_MS = 20000;

export interface AgentChatRequest {
  message: string;
  courseId?: string;
  knowledgePoint?: string;
  teachingStage?: string;
  datasetList?: string[];
  fileIds?: string[];
  imageIds?: string[];
}

export interface AgentCitation {
  title: string;
  url?: string;
  excerpt?: string;
}

export interface AgentChatResponse {
  answer: string;
  citations?: AgentCitation[];
  raw?: unknown;
}

export function getMissingWendaoAgentConfig(config: WendaoAgentConfig): string[] {
  const missing: string[] = [];
  if (!config.apiUrl) missing.push("WENDAO_AGENT_API_URL");
  if (!config.apiKey) missing.push("WENDAO_API_KEY");
  if (!config.agentId) missing.push("WENDAO_AGENT_ID");
  if (!config.modelId) missing.push("WENDAO_MODEL_ID");
  return missing;
}

export function normalizeAgentChatRequest(value: JsonRecord): AgentChatRequest {
  const message = stringValue(value.message);
  if (!message) throw httpError("message is required.", 400);
  return {
    message,
    courseId: optionalString(value.courseId),
    knowledgePoint: optionalString(value.knowledgePoint),
    teachingStage: optionalString(value.teachingStage),
    datasetList: stringArray(value.datasetList),
    fileIds: stringArray(value.fileIds),
    imageIds: stringArray(value.imageIds),
  };
}

export async function callWendaoAgent(
  request: AgentChatRequest,
  config: WendaoAgentConfig,
  signal?: AbortSignal,
): Promise<AgentChatResponse> {
  const missing = getMissingWendaoAgentConfig(config);
  if (missing.length) throw httpError(`Missing Wendao agent configuration: ${missing.join(", ")}`, 424, { missing });

  // Unified Agent Gateway abstraction for the currently running Node server.
  // This mirrors src/server/agents/wendaoAdapter.ts until the project fully moves
  // to App Router routes.
  const upstreamPayload = {
    agentId: config.agentId,
    modelId: config.modelId,
    message: request.message,
    courseId: request.courseId,
    knowledgePoint: request.knowledgePoint,
    teachingStage: request.teachingStage,
    datasetList: request.datasetList || [],
    fileIds: request.fileIds || [],
    imageIds: request.imageIds || [],
    // Waiting for Wendao's official API schema. These compatibility aliases
    // stay server-side so the frontend remains coupled only to /api/agent/chat.
    file_ids: request.fileIds || [],
    image_ids: request.imageIds || [],
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs || DEFAULT_TIMEOUT_MS);
  const abortListener = () => controller.abort();
  signal?.addEventListener("abort", abortListener, { once: true });

  try {
    const response = await fetch(config.apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(upstreamPayload),
      signal: controller.signal,
    });
    const raw = await readUpstreamBody(response);
    if (!response.ok) {
      throw httpError("Wendao agent API request failed.", response.status, {
        status: response.status,
        raw,
      });
    }
    return normalizeWendaoResponse(raw);
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abortListener);
  }
}

async function readUpstreamBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { text };
  }
}

function normalizeWendaoResponse(raw: unknown): AgentChatResponse {
  const record = asRecord(raw);
  const data = asRecord(record.data);
  const answer =
    pickString(record, ["answer", "content", "text", "message", "output"]) ||
    pickString(data, ["answer", "content", "text", "message", "output"]) ||
    extractOpenAiCompatibleAnswer(record) ||
    "闻道智能体已返回结果，但当前适配器暂未识别到文本字段。";
  const citations = normalizeCitations(record.citations || record.sources || record.references || data.citations || data.sources || data.references);
  return {
    answer,
    citations: citations.length ? citations : undefined,
    raw,
  };
}

function extractOpenAiCompatibleAnswer(record: JsonRecord): string {
  const choices = Array.isArray(record.choices) ? record.choices : [];
  const first = asRecord(choices[0]);
  const message = asRecord(first.message);
  return stringValue(message.content);
}

function normalizeCitations(value: unknown): AgentCitation[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      const record = asRecord(item);
      const title = pickString(record, ["title", "name", "source", "fileName"]) || `来源 ${index + 1}`;
      return {
        title,
        url: optionalString(record.url || record.sourceUrl || record.href),
        excerpt: optionalString(record.excerpt || record.snippet || record.content || record.text),
      };
    })
    .filter((item) => item.title);
}

function pickString(record: JsonRecord, keys: string[]): string {
  for (const key of keys) {
    const value = stringValue(record[key]);
    if (value) return value;
  }
  return "";
}

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function optionalString(value: unknown): string | undefined {
  const text = stringValue(value);
  return text || undefined;
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : value === undefined || value === null ? "" : String(value).trim();
}

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.map((item) => stringValue(item)).filter(Boolean);
  return items.length ? Array.from(new Set(items)) : undefined;
}
