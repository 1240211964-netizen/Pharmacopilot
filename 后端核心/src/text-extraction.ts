import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import type { JsonRecord, TextExtractionResult, UploadedFile } from "./types";
import { extensionFromFileName } from "./source-boundary";
import { normalizeText } from "./chunking";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  preserveOrder: false,
  trimValues: true,
});

export async function extractTextFromUpload(file: UploadedFile): Promise<TextExtractionResult> {
  const extension = extensionFromFileName(file.fileName);
  const metadata: JsonRecord = {
    original_name: file.fileName,
    mime_type: file.mimeType,
    extension,
    extraction: "server",
  };

  if (["txt", "md", "csv", "json", "rtf", "html", "htm", "xml"].includes(extension) || file.mimeType.startsWith("text/")) {
    return {
      text: normalizeText(stripMarkup(file.buffer.toString("utf8"))),
      metadata: { ...metadata, parser: "plain-text" },
    };
  }

  if (extension === "pdf" || file.mimeType === "application/pdf") {
    return extractPdf(file.buffer, metadata);
  }

  if (extension === "docx") {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return {
      text: normalizeText(result.value),
      metadata: {
        ...metadata,
        parser: "mammoth",
        warnings: result.messages?.map((message) => message.message).filter(Boolean).slice(0, 8) || [],
      },
    };
  }

  if (extension === "pptx") {
    return extractPptx(file.buffer, metadata);
  }

  if (extension === "xlsx") {
    return extractWorkbook(file.buffer, metadata);
  }

  if (extension === "xls") {
    throw new Error(`暂不支持旧版二进制 Excel 文件 ${file.fileName}，请另存为 .xlsx 或 CSV 后上传。`);
  }

  if (["doc", "ppt"].includes(extension)) {
    throw new Error(`暂不支持旧版二进制 Office 文件 ${file.fileName}，请另存为 .${extension}x 或 PDF 后上传。`);
  }

  throw new Error(`暂不支持解析该文件类型：${file.fileName}`);
}

async function extractPdf(buffer: Buffer, metadata: JsonRecord): Promise<TextExtractionResult> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return {
      text: normalizeText(result.text || ""),
      metadata: {
        ...metadata,
        parser: "pdf-parse",
        page_count: result.total || result.pages?.length || undefined,
      },
    };
  } finally {
    await parser.destroy();
  }
}

async function extractPptx(buffer: Buffer, metadata: JsonRecord): Promise<TextExtractionResult> {
  const zip = await JSZip.loadAsync(buffer);
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
    .sort(naturalSort);
  const noteFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/i.test(name))
    .sort(naturalSort);

  const slides: string[] = [];
  for (const fileName of slideFiles) {
    const xml = await zip.files[fileName].async("text");
    const texts = collectTextNodes(xmlParser.parse(xml));
    const slideNumber = fileName.match(/slide(\d+)\.xml/i)?.[1] || String(slides.length + 1);
    if (texts.length) slides.push(`【Slide ${slideNumber}】\n${texts.join("\n")}`);
  }

  const notes: string[] = [];
  for (const fileName of noteFiles) {
    const xml = await zip.files[fileName].async("text");
    const texts = collectTextNodes(xmlParser.parse(xml));
    const noteNumber = fileName.match(/notesSlide(\d+)\.xml/i)?.[1] || String(notes.length + 1);
    if (texts.length) notes.push(`【Notes ${noteNumber}】\n${texts.join("\n")}`);
  }

  return {
    text: normalizeText([...slides, ...notes].join("\n\n")),
    metadata: {
      ...metadata,
      parser: "jszip-fast-xml-parser",
      slide_count: slideFiles.length,
      notes_count: noteFiles.length,
    },
  };
}

async function extractWorkbook(buffer: Buffer, metadata: JsonRecord): Promise<TextExtractionResult> {
  const zip = await JSZip.loadAsync(buffer);
  const sharedStrings = await readSharedStrings(zip);
  const sheetFiles = Object.keys(zip.files)
    .filter((name) => /^xl\/worksheets\/sheet\d+\.xml$/i.test(name))
    .sort(naturalSort);
  const sheets: string[] = [];
  for (const fileName of sheetFiles) {
    const xml = await zip.files[fileName].async("text");
    const parsed = xmlParser.parse(xml);
    const rows = extractSheetRows(parsed, sharedStrings);
    const sheetNumber = fileName.match(/sheet(\d+)\.xml/i)?.[1] || String(sheets.length + 1);
    if (rows.length) sheets.push(`【Sheet ${sheetNumber}】\n${rows.join("\n")}`);
  }
  return {
    text: normalizeText(sheets.join("\n\n")),
    metadata: {
      ...metadata,
      parser: "jszip-fast-xml-parser",
      sheet_count: sheetFiles.length,
    },
  };
}

async function readSharedStrings(zip: JSZip): Promise<string[]> {
  const file = zip.files["xl/sharedStrings.xml"];
  if (!file) return [];
  const xml = await file.async("text");
  const parsed = xmlParser.parse(xml);
  const items = parsed?.sst?.si;
  const list = Array.isArray(items) ? items : items ? [items] : [];
  return list.map((item) => collectTextNodes(item).join(" ")).map((text) => text.trim());
}

function extractSheetRows(parsed: unknown, sharedStrings: string[]): string[] {
  const sheetData = (parsed as { worksheet?: { sheetData?: { row?: unknown } } })?.worksheet?.sheetData?.row;
  const rows = Array.isArray(sheetData) ? sheetData : sheetData ? [sheetData] : [];
  return rows
    .map((row) => {
      const cells = (row as { c?: unknown })?.c;
      const cellList = Array.isArray(cells) ? cells : cells ? [cells] : [];
      return cellList
        .map((cell) => cellValue(cell as Record<string, unknown>, sharedStrings))
        .filter(Boolean)
        .join(",");
    })
    .filter(Boolean);
}

function cellValue(cell: Record<string, unknown>, sharedStrings: string[]): string {
  const type = String(cell["@_t"] || "");
  const raw = cell.v !== undefined ? String(cell.v) : "";
  if (type === "s") return sharedStrings[Number(raw)] || "";
  if (type === "inlineStr") return collectTextNodes(cell.is).join(" ");
  return raw;
}

function collectTextNodes(value: unknown): string[] {
  const texts: string[] = [];
  const visit = (node: unknown): void => {
    if (node === null || node === undefined) return;
    if (typeof node === "string" || typeof node === "number") {
      const text = String(node).trim();
      if (text) texts.push(text);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (typeof node === "object") {
      Object.entries(node as Record<string, unknown>).forEach(([key, child]) => {
        if (key === "a:t" || key.endsWith(":t") || key === "t") visit(child);
        else if (!key.startsWith("@_")) visit(child);
      });
    }
  };
  visit(value);
  return texts
    .map((text) => text.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function stripMarkup(text: string): string {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}
