const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const rootDir = __dirname;
const publicFiles = new Map([
  ["/", "index.html"],
  ["/interface-review-improved.html", "interface-review-improved.html"],
  ["/launch", "index.html"],
  ["/launch/", "index.html"],
  ["/index.html", "index.html"],
  ["/flowchart", "flowchart.html"],
  ["/flowchart/", "flowchart.html"],
  ["/flowchart.html", "flowchart.html"],
  ["/styles.css", "styles.css"],
  ["/launch/styles.css", "styles.css"],
  ["/app.js", "app.js"],
  ["/launch/app.js", "app.js"],
]);

function loadEnv() {
  const envPath = path.join(rootDir, ".env");
  return fs
    .readFile(envPath, "utf8")
    .then((text) => {
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
    })
    .catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
}

function env(key, fallback = "") {
  return process.env[key] || fallback;
}

function getConfig() {
  return {
    port: Number(env("PORT", "5173")),
    fanya: {
      apiBaseUrl: env("FANYA_API_BASE_URL"),
      authMode: env("FANYA_AUTH_MODE", "bearer"),
      accessToken: env("FANYA_ACCESS_TOKEN"),
      authHeaderName: env("FANYA_AUTH_HEADER_NAME"),
      authHeaderValue: env("FANYA_AUTH_HEADER_VALUE"),
      cookie: env("FANYA_COOKIE"),
      appId: env("FANYA_APP_ID"),
      appSecret: env("FANYA_APP_SECRET"),
      schoolId: env("FANYA_SCHOOL_ID"),
      defaultCourseId: env("FANYA_DEFAULT_COURSE_ID"),
      defaultClassId: env("FANYA_DEFAULT_CLASS_ID"),
      timeoutMs: Number(env("FANYA_TIMEOUT_MS", "12000")),
      endpoints: {
        health: env("FANYA_ENDPOINT_HEALTH"),
        courses: env("FANYA_ENDPOINT_COURSES"),
        roster: env("FANYA_ENDPOINT_ROSTER"),
        assignments: env("FANYA_ENDPOINT_ASSIGNMENTS"),
        resources: env("FANYA_ENDPOINT_RESOURCES"),
        analytics: env("FANYA_ENDPOINT_ANALYTICS"),
      },
    },
  };
}

function getMissingConfig(config) {
  const missing = [];
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

function publicConfig(config) {
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

function maskUrl(value) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return "configured";
  }
}

function json(res, status, body) {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(payload);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.status = 400;
    throw error;
  }
}

function renderStatus(state, config, extra = {}) {
  const missing = getMissingConfig(config);
  return {
    ok: missing.length === 0 && state !== "error",
    state: missing.length ? "not_configured" : state,
    connected: state === "connected",
    missing,
    config: publicConfig(config),
    ...extra,
  };
}

function fillTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => encodeURIComponent(values[key] || ""));
}

function buildFanyaUrl(config, endpoint, values = {}) {
  const merged = {
    schoolId: config.fanya.schoolId,
    courseId: config.fanya.defaultCourseId,
    classId: config.fanya.defaultClassId,
    ...values,
  };
  const pathWithValues = fillTemplate(endpoint, merged);
  return new URL(pathWithValues, config.fanya.apiBaseUrl);
}

function buildAuthHeaders(config, method, url, bodyText) {
  const headers = {
    accept: "application/json",
  };

  if (bodyText) headers["content-type"] = "application/json; charset=utf-8";

  if (config.fanya.authMode === "bearer") {
    headers.authorization = `Bearer ${config.fanya.accessToken}`;
  }

  if (config.fanya.authMode === "custom-header") {
    headers[config.fanya.authHeaderName] = config.fanya.authHeaderValue;
  }

  if (config.fanya.authMode === "session-cookie") {
    headers.cookie = config.fanya.cookie;
  }

  if (config.fanya.authMode === "app-sign") {
    const timestamp = String(Date.now());
    const nonce = crypto.randomBytes(12).toString("hex");
    const canonical = [method.toUpperCase(), url.pathname + url.search, timestamp, nonce, bodyText || ""].join("\n");
    const signature = crypto.createHmac("sha256", config.fanya.appSecret).update(canonical).digest("hex");
    headers["x-app-id"] = config.fanya.appId;
    headers["x-timestamp"] = timestamp;
    headers["x-nonce"] = nonce;
    headers["x-signature"] = signature;
  }

  return headers;
}

async function callFanya(config, endpointName, options = {}) {
  const endpoint = config.fanya.endpoints[endpointName];
  if (!endpoint) {
    const error = new Error(`Endpoint is not configured: FANYA_ENDPOINT_${endpointName.toUpperCase()}`);
    error.status = 424;
    throw error;
  }

  const url = buildFanyaUrl(config, endpoint, options.values);
  const method = options.method || "GET";
  const bodyText = options.body ? JSON.stringify(options.body) : "";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.fanya.timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: buildAuthHeaders(config, method, url, bodyText),
      body: bodyText || undefined,
      signal: controller.signal,
    });
    const text = await response.text();
    let data = text;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      const error = new Error(`Fanya API returned HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return {
      status: response.status,
      data,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function handleApi(req, res, pathname, config) {
  const missing = getMissingConfig(config);

  if (req.method === "GET" && pathname === "/api/fanya/status") {
    return json(res, 200, renderStatus("configured", config, {
      message: missing.length
        ? "Connector is not configured. Copy .env.example to .env and fill in the school-authorized values."
        : "Connector configuration is present. Use /api/fanya/connect to verify the upstream API.",
    }));
  }

  if (req.method === "POST" && pathname === "/api/fanya/connect") {
    if (missing.length) {
      return json(res, 200, renderStatus("not_configured", config, {
        message: "Missing required Fanya connector configuration.",
      }));
    }
    try {
      const endpointName = config.fanya.endpoints.health ? "health" : "courses";
      const upstream = await callFanya(config, endpointName);
      return json(res, 200, renderStatus("connected", config, {
        message: "Successfully verified the Fanya API connection.",
        upstream: { endpoint: endpointName, status: upstream.status },
      }));
    } catch (error) {
      return json(res, error.status && error.status < 600 ? error.status : 502, renderStatus("error", config, {
        message: error.message,
        upstream: error.data,
      }));
    }
  }

  if (req.method === "GET" && pathname === "/api/fanya/courses") {
    if (missing.length) return json(res, 424, renderStatus("not_configured", config));
    try {
      const upstream = await callFanya(config, "courses");
      return json(res, 200, { ok: true, data: upstream.data });
    } catch (error) {
      return json(res, error.status && error.status < 600 ? error.status : 502, {
        ok: false,
        message: error.message,
        upstream: error.data,
      });
    }
  }

  if (req.method === "POST" && pathname === "/api/fanya/sync-assignment") {
    if (missing.length) return json(res, 424, renderStatus("not_configured", config));
    const body = await readBody(req);
    try {
      const upstream = await callFanya(config, "assignments", {
        method: "POST",
        values: {
          courseId: body.courseId || config.fanya.defaultCourseId,
          classId: body.classId || config.fanya.defaultClassId,
        },
        body,
      });
      return json(res, 200, { ok: true, data: upstream.data });
    } catch (error) {
      return json(res, error.status && error.status < 600 ? error.status : 502, {
        ok: false,
        message: error.message,
        upstream: error.data,
      });
    }
  }

  return json(res, 404, { ok: false, message: "API route not found." });
}

async function serveStatic(res, pathname) {
  if (pathname === "/favicon.ico") {
    res.writeHead(204, { "cache-control": "max-age=86400" });
    res.end();
    return;
  }

  const fileName = publicFiles.get(pathname);
  if (!fileName) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  const filePath = path.join(rootDir, fileName);
  const ext = path.extname(filePath);
  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
  };
  const content = await fs.readFile(filePath);
  res.writeHead(200, {
    "content-type": contentTypes[ext] || "application/octet-stream",
    "cache-control": "no-store",
  });
  res.end(content);
}

async function main() {
  await loadEnv();
  const config = getConfig();
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      if (url.pathname.startsWith("/api/")) {
        await handleApi(req, res, url.pathname, config);
        return;
      }
      await serveStatic(res, url.pathname);
    } catch (error) {
      json(res, error.status || 500, { ok: false, message: error.message });
    }
  });

  server.listen(config.port, () => {
    console.log(`CoursePilot Agent server running at http://localhost:${config.port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
