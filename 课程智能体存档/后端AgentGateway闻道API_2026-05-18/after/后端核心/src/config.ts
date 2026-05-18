import fs from "node:fs/promises";
import path from "node:path";
import type { AppConfig, FanyaConfig } from "./types";

export async function loadEnv(rootDir: string): Promise<void> {
  const envPath = path.join(rootDir, ".env");
  try {
    const text = await fs.readFile(envPath, "utf8");
    text.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eq = trimmed.indexOf("=");
      if (eq === -1) return;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (key && process.env[key] === undefined) process.env[key] = value;
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

function env(key: string, fallback = ""): string {
  return process.env[key] || fallback;
}

function numberEnv(key: string, fallback: number): number {
  const value = Number(env(key, String(fallback)));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function boolEnv(key: string, fallback = false): boolean {
  const value = env(key, fallback ? "true" : "false").trim().toLowerCase();
  return ["1", "true", "yes", "on"].includes(value);
}

function csvEnv(key: string, fallback: string): string[] {
  return env(key, fallback)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getConfig(rootDir: string): AppConfig {
  const deepseekApiKey = env("DEEPSEEK_API_KEY");
  const openaiApiKey = env("OPENAI_API_KEY");
  const openaiBaseURL = env("OPENAI_BASE_URL");
  return {
    port: numberEnv("PORT", 5173),
    rootDir,
    fanya: getFanyaConfig(),
    supabase: {
      url: env("SUPABASE_URL"),
      serviceRoleKey: env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_SERVICE_KEY"),
    },
    openai: {
      apiKey: openaiApiKey || deepseekApiKey,
      baseURL: openaiBaseURL || env("DEEPSEEK_BASE_URL") || (deepseekApiKey ? "https://api.deepseek.com" : ""),
      model: env("OPENAI_MODEL") || env("DEEPSEEK_MODEL") || (deepseekApiKey ? "deepseek-chat" : "gpt-4.1-mini"),
      embeddingApiKey: env("OPENAI_EMBEDDING_API_KEY") || openaiApiKey,
      embeddingBaseURL: env("OPENAI_EMBEDDING_BASE_URL") || openaiBaseURL,
      embeddingModel: env("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small"),
      embeddingDimensions: numberEnv("OPENAI_EMBEDDING_DIMENSIONS", 1536),
    },
    rag: {
      maxUploadBytes: numberEnv("RAG_MAX_UPLOAD_BYTES", 25 * 1024 * 1024),
      chunkMinChars: numberEnv("RAG_CHUNK_MIN_CHARS", 800),
      chunkMaxChars: numberEnv("RAG_CHUNK_MAX_CHARS", 1200),
      chunkOverlapChars: numberEnv("RAG_CHUNK_OVERLAP_CHARS", 120),
      matchCount: numberEnv("RAG_MATCH_COUNT", 8),
    },
    wendaoAgent: {
      apiUrl: env("WENDAO_AGENT_API_URL"),
      apiKey: env("WENDAO_API_KEY"),
      agentId: env("WENDAO_AGENT_ID"),
      modelId: env("WENDAO_MODEL_ID"),
      timeoutMs: numberEnv("WENDAO_AGENT_TIMEOUT_MS", 20000),
    },
  };
}

function getFanyaConfig(): FanyaConfig {
  const authMode = env("FANYA_AUTH_MODE", "bearer") as FanyaConfig["authMode"];
  return {
    apiBaseUrl: env("FANYA_API_BASE_URL"),
    authMode,
    accessToken: env("FANYA_ACCESS_TOKEN"),
    authHeaderName: env("FANYA_AUTH_HEADER_NAME"),
    authHeaderValue: env("FANYA_AUTH_HEADER_VALUE"),
    cookie: env("FANYA_COOKIE"),
    appId: env("FANYA_APP_ID"),
    appSecret: env("FANYA_APP_SECRET"),
    schoolId: env("FANYA_SCHOOL_ID"),
    defaultCourseId: env("FANYA_DEFAULT_COURSE_ID"),
    defaultClassId: env("FANYA_DEFAULT_CLASS_ID"),
    timeoutMs: numberEnv("FANYA_TIMEOUT_MS", 12000),
    knowledgeGraphUrl: env("FANYA_KNOWLEDGE_GRAPH_URL"),
    knowledgeProxyEnabled: boolEnv("FANYA_KNOWLEDGE_PROXY_ENABLED", false),
    knowledgeProxyHosts: csvEnv("FANYA_KNOWLEDGE_PROXY_HOSTS", "mooc2-ans.chaoxing.com"),
    endpoints: {
      health: env("FANYA_ENDPOINT_HEALTH"),
      courses: env("FANYA_ENDPOINT_COURSES"),
      roster: env("FANYA_ENDPOINT_ROSTER"),
      assignments: env("FANYA_ENDPOINT_ASSIGNMENTS"),
      resources: env("FANYA_ENDPOINT_RESOURCES"),
      analytics: env("FANYA_ENDPOINT_ANALYTICS"),
    },
  };
}

export function getMissingFanyaConfig(config: AppConfig): string[] {
  const missing: string[] = [];
  if (!config.fanya.apiBaseUrl) missing.push("FANYA_API_BASE_URL");
  if (config.fanya.authMode === "bearer" && !config.fanya.accessToken) missing.push("FANYA_ACCESS_TOKEN");
  if (config.fanya.authMode === "custom-header") {
    if (!config.fanya.authHeaderName) missing.push("FANYA_AUTH_HEADER_NAME");
    if (!config.fanya.authHeaderValue) missing.push("FANYA_AUTH_HEADER_VALUE");
  }
  if (config.fanya.authMode === "session-cookie" && !config.fanya.cookie) missing.push("FANYA_COOKIE");
  if (config.fanya.authMode === "app-sign") {
    if (!config.fanya.appId) missing.push("FANYA_APP_ID");
    if (!config.fanya.appSecret) missing.push("FANYA_APP_SECRET");
  }
  return missing;
}

export function getMissingRagConfig(config: AppConfig): string[] {
  const missing: string[] = [];
  if (!config.supabase.url) missing.push("SUPABASE_URL");
  if (!config.supabase.serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!config.openai.embeddingApiKey) missing.push("OPENAI_API_KEY");
  return missing;
}
