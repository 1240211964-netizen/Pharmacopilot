export type WendaRoute =
  | "history"
  | "knowledge_base"
  | "subscribe"
  | "project"
  | "ai_knowledge_base"
  | "home"
  | "search_history"
  | "deep_research_history"
  | "ai_applications"
  | "houdao_research_history"
  | "ai_researcher"
  | "ai_citation";

export interface BuildWendaUrlConfig {
  domain: string;
  route?: WendaRoute;
  agentId: string;
  modelId?: string;
  searchText?: string;
  hd?: string;
  internetSearch?: boolean;
  datasetIds?: string[];
  imageIds?: string[];
  fileIds?: string[];
  exploreId?: string;
}

export const WENDA_DEFAULT_AGENT_ID = "6f5b49b6-5cb4-11f0-9ae8-fa163f087fa9";
export const WENDA_DEFAULT_MODEL_ID = "12609df7-fee9-11ef-a29b-d039570c2aae";
export const WENDA_DEFAULT_HD = "1,1";
export const WENDA_DEFAULT_SEARCH_TEXT = "请基于药事管理本科课程的教学目标，帮助我设计一个课堂讨论任务。";

const WENDA_ROUTE_PATHS: Record<WendaRoute, string> = {
  history: "history",
  knowledge_base: "knowledge_base",
  subscribe: "subscribe",
  project: "project",
  ai_knowledge_base: "ai_knowledge_base",
  home: "home",
  search_history: "search_history",
  deep_research_history: "deep_research_history",
  ai_applications: "ai_applications",
  houdao_research_history: "houdao_research_history",
  ai_researcher: "ai_researcher",
  ai_citation: "ai_citation",
};

export function normalizeWendaDomain(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .toLowerCase();
}

export function getRuntimeWendaDomain(): string {
  const runtime = globalThis as typeof globalThis & {
    __PHARMACOPILOT_ENV__?: {
      VITE_WENDAO_DOMAIN?: string;
      WENDAO_DOMAIN?: string;
    };
  };
  return normalizeWendaDomain(runtime.__PHARMACOPILOT_ENV__?.VITE_WENDAO_DOMAIN || runtime.__PHARMACOPILOT_ENV__?.WENDAO_DOMAIN || "");
}

export function buildWendaUrl(config: BuildWendaUrlConfig): string {
  const domain = normalizeWendaDomain(config.domain);
  if (!domain) throw new Error("请先配置机构闻道域名。");

  const route = config.route || "history";
  const agentId = config.agentId.trim();
  const modelId = config.modelId?.trim() || "";
  const searchText = config.searchText?.trim() || "";
  const datasetIds = normalizeIdList(config.datasetIds);
  const imageIds = normalizeIdList(config.imageIds, 1);
  const fileIds = normalizeIdList(config.fileIds, 1);
  const hasAttachment = imageIds.length > 0 || fileIds.length > 0;
  const exploreId = config.exploreId?.trim();

  if (!agentId) throw new Error("agentId 是必填参数。");
  if (route === "history" && !modelId) throw new Error("普通对话页必须提供 modelId。");
  if (route === "history" && !searchText && !hasAttachment) {
    throw new Error("普通对话页必须提供检索内容，或至少传入一个图片/文件 ID。");
  }

  const url = new URL(`/api/openAccess/redirect/${WENDA_ROUTE_PATHS[route]}`, `https://${domain}`);
  const params = new URLSearchParams();
  params.set("hd", config.hd || WENDA_DEFAULT_HD);
  params.set("agentId", agentId);
  if (modelId) params.set("modelId", modelId);
  if (searchText) params.set("searchText", searchText);
  params.set("internet_search", String(config.internetSearch ?? false));
  if (datasetIds.length) params.set("datasetList", JSON.stringify(datasetIds));
  if (imageIds.length) params.set("image_ids", JSON.stringify(imageIds));
  if (fileIds.length) params.set("file_ids", JSON.stringify(fileIds));
  if (exploreId) params.set("exploreId", exploreId);
  url.search = params.toString();
  return url.href;
}

function normalizeIdList(values: string[] | undefined, maxItems?: number): string[] {
  const items = (values || []).map((value) => value.trim()).filter(Boolean);
  const unique = Array.from(new Set(items));
  return typeof maxItems === "number" ? unique.slice(0, maxItems) : unique;
}
