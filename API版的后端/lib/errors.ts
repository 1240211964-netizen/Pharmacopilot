import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "SERVER_CONFIG"
  | "DATABASE_ERROR"
  | "STORAGE_ERROR"
  | "AI_ERROR"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  status: number;
  code: ErrorCode;
  details?: unknown;

  constructor(status: number, code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function databaseError(message: string, details?: unknown): ApiError {
  return new ApiError(500, "DATABASE_ERROR", message, details);
}

export function storageError(message: string, details?: unknown): ApiError {
  return new ApiError(500, "STORAGE_ERROR", message, details);
}

export function fail(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.status },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "BAD_REQUEST",
          message: "Request validation failed.",
          details: error.issues,
        },
      },
      { status: 400 },
    );
  }

  const message = error instanceof Error ? error.message : "Unexpected server error.";
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message,
      },
    },
    { status: 500 },
  );
}

export function withApiHandler(handler: (request: Request) => Promise<Response>) {
  return async function routeHandler(request: Request) {
    try {
      return await handler(request);
    } catch (error) {
      return fail(error);
    }
  };
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "BAD_REQUEST", "Request body must be valid JSON.");
  }
}
