import type { IncomingMessage, ServerResponse } from "node:http";

export type JsonRecord = Record<string, unknown>;

export interface HttpError extends Error {
  status?: number;
  data?: unknown;
}

export interface AppConfig {
  port: number;
  rootDir: string;
  fanya: FanyaConfig;
  supabase: SupabaseConfig;
  openai: OpenAiConfig;
  rag: RagConfig;
}

export interface FanyaConfig {
  apiBaseUrl: string;
  authMode: "bearer" | "custom-header" | "session-cookie" | "app-sign";
  accessToken: string;
  authHeaderName: string;
  authHeaderValue: string;
  cookie: string;
  appId: string;
  appSecret: string;
  schoolId: string;
  defaultCourseId: string;
  defaultClassId: string;
  timeoutMs: number;
  knowledgeGraphUrl: string;
  knowledgeProxyEnabled: boolean;
  knowledgeProxyHosts: string[];
  endpoints: Record<"health" | "courses" | "roster" | "assignments" | "resources" | "analytics", string>;
}

export interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
}

export interface OpenAiConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  embeddingApiKey: string;
  embeddingBaseURL: string;
  embeddingModel: string;
  embeddingDimensions: number;
}

export interface RagConfig {
  maxUploadBytes: number;
  chunkMinChars: number;
  chunkMaxChars: number;
  chunkOverlapChars: number;
  matchCount: number;
}

export interface ApiContext {
  req: IncomingMessage;
  res: ServerResponse;
  pathname: string;
  config: AppConfig;
}

export interface UploadedFile {
  fieldName: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
}

export interface MultipartBody {
  fields: Record<string, string>;
  files: UploadedFile[];
}

export interface TextExtractionResult {
  text: string;
  metadata: JsonRecord;
}

export interface TextChunk {
  content: string;
  chunkIndex: number;
  charStart: number;
  charEnd: number;
  metadata: JsonRecord;
}

export interface SourceBoundaryFilter {
  strict: boolean;
  domains: string[];
  labels: string[];
  fileIds: string[];
  sourceTypes: string[];
  extensions: string[];
  uploadedExtensions: string[];
  rawText: string;
}

export interface KnowledgeCitation {
  refId: string;
  chunkId: string;
  fileId: string;
  fileName: string;
  chunkIndex: number;
  snippet: string;
  similarity?: number;
  sourceLabel?: string;
  sourceUri?: string;
}

export interface RetrievedChunk extends KnowledgeCitation {
  content: string;
  metadata: JsonRecord;
}

export interface GenerateRequestPayload {
  userId?: string;
  courseId?: string;
  topic?: string;
  query?: string;
  prompt?: string;
  trigger?: string;
  sourceBoundary?: string;
  selectedTask?: JsonRecord;
  workflowIntake?: JsonRecord;
  launchContext?: JsonRecord;
}
