import type { AppConfig, JsonRecord } from "../types";
import { buildDirectorInput, decideNextAgent } from "./director";
import { getAgentConfig } from "./registry";
import { runAgent } from "./runner";
import type {
  AgentRunRequest,
  AgentStreamEvent,
  AgentTurnSummary,
  CourseContext,
  DirectorState,
  TeachingAction,
  TeachingArtifacts,
  TeachingScene,
  TeachingStoreState,
} from "./types";

const MAX_AGENT_TURNS = 3;

export async function* runAgentSession(
  request: AgentRunRequest,
  config: AppConfig,
  signal?: AbortSignal,
): AsyncGenerator<AgentStreamEvent> {
  let session = normalizeSession(request);

  for (let turnIndex = 0; turnIndex < MAX_AGENT_TURNS; turnIndex += 1) {
    throwIfAborted(signal);
    const decision = decideNextAgent({
      module: session.storeState.currentModule || "practice",
      storeState: session.storeState,
      courseContext: session.courseContext,
      artifacts: session.artifacts,
      evidenceLedger: session.evidenceLedger,
      directorState: session.directorState,
    });

    yield {
      type: "director_thinking",
      turnIndex,
      nextAgentId: decision.nextAgentId,
      shouldEnd: decision.shouldEnd,
      reason: decision.reason,
    };

    if (decision.shouldEnd || !decision.nextAgentId) {
      yield buildSessionStateEvent(turnIndex, session);
      return;
    }

    const agent = getAgentConfig(decision.nextAgentId);
    if (!agent) throw new Error(`Unknown agent: ${decision.nextAgentId}`);

    yield {
      type: "agent_start",
      turnIndex,
      agentId: agent.id,
      agentName: agent.name,
      role: agent.role,
    };

    const summary = await runAgent(
      {
        ...request,
        module: session.storeState.currentModule,
        storeState: session.storeState,
        courseContext: session.courseContext,
        artifacts: session.artifacts,
        evidenceLedger: session.evidenceLedger,
        directorState: session.directorState,
      },
      agent,
      config,
      signal,
    );

    for (const delta of splitText(summary.text)) {
      throwIfAborted(signal);
      yield {
        type: "text_delta",
        turnIndex,
        agentId: agent.id,
        delta,
      };
    }

    for (const action of summary.actions) {
      throwIfAborted(signal);
      session = applyTeachingAction(session, action, summary);
      yield {
        type: "action",
        turnIndex,
        agentId: agent.id,
        action,
      };
    }

    session.directorState = {
      ...session.directorState,
      turnCount: (session.directorState.turnCount || 0) + 1,
      lastAgentId: agent.id,
      history: [...(session.directorState.history || []), summary].slice(-6),
    };

    yield {
      type: "agent_end",
      turnIndex,
      agentId: agent.id,
      summary,
    };
    yield buildSessionStateEvent(turnIndex, session, turnIndex === MAX_AGENT_TURNS - 1);
  }
}

interface RuntimeSession {
  storeState: TeachingStoreState;
  courseContext?: CourseContext;
  artifacts: TeachingArtifacts;
  evidenceLedger: JsonRecord[];
  directorState: DirectorState;
}

function normalizeSession(request: AgentRunRequest): RuntimeSession {
  const input = buildDirectorInput(request);
  const storeState: TeachingStoreState = {
    ...input.storeState,
    currentModule: input.module,
    courseContext: input.courseContext,
    artifacts: input.artifacts,
  };
  return {
    storeState,
    courseContext: input.courseContext,
    artifacts: input.artifacts,
    evidenceLedger: input.evidenceLedger,
    directorState: input.directorState,
  };
}

function applyTeachingAction(session: RuntimeSession, action: TeachingAction, summary: AgentTurnSummary): RuntimeSession {
  const artifacts = { ...session.artifacts };
  let courseContext = session.courseContext;
  let evidenceLedger = [...session.evidenceLedger];
  const completedStages = new Set(session.directorState.completedStages || []);

  switch (action.type) {
    case "course.update_profile":
      courseContext = {
        ...(courseContext || {}),
        ...(action.payload.courseContext && typeof action.payload.courseContext === "object" ? (action.payload.courseContext as CourseContext) : {}),
        ...pickCourseContext(action.payload),
      };
      break;
    case "navigation.create_path":
      artifacts.navigationPath = action.payload;
      artifacts.navigationScene = toScene(action.payload, "navigation", "navigation-scene");
      break;
    case "practice.create_flow":
      artifacts.practiceFlow = toScene(action.payload, "practice", "practice-flow");
      break;
    case "practice.update_step":
      artifacts.practiceFlow = updatePracticeStep(artifacts.practiceFlow, action.payload);
      break;
    case "rubric.create":
      artifacts.rubric = withEvidenceRefs(action.payload, action.evidenceRefs);
      break;
    case "evidence.attach":
      evidenceLedger.push({
        ...action.payload,
        status: action.payload.status || "attached",
        evidenceRefs: action.evidenceRefs || action.payload.evidenceRefs || [],
        agentId: summary.agentId,
      });
      artifacts.evidenceLedger = evidenceLedger;
      break;
    case "evidence.flag_gap":
      evidenceLedger.push({
        ...action.payload,
        status: "gap",
        agentId: summary.agentId,
      });
      artifacts.evidenceLedger = evidenceLedger;
      break;
    case "asset.create_node":
      artifacts.assetGraph = {
        nodes: [...(artifacts.assetGraph?.nodes || []), action.payload],
        edges: artifacts.assetGraph?.edges || [],
      };
      break;
    case "asset.create_edge":
      artifacts.assetGraph = {
        nodes: artifacts.assetGraph?.nodes || [],
        edges: [...(artifacts.assetGraph?.edges || []), action.payload],
      };
      break;
    case "system.complete_stage":
      completedStages.add(stringValue(action.payload.stage) || action.target || summary.agentId);
      break;
    case "ui.focus":
    case "user.ask":
      break;
  }

  const directorState: DirectorState = {
    ...session.directorState,
    currentStage: stringValue(action.payload.stage) || session.directorState.currentStage,
    completedStages: Array.from(completedStages),
  };
  const storeState: TeachingStoreState = {
    ...session.storeState,
    courseContext,
    artifacts,
    evidenceGaps: evidenceLedger.filter((item) => item.status === "gap"),
  };

  return {
    storeState,
    courseContext,
    artifacts,
    evidenceLedger,
    directorState,
  };
}

function buildSessionStateEvent(turnIndex: number, session: RuntimeSession, maxTurnsReached = false): AgentStreamEvent {
  return {
    type: "session_state",
    turnIndex,
    storeState: session.storeState,
    artifacts: session.artifacts,
    evidenceLedger: session.evidenceLedger,
    directorState: session.directorState,
    maxTurnsReached,
  };
}

function splitText(text: string): string[] {
  const cleanText = text.trim();
  if (!cleanText) return [];
  const chunks: string[] = [];
  for (let index = 0; index < cleanText.length; index += 96) {
    chunks.push(cleanText.slice(index, index + 96));
  }
  return chunks;
}

function toScene(payload: JsonRecord, module: TeachingScene["module"], fallbackId: string): TeachingScene {
  return {
    id: stringValue(payload.id) || fallbackId,
    module,
    title: stringValue(payload.title) || (module === "practice" ? "教学实践运行流" : "教学导航路径"),
    status: "running",
    description: stringValue(payload.description || payload.summary),
    steps: Array.isArray(payload.steps) ? (payload.steps as JsonRecord[]) : [],
    evidenceRefs: Array.isArray(payload.evidenceRefs) ? (payload.evidenceRefs as string[]) : [],
    metadata: payload,
  };
}

function updatePracticeStep(flow: TeachingScene | undefined, payload: JsonRecord): TeachingScene {
  const current = flow || toScene({ title: "教学实践运行流", steps: [] }, "practice", "practice-flow");
  const stepId = stringValue(payload.stepId || payload.id);
  const nextStep = payload.step && typeof payload.step === "object" && !Array.isArray(payload.step) ? (payload.step as JsonRecord) : payload;
  const steps = Array.isArray(current.steps) ? [...current.steps] : [];
  const index = steps.findIndex((step) => stringValue(step.id || step.stepId) === stepId);
  if (index >= 0) steps[index] = { ...steps[index], ...nextStep };
  else steps.push(nextStep);
  return { ...current, steps };
}

function withEvidenceRefs(payload: JsonRecord, evidenceRefs?: string[]): JsonRecord {
  if (!evidenceRefs?.length) return payload;
  return {
    ...payload,
    evidenceRefs,
  };
}

function pickCourseContext(payload: JsonRecord): CourseContext {
  const keys: Array<keyof CourseContext> = ["userId", "courseId", "courseName", "lessonTitle", "className", "program", "learnerProfile", "sourceBoundary"];
  const context: CourseContext = {};
  keys.forEach((key) => {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) {
      (context as Record<string, string>)[key] = value.trim();
    }
  });
  if (Array.isArray(payload.constraints)) context.constraints = payload.constraints.filter((item): item is string => typeof item === "string");
  return context;
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw new Error("Agent session aborted.");
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
