import type { SupabaseClient } from "@supabase/supabase-js";
import { ApiError, databaseError } from "./errors";

export type CourseSource = {
  id: string;
  title: string;
  mimeType?: string;
  parseStatus?: string;
  embeddingStatus?: string;
  extractedText?: string;
};

function normalizeSource(row: Record<string, unknown>): CourseSource {
  return {
    id: String(row.id),
    title: String(row.title || row.file_name || row.storage_path || row.id),
    mimeType: row.mime_type ? String(row.mime_type) : undefined,
    parseStatus: row.parse_status ? String(row.parse_status) : undefined,
    embeddingStatus: row.embedding_status ? String(row.embedding_status) : undefined,
    extractedText: row.extracted_text ? String(row.extracted_text) : undefined,
  };
}

export async function loadCourseSources(
  supabase: SupabaseClient,
  courseId: string,
  sourceFileIds: string[],
  fallbackLimit = 20,
): Promise<CourseSource[]> {
  let query = supabase
    .from("files")
    .select("id, title, file_name, storage_path, mime_type, parse_status, embedding_status, extracted_text")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });

  if (sourceFileIds.length > 0) {
    query = query.in("id", sourceFileIds);
  } else {
    query = query.limit(fallbackLimit);
  }

  const { data, error } = await query;
  if (error) throw databaseError("Failed to load course source files.", error);

  const rows = (data || []) as Record<string, unknown>[];
  if (sourceFileIds.length > 0 && rows.length !== new Set(sourceFileIds).size) {
    throw new ApiError(403, "FORBIDDEN", "One or more source files are not available in this course.");
  }

  return rows.map(normalizeSource);
}

export function renderSourcesForPrompt(sources: CourseSource[]) {
  if (!sources.length) {
    return "No parsed source files were supplied. State source limitations explicitly.";
  }

  return sources
    .map((source) => {
      const text = source.extractedText?.slice(0, 3000) || "[No extracted text yet. Use only file metadata.]";
      return [
        `Source ID: ${source.id}`,
        `Title: ${source.title}`,
        `MIME: ${source.mimeType || "unknown"}`,
        `Parse status: ${source.parseStatus || "unknown"}`,
        `Embedding status: ${source.embeddingStatus || "unknown"}`,
        `Extract: ${text}`,
      ].join("\n");
    })
    .join("\n\n---\n\n");
}
