import path from "node:path";
import type { SourceBoundaryFilter } from "./types";

const OFFICIAL_SOURCE_ALIASES: Array<{ patterns: RegExp[]; domain: string; labels: string[] }> = [
  {
    patterns: [/国家医保局/, /国家医疗保障局/, /医保局官网/, /nhsa/i],
    domain: "nhsa.gov.cn",
    labels: ["国家医保局", "国家医疗保障局"],
  },
  {
    patterns: [/国家药监局/, /国家药品监督管理局/, /药监局官网/, /nmpa/i],
    domain: "nmpa.gov.cn",
    labels: ["国家药监局", "国家药品监督管理局"],
  },
  {
    patterns: [/国家卫健委/, /卫生健康委/, /卫健委官网/, /nhc/i],
    domain: "nhc.gov.cn",
    labels: ["国家卫健委", "国家卫生健康委员会"],
  },
  {
    patterns: [/教育部官网/, /教育部/, /moe/i],
    domain: "moe.gov.cn",
    labels: ["教育部"],
  },
];

export function parseSourceBoundary(input: unknown): SourceBoundaryFilter {
  const text = stringifyBoundary(input);
  const normalized = text.toLowerCase();
  const strict = /仅使用|只使用|只检索|限定|不得使用|不要使用|only use|only/i.test(text);
  const domains = new Set<string>();
  const labels = new Set<string>();
  const sourceTypes = new Set<string>();
  const extensions = new Set<string>();
  const uploadedExtensions = new Set<string>();
  const fileIds = new Set<string>();

  OFFICIAL_SOURCE_ALIASES.forEach((source) => {
    if (source.patterns.some((pattern) => pattern.test(text))) {
      domains.add(source.domain);
      source.labels.forEach((label) => labels.add(label));
    }
  });

  extractDomains(text).forEach((domain) => domains.add(domain));
  extractUuidLike(text).forEach((id) => fileIds.add(id));

  if (/我上传|上传的|本地材料|课程资料|课程文件|课件|附件/.test(text)) {
    sourceTypes.add("upload");
  }

  if (/ppt|课件|幻灯片|slides?/i.test(text)) {
    ["ppt", "pptx"].forEach((ext) => {
      if (/我上传|上传的|课程ppt|课程 ppt|课件|本地/.test(text)) uploadedExtensions.add(ext);
      else extensions.add(ext);
    });
  }
  if (/教案|docx?|讲义/i.test(text)) ["doc", "docx"].forEach((ext) => extensions.add(ext));
  if (/政策|pdf/i.test(text)) extensions.add("pdf");
  if (/表格|xlsx?|csv/i.test(text)) ["xls", "xlsx", "csv"].forEach((ext) => extensions.add(ext));

  extractQuotedLabels(text).forEach((label) => labels.add(label));

  return {
    strict,
    domains: Array.from(domains),
    labels: Array.from(labels),
    fileIds: Array.from(fileIds),
    sourceTypes: uploadedExtensions.size ? Array.from(sourceTypes).filter((type) => type !== "upload") : Array.from(sourceTypes),
    extensions: Array.from(extensions),
    uploadedExtensions: Array.from(uploadedExtensions),
    rawText: text,
  };
}

export function sourceFilterForRpc(filter: SourceBoundaryFilter): Record<string, unknown> {
  if (!filter.strict) return {};
  return {
    domains: filter.domains,
    labels: filter.labels,
    file_ids: filter.fileIds,
    source_types: filter.sourceTypes,
    extensions: filter.extensions,
    uploaded_extensions: filter.uploadedExtensions,
  };
}

export function sourceBoundarySummary(filter: SourceBoundaryFilter): string[] {
  const parts: string[] = [];
  if (filter.domains.length) parts.push(...filter.domains.map((domain) => `官网域名：${domain}`));
  if (filter.labels.length) parts.push(...filter.labels.map((label) => `来源标签：${label}`));
  if (filter.uploadedExtensions.length) parts.push(`上传文件类型：${filter.uploadedExtensions.join("、").toUpperCase()}`);
  if (filter.extensions.length) parts.push(`文件类型：${filter.extensions.join("、").toUpperCase()}`);
  if (filter.sourceTypes.length) parts.push(`来源类型：${filter.sourceTypes.join("、")}`);
  if (filter.fileIds.length) parts.push(`指定文件：${filter.fileIds.length} 个`);
  return parts;
}

export function extensionFromFileName(fileName: string): string {
  return path.extname(fileName).replace(".", "").toLowerCase();
}

function stringifyBoundary(input: unknown): string {
  if (typeof input === "string") return input.trim();
  if (input && typeof input === "object") return JSON.stringify(input);
  return "";
}

function extractDomains(text: string): string[] {
  const domains = new Set<string>();
  const urlPattern = /https?:\/\/([a-z0-9.-]+\.[a-z]{2,})(?:[/:?#][^\s，。；;]*)?/gi;
  for (const match of text.matchAll(urlPattern)) {
    if (match[1]) domains.add(match[1].toLowerCase().replace(/^www\./, ""));
  }
  const domainPattern = /\b([a-z0-9.-]+\.(?:gov\.cn|edu\.cn|org|com|cn|net))\b/gi;
  for (const match of text.matchAll(domainPattern)) {
    if (match[1]) domains.add(match[1].toLowerCase().replace(/^www\./, ""));
  }
  return Array.from(domains);
}

function extractUuidLike(text: string): string[] {
  const ids = new Set<string>();
  const pattern = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
  for (const match of text.matchAll(pattern)) ids.add(match[0]);
  return Array.from(ids);
}

function extractQuotedLabels(text: string): string[] {
  return Array.from(text.matchAll(/[《“"]([^》”"\n]{2,48})[》”"]/g))
    .map((match) => match[1]?.trim())
    .filter((value): value is string => Boolean(value));
}
