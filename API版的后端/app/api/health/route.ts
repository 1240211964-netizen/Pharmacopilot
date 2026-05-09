import { ok, withApiHandler } from "@/lib/errors";

export const runtime = "nodejs";

export const GET = withApiHandler(async () => {
  return ok({
    service: "pharmacopilot-api",
    status: "ok",
    supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    aiProvider: process.env.AI_PROVIDER || "openai",
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
  });
});
