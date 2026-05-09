import OpenAI from "openai";
import { ApiError } from "./errors";
import type { JsonSchema } from "./json-schemas";

export type StructuredGenerationRequest<T> = {
  schemaName: string;
  schema: JsonSchema;
  systemPrompt: string;
  userPrompt: string;
  mock: T;
};

export function getAiProviderName() {
  return process.env.AI_PROVIDER || "openai";
}

export function getAiModelName() {
  return process.env.OPENAI_MODEL || "gpt-4.1-mini";
}

function parseJsonText<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw new ApiError(502, "AI_ERROR", "Model returned invalid JSON.", {
      cause: error instanceof Error ? error.message : error,
      text,
    });
  }
}

function responseText(response: unknown): string {
  const outputText = (response as { output_text?: string }).output_text;
  if (outputText) return outputText;

  const output = (response as { output?: Array<{ content?: Array<{ text?: string }> }> }).output || [];
  const firstText = output.flatMap((item) => item.content || []).find((content) => content.text)?.text;
  if (firstText) return firstText;

  throw new ApiError(502, "AI_ERROR", "Model response did not include JSON text.");
}

async function generateWithOpenAI<T>(request: StructuredGenerationRequest<T>): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new ApiError(
      500,
      "SERVER_CONFIG",
      "OPENAI_API_KEY is not configured. Set AI_PROVIDER=mock for local smoke tests without a model key.",
    );
  }

  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model: getAiModelName(),
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: request.systemPrompt }],
      },
      {
        role: "user",
        content: [{ type: "input_text", text: request.userPrompt }],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: request.schemaName,
        schema: request.schema,
        strict: true,
      },
    },
  } as never);

  return parseJsonText<T>(responseText(response));
}

export async function generateStructuredJson<T>(request: StructuredGenerationRequest<T>): Promise<T> {
  const provider = getAiProviderName();
  if (provider === "mock") return request.mock;
  if (provider !== "openai") {
    throw new ApiError(500, "SERVER_CONFIG", `Unsupported AI_PROVIDER: ${provider}.`);
  }

  try {
    return await generateWithOpenAI(request);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, "AI_ERROR", "AI generation failed.", error instanceof Error ? error.message : error);
  }
}
