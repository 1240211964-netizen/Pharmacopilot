import crypto from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { AppConfig, FanyaConfig, HttpError, JsonRecord } from "./types";

const PROXY_PREFIX = "/api/fanya/knowledge-graph/proxy/";
const FRAME_PATH = "/api/fanya/knowledge-graph/frame";
const DEFAULT_KNOWLEDGE_GRAPH_URL =
  "https://mooc2-ans.chaoxing.com/topic-ans/knowgraph/index.html#/knowledgeMap/frameDiagramTeacher?courseid=251769346&clazzid=131807646&courseId=251769346&classId=131807646&clazzId=131807646&cpi=18085305&enc=399a5e53fc07ceeee1367420f088ffd5&openc=fa9f34ffaedc53b0a54335cd85a002ac&t=1778920097391&ut=t&modeType=2&topicModelId=0";

export function getFanyaKnowledgeGraphUrl(config: AppConfig): string {
  return config.fanya.knowledgeGraphUrl || DEFAULT_KNOWLEDGE_GRAPH_URL;
}

export function renderFanyaKnowledgeStatus(config: AppConfig): JsonRecord {
  const graphUrl = getFanyaKnowledgeGraphUrl(config);
  const missing: string[] = [];
  if (!config.fanya.knowledgeProxyEnabled) missing.push("FANYA_KNOWLEDGE_PROXY_ENABLED=true");
  if (!graphUrl) missing.push("FANYA_KNOWLEDGE_GRAPH_URL");
  if (!hasServerCredential(config.fanya)) {
    missing.push("FANYA_COOKIE or server-side Fanya auth");
  }

  const canPreview = missing.length === 0;
  let state = "external_only";
  if (canPreview) {
    state = "proxy_ready";
  } else if (config.fanya.knowledgeProxyEnabled) {
    state = "missing_server_auth";
  }

  return {
    ok: true,
    state,
    canPreview,
    externalUrl: graphUrl,
    frameUrl: canPreview ? `${FRAME_PATH}${safeHash(graphUrl)}` : "",
    proxyPath: FRAME_PATH,
    missing,
    security: {
      credentialLocation: "server-only",
      storesBrowserCredential: false,
      forwardsBrowserCookie: false,
    },
  };
}

export async function serveFanyaKnowledgeFrame(req: IncomingMessage, res: ServerResponse, config: AppConfig): Promise<void> {
  const status = renderFanyaKnowledgeStatus(config);
  if (!status.canPreview) {
    return html(res, 424, renderDisabledFrame(status));
  }
  const targetUrl = targetBaseUrl(config);
  const upstream = await fetchFanya(req, config, targetUrl);
  const body = await upstream.text();
  const contentType = upstream.headers.get("content-type") || "text/html; charset=utf-8";
  return sendProxiedContent(res, upstream.status, contentType, rewriteFanyaText(body, targetUrl, contentType));
}

export async function serveFanyaKnowledgeProxy(
  req: IncomingMessage,
  res: ServerResponse,
  config: AppConfig,
  pathname: string,
): Promise<void> {
  const status = renderFanyaKnowledgeStatus(config);
  if (!status.canPreview) {
    return html(res, 424, renderDisabledFrame(status));
  }
  const targetUrl = proxyTargetUrl(req, config, pathname);
  const upstream = await fetchFanya(req, config, targetUrl);
  const contentType = upstream.headers.get("content-type") || "application/octet-stream";
  if (isTextResponse(contentType)) {
    const body = await upstream.text();
    return sendProxiedContent(res, upstream.status, contentType, rewriteFanyaText(body, targetUrl, contentType));
  }
  const bytes = Buffer.from(await upstream.arrayBuffer());
  res.writeHead(upstream.status, proxyHeaders(contentType));
  res.end(bytes);
}

function hasServerCredential(config: FanyaConfig): boolean {
  if (config.authMode === "bearer") return Boolean(config.accessToken);
  if (config.authMode === "custom-header") return Boolean(config.authHeaderName && config.authHeaderValue);
  if (config.authMode === "session-cookie") return Boolean(config.cookie);
  if (config.authMode === "app-sign") return Boolean(config.appId && config.appSecret);
  return false;
}

function safeHash(urlValue: string): string {
  try {
    return new URL(urlValue).hash || "";
  } catch {
    return "";
  }
}

function targetBaseUrl(config: AppConfig): URL {
  const target = new URL(getFanyaKnowledgeGraphUrl(config));
  target.hash = "";
  return target;
}

function proxyTargetUrl(req: IncomingMessage, config: AppConfig, pathname: string): URL {
  const base = targetBaseUrl(config);
  const proxiedPath = pathname.slice(PROXY_PREFIX.length);
  const target = new URL(`/${proxiedPath}${requestSearch(req)}`, base.origin);
  assertAllowedFanyaHost(config, target);
  return target;
}

function requestSearch(req: IncomingMessage): string {
  try {
    return new URL(req.url || "/", "http://localhost").search;
  } catch {
    return "";
  }
}

function assertAllowedFanyaHost(config: AppConfig, target: URL): void {
  const allowed = new Set([targetBaseUrl(config).hostname, ...config.fanya.knowledgeProxyHosts]);
  if (!allowed.has(target.hostname)) {
    const error = new Error("Fanya proxy target host is not allowed.") as HttpError;
    error.status = 403;
    error.data = { host: target.hostname };
    throw error;
  }
}

async function fetchFanya(req: IncomingMessage, config: AppConfig, targetUrl: URL): Promise<Response> {
  assertAllowedFanyaHost(config, targetUrl);
  const method = req.method || "GET";
  const body = method === "GET" || method === "HEAD" ? undefined : await readRawBody(req);
  const response = await fetch(targetUrl, {
    method,
    headers: buildKnowledgeHeaders(req, config.fanya, method, targetUrl, body),
    body: body ? new Uint8Array(body) : undefined,
    redirect: "follow",
  });
  return response;
}

function buildKnowledgeHeaders(
  req: IncomingMessage,
  config: FanyaConfig,
  method: string,
  url: URL,
  body?: Buffer,
): Record<string, string> {
  const headers: Record<string, string> = {
    accept: String(req.headers.accept || "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"),
    "accept-language": String(req.headers["accept-language"] || "zh-CN,zh;q=0.9"),
    "user-agent": String(req.headers["user-agent"] || "Pharmacopilot-Fanya-Bridge/1.0"),
    referer: `${url.origin}/`,
  };
  const incomingContentType = req.headers["content-type"];
  if (incomingContentType && body?.length) headers["content-type"] = String(incomingContentType);

  if (config.authMode === "bearer" && config.accessToken) {
    headers.authorization = `Bearer ${config.accessToken}`;
  }
  if (config.authMode === "custom-header" && config.authHeaderName && config.authHeaderValue) {
    headers[config.authHeaderName] = config.authHeaderValue;
  }
  if (config.authMode === "session-cookie" && config.cookie) {
    headers.cookie = config.cookie;
  }
  if (config.authMode === "app-sign" && config.appId && config.appSecret) {
    const timestamp = String(Date.now());
    const nonce = crypto.randomBytes(12).toString("hex");
    const canonical = [method.toUpperCase(), url.pathname + url.search, timestamp, nonce, body?.toString("utf8") || ""].join(
      "\n",
    );
    headers["x-app-id"] = config.appId;
    headers["x-timestamp"] = timestamp;
    headers["x-nonce"] = nonce;
    headers["x-signature"] = crypto.createHmac("sha256", config.appSecret).update(canonical).digest("hex");
  }
  return headers;
}

async function readRawBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

function isTextResponse(contentType: string): boolean {
  return /text|json|javascript|ecmascript|xml|svg|css|html/i.test(contentType);
}

function rewriteFanyaText(source: string, targetUrl: URL, contentType: string): string {
  let text = source;
  text = rewriteAbsoluteFanyaUrls(text, targetUrl);
  text = text.replace(/(["'`])\/(topic-ans\/)/g, `$1${PROXY_PREFIX}$2`);
  text = text.replace(/\b(url\()(["']?)\/(topic-ans\/)/g, `$1$2${PROXY_PREFIX}$3`);

  if (/html/i.test(contentType)) {
    const baseHref = proxyBaseHref(targetUrl);
    text = text.replace(/<base\b[^>]*>/gi, "");
    text = /<head\b[^>]*>/i.test(text)
      ? text.replace(/<head(\s[^>]*)?>/i, (match) => `${match}<base href="${baseHref}">`)
      : `<base href="${baseHref}">${text}`;
    text = text.replace(/\b(src|href|action)=("|')\/(?!\/|api\/fanya\/knowledge-graph\/proxy\/)/gi, `$1=$2${PROXY_PREFIX}`);
  }
  return text;
}

function rewriteAbsoluteFanyaUrls(source: string, targetUrl: URL): string {
  const originPattern = escapeRegExp(`${targetUrl.origin}/`);
  const protocolRelativePattern = escapeRegExp(`//${targetUrl.host}/`);
  return source
    .replace(new RegExp(originPattern, "g"), PROXY_PREFIX)
    .replace(new RegExp(protocolRelativePattern, "g"), PROXY_PREFIX);
}

function proxyBaseHref(targetUrl: URL): string {
  const path = targetUrl.pathname.endsWith("/")
    ? targetUrl.pathname
    : targetUrl.pathname.slice(0, targetUrl.pathname.lastIndexOf("/") + 1);
  return `${PROXY_PREFIX}${path.replace(/^\//, "")}`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sendProxiedContent(res: ServerResponse, status: number, contentType: string, body: string): void {
  res.writeHead(status, proxyHeaders(contentType));
  res.end(body);
}

function proxyHeaders(contentType: string): Record<string, string> {
  return {
    "content-type": contentType,
    "cache-control": "no-store",
    "x-fanya-knowledge-bridge": "server-proxy",
  };
}

function html(res: ServerResponse, status: number, body: string): void {
  res.writeHead(status, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(body);
}

function renderDisabledFrame(status: JsonRecord): string {
  const missing = Array.isArray(status.missing) ? status.missing.join("、") : "";
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>泛雅知识图谱预览未启用</title>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #fffaf2; color: #3f3429; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      main { width: min(620px, calc(100vw - 48px)); border: 1px solid rgba(77, 63, 49, .14); border-radius: 24px; padding: 28px; background: rgba(247, 241, 232, .72); }
      span { color: #8e4d33; font-size: 12px; font-weight: 800; }
      h1 { margin: 8px 0 12px; font-size: 24px; }
      p { margin: 0; line-height: 1.7; color: #6d6257; }
      code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    </style>
  </head>
  <body>
    <main>
      <span>SERVER PREVIEW DISABLED</span>
      <h1>泛雅知识图谱服务端预览尚未启用</h1>
      <p>请在服务器环境变量中补齐 <code>${escapeHtml(missing || "FANYA_KNOWLEDGE_PROXY_ENABLED=true")}</code>。前端不会保存泛雅账号、密码、cookie 或授权码。</p>
    </main>
  </body>
</html>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    if (char === "&") return "&amp;";
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    if (char === '"') return "&quot;";
    return "&#39;";
  });
}
