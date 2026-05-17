import OpenAI from "openai";
import type { AppConfig, JsonRecord } from "../types";
import type { AgentConfig, AgentRunRequest, AgentTurnSummary, TeachingAction, TeachingActionType } from "./types";

let openaiClient: OpenAI | null = null;

export async function runAgent(
  request: AgentRunRequest,
  agent: AgentConfig,
  config: AppConfig,
  signal?: AbortSignal,
): Promise<AgentTurnSummary> {
  const startedAt = new Date().toISOString();
  const openai = getOpenAI(config);
  const response = await openai.chat.completions.create(
    {
      model: config.openai.model,
      temperature: 0.2,
      max_tokens: 4096,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(agent),
        },
        {
          role: "user",
          content: buildUserPrompt(request),
        },
      ],
    },
    signal ? { signal } : undefined,
  );

  const rawContent = response.choices[0]?.message?.content || "{}";
  const parsed = parseJsonObject(rawContent);
  const normalized = normalizeAgentOutput(parsed, agent.allowedActions);
  const endedAt = new Date().toISOString();

  return {
    id: `${agent.id}-${Date.now()}`,
    agentId: agent.id,
    agentName: agent.name,
    text: normalized.text,
    actions: normalized.actions,
    rejectedActions: normalized.rejectedActions,
    startedAt,
    endedAt,
    usage: response.usage ? (response.usage as unknown as JsonRecord) : undefined,
  };
}

function buildSystemPrompt(agent: AgentConfig): string {
  return [
    agent.systemPrompt,
    "",
    `当前 agent id：${agent.id}`,
    `当前 agent 名称：${agent.name}`,
    `允许的 actions：${agent.allowedActions.join(", ")}`,
    "",
    "必须严格输出 JSON/json 对象：",
    "{",
    '  "text": "面向教师的一段简短运行说明",',
    '  "actions": [',
    '    {"type":"practice.create_flow","payload":{"title":"...","steps":[...]}, "evidenceRefs":["..."]}',
    "  ]",
    "}",
  ].join("\n");
}

function buildUserPrompt(request: AgentRunRequest): string {
  return [
    `用户：${request.userId || "anonymous-user"}`,
    `课程 ID：${request.courseId || request.courseContext?.courseId || request.storeState?.courseContext?.courseId || "未提供"}`,
    `当前模块：${request.module || request.storeState?.currentModule || "practice"}`,
    `教师输入：${request.prompt || "请推进 PharmacoPilot 第一版多智能体运行时。"} `,
    "",
    "courseContext:",
    JSON.stringify(request.courseContext || request.storeState?.courseContext || {}, null, 2),
    "",
    "storeState:",
    JSON.stringify(request.storeState || {}, null, 2),
    "",
    "artifacts:",
    JSON.stringify(request.artifacts || request.storeState?.artifacts || {}, null, 2),
    "",
    "evidenceLedger:",
    JSON.stringify(request.evidenceLedger || [], null, 2),
    "",
    "directorState:",
    JSON.stringify(request.directorState || {}, null, 2),
  ].join("\n");
}

function normalizeAgentOutput(
  parsed: JsonRecord,
  allowedActions: TeachingActionType[],
): { text: string; actions: TeachingAction[]; rejectedActions: JsonRecord[] } {
  const text = typeof parsed.text === "string" && parsed.text.trim() ? parsed.text.trim() : "Agent 已完成本轮分析。";
  const actionsInput = Array.isArray(parsed.actions) ? parsed.actions : [];
  const actions: TeachingAction[] = [];
  const rejectedActions: JsonRecord[] = [];

  actionsInput.forEach((item, index) => {
    const normalized = normalizeAction(item, allowedActions, index);
    if (normalized.action) actions.push(normalized.action);
    if (normalized.rejected) rejectedActions.push(normalized.rejected);
  });

  return { text, actions, rejectedActions };
}

function normalizeAction(
  value: unknown,
  allowedActions: TeachingActionType[],
  index: number,
): { action?: TeachingAction; rejected?: JsonRecord } {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { rejected: { index, reason: "Action must be an object." } };
  }
  const record = value as JsonRecord;
  const type = typeof record.type === "string" ? record.type : "";
  if (!allowedActions.includes(type as TeachingActionType)) {
    return {
      rejected: {
        index,
        type,
        reason: "Action type is not allowed for this agent.",
      },
    };
  }
  const payload = record.payload && typeof record.payload === "object" && !Array.isArray(record.payload) ? (record.payload as JsonRecord) : {};
  const evidenceRefs = toStringArray(record.evidenceRefs) || toStringArray(payload.evidenceRefs);
  return {
    action: {
      id: typeof record.id === "string" ? record.id : `${type}-${Date.now()}-${index}`,
      type: type as TeachingActionType,
      target: typeof record.target === "string" ? record.target : undefined,
      payload,
      evidenceRefs,
      confidence: typeof record.confidence === "number" ? record.confidence : undefined,
      requiresTeacherReview: typeof record.requiresTeacherReview === "boolean" ? record.requiresTeacherReview : undefined,
    },
  };
}

function parseJsonObject(text: string): JsonRecord {
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as JsonRecord) : {};
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Agent did not return valid JSON.");
    const parsed = JSON.parse(match[0]);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as JsonRecord) : {};
  }
}

function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim());
  return items.length ? items : undefined;
}

function getOpenAI(config: AppConfig): OpenAI {
  if (!config.openai.apiKey) throw new Error("OPENAI_API_KEY or DEEPSEEK_API_KEY is required for /api/agent/run.");
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: config.openai.apiKey,
      baseURL: config.openai.baseURL || undefined,
    });
  }
  return openaiClient;
}
