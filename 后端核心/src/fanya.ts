import crypto from "node:crypto";
import type { AppConfig, FanyaConfig, HttpError, JsonRecord } from "./types";
import { getMissingFanyaConfig } from "./config";

function maskUrl(value: string): string {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return "configured";
  }
}

export function publicFanyaConfig(config: AppConfig): JsonRecord {
  return {
    apiBaseUrl: config.fanya.apiBaseUrl ? maskUrl(config.fanya.apiBaseUrl) : "",
    authMode: config.fanya.authMode,
    schoolId: config.fanya.schoolId || "",
    defaultCourseId: config.fanya.defaultCourseId || "",
    endpoints: Object.fromEntries(
      Object.entries(config.fanya.endpoints).map(([key, value]) => [key, Boolean(value)]),
    ),
  };
}

export function renderFanyaStatus(state: string, config: AppConfig, extra: JsonRecord = {}): JsonRecord {
  const missing = getMissingFanyaConfig(config);
  return {
    ok: missing.length === 0 && state !== "error",
    state: missing.length ? "not_configured" : state,
    connected: state === "connected",
    missing,
    config: publicFanyaConfig(config),
    ...extra,
  };
}

function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => encodeURIComponent(values[key] || ""));
}

function buildFanyaUrl(config: FanyaConfig, endpoint: string, values: Record<string, string> = {}): URL {
  const merged = {
    schoolId: config.schoolId,
    courseId: config.defaultCourseId,
    classId: config.defaultClassId,
    ...values,
  };
  const pathWithValues = fillTemplate(endpoint, merged);
  return new URL(pathWithValues, config.apiBaseUrl);
}

function buildAuthHeaders(config: FanyaConfig, method: string, url: URL, bodyText: string): Record<string, string> {
  const headers: Record<string, string> = { accept: "application/json" };
  if (bodyText) headers["content-type"] = "application/json; charset=utf-8";

  if (config.authMode === "bearer") {
    headers.authorization = `Bearer ${config.accessToken}`;
  }

  if (config.authMode === "custom-header") {
    headers[config.authHeaderName] = config.authHeaderValue;
  }

  if (config.authMode === "session-cookie") {
    headers.cookie = config.cookie;
  }

  if (config.authMode === "app-sign") {
    const timestamp = String(Date.now());
    const nonce = crypto.randomBytes(12).toString("hex");
    const canonical = [method.toUpperCase(), url.pathname + url.search, timestamp, nonce, bodyText || ""].join("\n");
    const signature = crypto.createHmac("sha256", config.appSecret).update(canonical).digest("hex");
    headers["x-app-id"] = config.appId;
    headers["x-timestamp"] = timestamp;
    headers["x-nonce"] = nonce;
    headers["x-signature"] = signature;
  }

  return headers;
}

export async function callFanya(
  config: AppConfig,
  endpointName: keyof FanyaConfig["endpoints"],
  options: { method?: string; values?: Record<string, string>; body?: unknown } = {},
): Promise<{ status: number; data: unknown }> {
  const endpoint = config.fanya.endpoints[endpointName];
  if (!endpoint) {
    const error = new Error(`Endpoint is not configured: FANYA_ENDPOINT_${endpointName.toUpperCase()}`) as HttpError;
    error.status = 424;
    throw error;
  }

  const url = buildFanyaUrl(config.fanya, endpoint, options.values);
  const method = options.method || "GET";
  const bodyText = options.body ? JSON.stringify(options.body) : "";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.fanya.timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: buildAuthHeaders(config.fanya, method, url, bodyText),
      body: bodyText || undefined,
      signal: controller.signal,
    });
    const text = await response.text();
    let data: unknown = text;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      const error = new Error(`Fanya API returned HTTP ${response.status}`) as HttpError;
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return { status: response.status, data };
  } finally {
    clearTimeout(timeout);
  }
}
