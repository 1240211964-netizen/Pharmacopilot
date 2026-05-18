import type { AgentChatRequest, AgentChatResponse, AgentCitation, WendaoAgentRuntimeConfig } from "./types";

const DEFAULT_TIMEOUT_MS = 20000;

type JsonRecord = Record<string, unknown>;

export function getWendaoAgentRuntimeConfig(env: NodeJS.ProcessEnv = process.env): WendaoAgentRuntimeConfig {
  return {
    apiUrl: env.WENDAO_AGENT_API_URL || "",
    apiKey: env.WENDAO_API_KEY || "",
    agentId: env.WENDAO_AGENT_ID || "",
    modelId: env.WENDAO_MODEL_ID || "",
    timeoutMs: numberFromEnv(env.WENDAO_AGENT_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
  };
}

export function getMissingWendaoAgentConfig(config = getWendaoAgentRuntimeConfig()): string[] {
  const missing: string[] = [];
  if (!config.apiUrl) missing.push("WENDAO_AGENT_API_URL");
  if (!config.apiKey) missing.push("WENDAO_API_KEY");
  if (!config.agentId) missing.push("WENDAO_AGENT_ID");
  if (!config.modelId) missing.push("WENDAO_MODEL_ID");
  return missing;
}

export function normalizeAgentChatRequest(value: unknown): AgentChatRequest {
  const record = asRecord(value);
  const message = stringValue(record.message);
  if (!message) throw new WendaoAgentError("message is required.", 400);
  return {
    message,
    courseId: optionalString(record.courseId),
    knowledgePoint: optionalString(record.knowledgePoint),
    teachingStage: optionalString(record.teachingStage),
    datasetList: stringArray(record.datasetList),
    fileIds: stringArray(record.fileIds),
    imageIds: stringArray(record.imageIds),
  };
}

export async function callWendaoAgent(
  request: AgentChatRequest,
  config = getWendaoAgentRuntimeConfig(),
  signal?: AbortSignal,
): Promise<AgentChatResponse> {
  const missing = getMissingWendaoAgentConfig(config);
  if (missing.length) throw new WendaoAgentError(`Missing Wendao agent configuration: ${missing.join(", ")}`, 424, { missing });

  // Unified Agent Gateway abstraction: PharmacoPilot owns the request/response contract,
  // while the adapter maps it to the external Wendao agent contract behind the server.
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
    // Waiting for Wendao's official API schema. Keep snake_case aliases only inside
    // the server adapter so browser code never depends on the upstream field names.
    file_ids: request.fileIds || [],
    image_ids: request.imageIds || [],
  };

  const controller = new AbortController();
  const timeout = windowlessSetTimeout(() => controller.abort(), config.timeoutMs || DEFAULT_TIMEOUT_MS);
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
      throw new WendaoAgentError("Wendao agent API request failed.", response.status, {
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

export class WendaoAgentError extends Error {
  constructor(
    message: string,
    readonly status = 500,
    readonly data?: unknown,
  ) {
    super(message);
    this.name = "WendaoAgentError";
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

function numberFromEnv(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function windowlessSetTimeout(callback: () => void, ms: number): ReturnType<typeof setTimeout> {
  return setTimeout(callback, ms);
}
