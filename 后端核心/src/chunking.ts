import type { TextChunk } from "./types";

export function normalizeText(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function chunkText(
  rawText: string,
  options: { minChars: number; maxChars: number; overlapChars: number },
): TextChunk[] {
  const text = normalizeText(rawText);
  if (!text) return [];

  const maxChars = Math.max(200, options.maxChars);
  const minChars = Math.min(Math.max(100, options.minChars), maxChars);
  const overlapChars = Math.min(Math.max(0, options.overlapChars), Math.floor(maxChars / 3));
  const paragraphs = splitIntoUnits(text, maxChars);
  const chunks: TextChunk[] = [];
  let current = "";
  let currentStart = 0;
  let cursor = 0;

  for (const paragraph of paragraphs) {
    const paragraphStart = text.indexOf(paragraph, cursor);
    if (paragraphStart >= 0) cursor = paragraphStart + paragraph.length;
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;

    if (charLength(candidate) <= maxChars || charLength(current) < minChars) {
      if (!current) currentStart = paragraphStart >= 0 ? paragraphStart : cursor;
      current = candidate;
      continue;
    }

    pushChunk(chunks, current, currentStart);
    const overlap = takeTail(current, overlapChars);
    const nextStart = paragraphStart >= 0 ? paragraphStart : cursor;
    const withOverlap = overlap ? `${overlap}\n\n${paragraph}` : paragraph;
    if (charLength(withOverlap) > maxChars) {
      currentStart = nextStart;
      current = paragraph;
    } else {
      currentStart = Math.max(0, nextStart - charLength(overlap));
      current = withOverlap;
    }
  }

  if (current.trim()) pushChunk(chunks, current, currentStart);

  return chunks.map((chunk, index) => ({
    ...chunk,
    chunkIndex: index,
    metadata: {
      ...chunk.metadata,
      chunk_chars: charLength(chunk.content),
    },
  }));
}

function splitIntoUnits(text: string, maxChars: number): string[] {
  return text
    .split(/\n{2,}/)
    .flatMap((paragraph) => splitLongParagraph(paragraph.trim(), maxChars))
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLongParagraph(paragraph: string, maxChars: number): string[] {
  if (charLength(paragraph) <= maxChars) return [paragraph];
  const sentences = paragraph
    .split(/(?<=[。！？!?；;])\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (sentences.length <= 1) return hardSplit(paragraph, maxChars);

  const units: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    const candidate = current ? `${current}${sentence}` : sentence;
    if (charLength(candidate) <= maxChars) {
      current = candidate;
    } else {
      if (current) units.push(current);
      if (charLength(sentence) > maxChars) units.push(...hardSplit(sentence, maxChars));
      else current = sentence;
    }
  }
  if (current) units.push(current);
  return units;
}

function hardSplit(text: string, maxChars: number): string[] {
  const chars = Array.from(text);
  const result: string[] = [];
  for (let index = 0; index < chars.length; index += maxChars) {
    result.push(chars.slice(index, index + maxChars).join(""));
  }
  return result;
}

function pushChunk(chunks: TextChunk[], content: string, charStart: number): void {
  const normalized = content.trim();
  if (!normalized) return;
  chunks.push({
    content: normalized,
    chunkIndex: chunks.length,
    charStart,
    charEnd: charStart + charLength(normalized),
    metadata: {},
  });
}

function takeTail(text: string, count: number): string {
  if (!count) return "";
  return Array.from(text).slice(-count).join("").trim();
}

function charLength(text: string): number {
  return Array.from(text).length;
}
