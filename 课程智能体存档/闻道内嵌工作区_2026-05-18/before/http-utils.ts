import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import Busboy from "busboy";
import type { AppConfig, HttpError, JsonRecord, MultipartBody, UploadedFile } from "./types";

const publicFiles = new Map<string, string>([
  ["/", "index.html"],
  ["/auth", "auth.html"],
  ["/auth/", "auth.html"],
  ["/auth.html", "auth.html"],
  ["/login", "auth.html"],
  ["/login/", "auth.html"],
  ["/login.html", "auth.html"],
  ["/register", "auth.html"],
  ["/register/", "auth.html"],
  ["/register.html", "auth.html"],
  ["/teaching-navigation", "teaching-navigation.html"],
  ["/teaching-navigation/", "teaching-navigation.html"],
  ["/teaching-navigation.html", "teaching-navigation.html"],
  ["/navigation.html", "navigation.html"],
  ["/practice.html", "practice.html"],
  ["/teaching-data", "teaching-data.html"],
  ["/teaching-data/", "teaching-data.html"],
  ["/teaching-data.html", "teaching-data.html"],
  ["/assets.html", "teaching-data.html"],
  ["/workflow.html", "workflow.html"],
  ["/interface-review-improved.html", "interface-review-improved.html"],
  ["/launch", "index.html"],
  ["/launch/", "index.html"],
  ["/launch/auth.html", "auth.html"],
  ["/launch/login", "auth.html"],
  ["/launch/register", "auth.html"],
  ["/launch/teaching-navigation.html", "teaching-navigation.html"],
  ["/launch/navigation.html", "navigation.html"],
  ["/launch/practice.html", "practice.html"],
  ["/launch/teaching-data.html", "teaching-data.html"],
  ["/launch/assets.html", "teaching-data.html"],
  ["/index.html", "index.html"],
  ["/flowchart", "flowchart.html"],
  ["/flowchart/", "flowchart.html"],
  ["/flowchart.html", "flowchart.html"],
  ["/workflow", "workflow.html"],
  ["/workflow/", "workflow.html"],
  ["/styles.css", "styles.css"],
  ["/launch/styles.css", "styles.css"],
  ["/app.js", "app.js"],
  ["/launch/app.js", "app.js"],
  ["/agent-runtime/events.js", "agent-runtime/events.js"],
  ["/agent-runtime/state-store.js", "agent-runtime/state-store.js"],
  ["/agent-runtime/action-engine.js", "agent-runtime/action-engine.js"],
  ["/agent-runtime/agent-client.js", "agent-runtime/agent-client.js"],
  ["/launch/agent-runtime/events.js", "agent-runtime/events.js"],
  ["/launch/agent-runtime/state-store.js", "agent-runtime/state-store.js"],
  ["/launch/agent-runtime/action-engine.js", "agent-runtime/action-engine.js"],
  ["/launch/agent-runtime/agent-client.js", "agent-runtime/agent-client.js"],
]);

export function httpError(message: string, status = 500, data?: unknown): HttpError {
  const error = new Error(message) as HttpError;
  error.status = status;
  error.data = data;
  return error;
}

export function json(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(payload);
}

export async function readJsonBody(req: IncomingMessage): Promise<JsonRecord> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as JsonRecord;
  } catch {
    throw httpError("Request body must be valid JSON.", 400);
  }
}

export function readMultipartBody(req: IncomingMessage, maxBytes: number): Promise<MultipartBody> {
  return new Promise((resolve, reject) => {
    const fields: Record<string, string> = {};
    const files: UploadedFile[] = [];
    const busboy = Busboy({
      headers: req.headers,
      limits: {
        fileSize: maxBytes,
        files: 12,
        fields: 40,
      },
    });

    busboy.on("field", (name: string, value: string) => {
      fields[name] = value;
    });

    busboy.on("file", (fieldName: string, file, info) => {
      const chunks: Buffer[] = [];
      let truncated = false;
      file.on("data", (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
      file.on("limit", () => {
        truncated = true;
      });
      file.on("end", () => {
        if (!info.filename) return;
        if (truncated) {
          reject(httpError(`File is too large: ${info.filename}`, 413));
          return;
        }
        files.push({
          fieldName,
          fileName: info.filename,
          mimeType: info.mimeType || "application/octet-stream",
          buffer: Buffer.concat(chunks),
        });
      });
    });

    busboy.on("error", (error: Error) => reject(error));
    busboy.on("finish", () => resolve({ fields, files }));
    req.pipe(busboy);
  });
}

export async function serveStatic(res: ServerResponse, pathname: string, config: AppConfig): Promise<void> {
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

  const candidatePaths = [
    path.join(config.rootDir, "dist", fileName),
    path.join(config.rootDir, fileName),
    path.join(config.rootDir, "前端核心", fileName),
  ];
  let resolvedPath = candidatePaths[0];
  for (const candidatePath of candidatePaths) {
    try {
      await fs.access(candidatePath);
      resolvedPath = candidatePath;
      break;
    } catch {
      // Try the next known static location.
    }
  }
  const ext = path.extname(resolvedPath);
  const contentTypes: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
  };
  const content = await fs.readFile(resolvedPath);
  res.writeHead(200, {
    "content-type": contentTypes[ext] || "application/octet-stream",
    "cache-control": "no-store",
  });
  res.end(content);
}
