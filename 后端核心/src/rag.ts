import OpenAI from "openai";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  AppConfig,
  JsonRecord,
  KnowledgeCitation,
  RetrievedChunk,
  SourceBoundaryFilter,
  UploadedFile,
} from "./types";
import { getMissingRagConfig } from "./config";
import { httpError } from "./http-utils";
import { chunkText } from "./chunking";
import { extractTextFromUpload } from "./text-extraction";
import { extensionFromFileName, parseSourceBoundary, sourceBoundarySummary, sourceFilterForRpc } from "./source-boundary";

let supabaseClient: SupabaseClient | null = null;
let openaiClient: OpenAI | null = null;

export interface IngestKnowledgeOptions {
  userId: string;
  courseId?: string;
  files: UploadedFile[];
  sourceBoundary?: string;
  sourceType?: string;
  sourceUri?: string;
  sourceLabel?: string;
  metadata?: JsonRecord;
}

export interface IngestedFileSummary {
  fileId: string;
  name: string;
  mimeType: string;
  chunkCount: number;
  textCharCount: number;
  sourceType: string;
  sourceLabel: string;
  metadata: JsonRecord;
}

export interface RetrieveKnowledgeOptions {
  userId: string;
  courseId?: string;
  topic: string;
  teachingAction?: string;
  query?: string;
  sourceBoundary?: string;
  limit?: number;
}

export function assertRagConfigured(config: AppConfig): void {
  const missing = getMissingRagConfig(config);
  if (missing.length) {
    throw httpError("RAG is not configured. Fill Supabase and OpenAI environment variables first.", 424, { missing });
  }
  if (config.openai.embeddingDimensions !== 1536) {
    throw httpError("OPENAI_EMBEDDING_DIMENSIONS must be 1536 for the provided pgvector migration.", 424);
  }
}

export async function ingestKnowledgeFiles(config: AppConfig, options: IngestKnowledgeOptions): Promise<IngestedFileSummary[]> {
  assertRagConfigured(config);
  if (!options.userId) throw httpError("userId is required.", 400);
  if (!options.files.length) throw httpError("At least one file is required.", 400);

  const supabase = getSupabase(config);
  const summaries: IngestedFileSummary[] = [];
  const parsedBoundary = parseSourceBoundary(options.sourceBoundary || "");

  for (const file of options.files) {
    const extracted = await extractTextFromUpload(file);
    const chunks = chunkText(extracted.text, {
      minChars: config.rag.chunkMinChars,
      maxChars: config.rag.chunkMaxChars,
      overlapChars: config.rag.chunkOverlapChars,
    });
    if (!chunks.length) {
      throw httpError(`No extractable text found in ${file.fileName}.`, 422);
    }

    const sourceType = options.sourceType || "upload";
    const sourceLabel = options.sourceLabel || file.fileName;
    const extension = extensionFromFileName(file.fileName);
    const fileMetadata = {
      ...options.metadata,
      ...extracted.metadata,
      extension,
      source_boundary: options.sourceBoundary || "",
      source_boundary_filter: parsedBoundary,
    };

    const { data: insertedFile, error: fileError } = await supabase
      .from("knowledge_files")
      .insert({
        user_id: options.userId,
        course_id: options.courseId || null,
        file_name: file.fileName,
        mime_type: file.mimeType,
        source_type: sourceType,
        source_uri: options.sourceUri || null,
        source_label: sourceLabel,
        metadata: fileMetadata,
        text_char_count: Array.from(extracted.text).length,
        chunk_count: chunks.length,
      })
      .select("id")
      .single();

    if (fileError || !insertedFile?.id) {
      throw httpError(`Failed to create knowledge file row for ${file.fileName}.`, 502, fileError);
    }

    const embeddings = await embedTexts(config, chunks.map((chunk) => chunk.content));
    const rows = chunks.map((chunk, index) => ({
      file_id: insertedFile.id,
      user_id: options.userId,
      course_id: options.courseId || null,
      chunk_index: chunk.chunkIndex,
      content: chunk.content,
      embedding: toVectorLiteral(embeddings[index]),
      source_type: sourceType,
      source_uri: options.sourceUri || null,
      source_label: sourceLabel,
      char_start: chunk.charStart,
      char_end: chunk.charEnd,
      metadata: {
        ...fileMetadata,
        ...chunk.metadata,
        file_name: file.fileName,
      },
    }));

    for (let index = 0; index < rows.length; index += 50) {
      const batch = rows.slice(index, index + 50);
      const { error: chunkError } = await supabase.from("knowledge_chunks").insert(batch);
      if (chunkError) {
        throw httpError(`Failed to insert knowledge chunks for ${file.fileName}.`, 502, chunkError);
      }
    }

    summaries.push({
      fileId: insertedFile.id,
      name: file.fileName,
      mimeType: file.mimeType,
      chunkCount: chunks.length,
      textCharCount: Array.from(extracted.text).length,
      sourceType,
      sourceLabel,
      metadata: fileMetadata,
    });
  }

  return summaries;
}

export async function retrieveKnowledge(config: AppConfig, options: RetrieveKnowledgeOptions): Promise<{
  chunks: RetrievedChunk[];
  sourceBoundary: SourceBoundaryFilter;
  sourceBoundarySummary: string[];
}> {
  assertRagConfigured(config);
  if (!options.userId) throw httpError("userId is required.", 400);

  const filter = parseSourceBoundary(options.sourceBoundary || "");
  const query = [options.topic, options.teachingAction, options.query]
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .join("\n");
  const embedding = await embedTexts(config, [query || "课程教学内容检索"]);
  const supabase = getSupabase(config);
  const { data, error } = await supabase.rpc("match_knowledge_chunks", {
    query_embedding: toVectorLiteral(embedding[0]),
    match_user_id: options.userId,
    match_course_id: options.courseId || null,
    match_count: options.limit || config.rag.matchCount,
    source_filter: sourceFilterForRpc(filter),
  });

  if (error) throw httpError("Failed to retrieve knowledge chunks.", 502, error);

  const chunks = ((data || []) as JsonRecord[]).map((row, index) => {
    const content = String(row.content || "");
    const metadata = (row.metadata && typeof row.metadata === "object" ? row.metadata : {}) as JsonRecord;
    return {
      refId: `K${index + 1}`,
      chunkId: String(row.chunk_id || row.id || ""),
      fileId: String(row.file_id || ""),
      fileName: String(row.file_name || metadata.file_name || "未命名文件"),
      chunkIndex: Number(row.chunk_index || 0),
      content,
      snippet: makeSnippet(content),
      similarity: typeof row.similarity === "number" ? row.similarity : Number(row.similarity || 0),
      sourceLabel: String(row.source_label || ""),
      sourceUri: String(row.source_uri || ""),
      metadata,
    };
  });

  return {
    chunks,
    sourceBoundary: filter,
    sourceBoundarySummary: sourceBoundarySummary(filter),
  };
}

export async function saveSourceBoundary(
  config: AppConfig,
  userId: string,
  courseId: string | undefined,
  boundaryText: string,
): Promise<{ parsed: SourceBoundaryFilter; saved: boolean }> {
  const parsed = parseSourceBoundary(boundaryText);
  const missing = getMissingRagConfig(config).filter((key) => key !== "OPENAI_API_KEY");
  if (missing.length || !userId) return { parsed, saved: false };

  const supabase = getSupabase(config);
  const { error } = await supabase.from("knowledge_source_boundaries").upsert(
    {
      user_id: userId,
      course_id: courseId || "",
      boundary_text: boundaryText,
      parsed_filter: parsed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,course_id" },
  );
  if (error) return { parsed, saved: false };
  return { parsed, saved: true };
}

export function buildKnowledgeContext(chunks: RetrievedChunk[]): string {
  if (!chunks.length) return "未检索到符合用户、课程和来源边界的课程知识库片段。";
  return chunks
    .map((chunk) => {
      const header = [
        `[${chunk.refId}]`,
        `file_id=${chunk.fileId}`,
        `file=${chunk.fileName}`,
        `chunk_index=${chunk.chunkIndex}`,
        chunk.sourceLabel ? `source=${chunk.sourceLabel}` : "",
        chunk.sourceUri ? `uri=${chunk.sourceUri}` : "",
      ]
        .filter(Boolean)
        .join(" | ");
      return `${header}\n${chunk.content}`;
    })
    .join("\n\n---\n\n");
}

export function citationsFromChunks(chunks: RetrievedChunk[]): KnowledgeCitation[] {
  return chunks.map(({ content: _content, metadata: _metadata, ...citation }) => citation);
}

async function embedTexts(config: AppConfig, texts: string[]): Promise<number[][]> {
  const openai = getOpenAI(config);
  const embeddings: number[][] = [];
  for (let index = 0; index < texts.length; index += 64) {
    const batch = texts.slice(index, index + 64);
    const response = await openai.embeddings.create({
      model: config.openai.embeddingModel,
      input: batch,
      dimensions: config.openai.embeddingDimensions,
    });
    response.data.forEach((item) => embeddings.push(item.embedding));
  }
  return embeddings;
}

function getSupabase(config: AppConfig): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabaseClient;
}

function getOpenAI(config: AppConfig): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: config.openai.apiKey });
  }
  return openaiClient;
}

function toVectorLiteral(values: number[] | undefined): string {
  if (!values?.length) throw httpError("Embedding provider returned an empty vector.", 502);
  return `[${values.map((value) => Number(value).toFixed(8)).join(",")}]`;
}

function makeSnippet(text: string): string {
  return Array.from(text.replace(/\s+/g, " ").trim()).slice(0, 120).join("");
}
