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
  agentId?: string;
  modelId?: string;
  searchText?: string;
  hd?: string;
  internetSearch?: boolean;
  datasetIds?: string[];
  imageIds?: string[];
  fileIds?: string[];
  exploreId?: string;
  selectAgentId?: string;
  threadId?: string;
  applicationId?: string;
  reportStyle?: "survey" | "industry" | "proposal" | "innovation" | string;
  modeType?: "exploration" | "outline" | string;
  retrievalSources?: Array<"academic" | "internet" | "knowledge_base" | string>;
  promptId?: string;
}

export const WENDA_DEFAULT_AGENT_ID = "6f5b49b6-5cb4-11f0-9ae8-fa163f087fa9";
export const WENDA_DEFAULT_MODEL_ID = "12609df7-fee9-11ef-a29b-d039570c2aae";
export const WENDA_DEFAULT_HD = "1,1";
export const WENDA_DEFAULT_SEARCH_TEXT = "请基于药事管理本科课程的教学目标，帮助我设计一个课堂讨论任务。";
export const WENDA_DEEP_RESEARCH_APPLICATION_ID = "c9689c61-0533-11f0-8782-d031995c2cce";
export const WENDA_DEEP_RESEARCH_PROMPT_ID = "4be65eb4-17a1-11f1-812d-e0be038d5bbb";
export const WENDA_DEEP_RESEARCH_SEARCH_TEXT = "请围绕药事管理本科课程建设，梳理近年智能教学研究进展。";
export const WENDA_HOUDAO_AGENT_ID = "d11af630-a8fc-11f0-b46d-fa163f5838c7";
export const WENDA_HOUDAO_MODEL_ID = "16609df7-fee9-11ef-a29b-d039570c2aae";

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

const WENDA_ROUTE_DEFAULT_HD: Record<WendaRoute, string> = {
  history: WENDA_DEFAULT_HD,
  knowledge_base: WENDA_DEFAULT_HD,
  subscribe: WENDA_DEFAULT_HD,
  project: WENDA_DEFAULT_HD,
  ai_knowledge_base: WENDA_DEFAULT_HD,
  home: "0,1,1",
  search_history: "1,1,1",
  deep_research_history: "0,1,1",
  ai_applications: WENDA_DEFAULT_HD,
  houdao_research_history: WENDA_DEFAULT_HD,
  ai_researcher: WENDA_DEFAULT_HD,
  ai_citation: WENDA_DEFAULT_HD,
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
  const agentId = config.agentId?.trim() || "";
  const modelId = config.modelId?.trim() || "";
  const searchText = config.searchText?.trim() || "";
  const datasetIds = normalizeIdList(config.datasetIds);
  const imageIds = normalizeIdList(config.imageIds, 1);
  const fileIds = normalizeIdList(config.fileIds, 1);
  const hasAttachment = imageIds.length > 0 || fileIds.length > 0;
  const exploreId = config.exploreId?.trim();
  const applicationId = config.applicationId?.trim() || "";

  if (route === "history" || route === "houdao_research_history") {
    if (!agentId) throw new Error("当前对话页面必须提供 agentId。");
    if (!modelId) throw new Error("当前对话页面必须提供 modelId。");
    if (!searchText && !hasAttachment) {
      throw new Error("当前对话页面必须提供检索内容，或至少传入一个图片/文件 ID。");
    }
  }

  if (route === "deep_research_history") {
    if (!applicationId) throw new Error("DeepResearch 页面必须提供 applicationId。");
    if (!searchText) throw new Error("DeepResearch 页面必须提供检索内容。");
  }

  const url = new URL(`/api/openAccess/redirect/${WENDA_ROUTE_PATHS[route]}`, `https://${domain}`);
  const params = new URLSearchParams();
  params.set("hd", config.hd || WENDA_ROUTE_DEFAULT_HD[route]);
  if (agentId) params.set("agentId", agentId);
  if (modelId) params.set("modelId", modelId);
  if (searchText) params.set("searchText", searchText);
  if (route === "history" || typeof config.internetSearch === "boolean") {
    params.set("internet_search", String(config.internetSearch ?? false));
  }
  if (datasetIds.length) params.set("datasetList", JSON.stringify(datasetIds));
  if (imageIds.length) params.set("image_ids", JSON.stringify(imageIds));
  if (fileIds.length) params.set("file_ids", JSON.stringify(fileIds));
  if (exploreId) params.set("exploreId", exploreId);
  if (config.selectAgentId?.trim()) params.set("select_agent_id", config.selectAgentId.trim());
  if (config.threadId?.trim()) params.set("threadId", config.threadId.trim());
  if (applicationId) params.set("applicationId", applicationId);
  if (config.reportStyle?.trim()) params.set("reportStyle", config.reportStyle.trim());
  if (config.modeType?.trim()) params.set("modeType", config.modeType.trim());
  if (config.retrievalSources?.length) params.set("retrievalSources", normalizeIdList(config.retrievalSources).join(","));
  if (config.promptId?.trim()) params.set("promptId", config.promptId.trim());
  url.search = params.toString();
  return url.href;
}

function normalizeIdList(values: string[] | undefined, maxItems?: number): string[] {
  const items = (values || []).map((value) => value.trim()).filter(Boolean);
  const unique = Array.from(new Set(items));
  return typeof maxItems === "number" ? unique.slice(0, maxItems) : unique;
}
