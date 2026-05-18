export interface AgentChatRequest {
  message: string;
  courseId?: string;
  knowledgePoint?: string;
  teachingStage?: string;
  datasetList?: string[];
  fileIds?: string[];
  imageIds?: string[];
}

export interface AgentCitation {
  title: string;
  url?: string;
  excerpt?: string;
}

export interface AgentChatResponse {
  answer: string;
  citations?: AgentCitation[];
  raw?: unknown;
}

export interface WendaoAgentRuntimeConfig {
  apiUrl: string;
  apiKey: string;
  agentId: string;
  modelId: string;
  timeoutMs?: number;
}
