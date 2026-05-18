import { NextResponse, type NextRequest } from "next/server";
import { callWendaoAgent, normalizeAgentChatRequest, WendaoAgentError } from "../../../../server/agents/wendaoAdapter";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = normalizeAgentChatRequest(body);
    // Unified Agent Gateway abstraction. The browser only calls /api/agent/chat;
    // API keys and upstream Wendao details stay in this server route and adapter.
    const result = await callWendaoAgent(payload, undefined, request.signal);
    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof WendaoAgentError ? error.status : error instanceof SyntaxError ? 400 : 500;
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "Agent Gateway request failed.",
          data: error instanceof WendaoAgentError ? error.data : undefined,
        },
      },
      { status },
    );
  }
}
