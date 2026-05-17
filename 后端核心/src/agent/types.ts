import type { JsonRecord } from "../types";

export type TeachingModule = "course" | "navigation" | "practice" | "rubric" | "evidence" | "asset";

export interface CourseContext {
  userId?: string;
  courseId?: string;
  courseName?: string;
  lessonTitle?: string;
  className?: string;
  program?: string;
  learnerProfile?: string;
  constraints?: string[];
  sourceBoundary?: string;
  metadata?: JsonRecord;
}

export interface TeachingScene {
  id: string;
  module: TeachingModule;
  title: string;
  status?: "queued" | "running" | "complete" | "blocked";
  description?: string;
  steps?: JsonRecord[];
  evidenceRefs?: string[];
  metadata?: JsonRecord;
}

export interface TeachingArtifacts {
  navigationScene?: TeachingScene;
  navigationPath?: JsonRecord;
  practiceFlow?: TeachingScene;
  rubric?: JsonRecord;
  evidenceLedger?: JsonRecord[];
  assetGraph?: {
    nodes: JsonRecord[];
    edges: JsonRecord[];
  };
  [key: string]: unknown;
}

export interface TeachingStoreState {
  currentModule?: TeachingModule;
  courseContext?: CourseContext;
  scenes?: TeachingScene[];
  artifacts?: TeachingArtifacts;
  evidenceGaps?: JsonRecord[];
  metadata?: JsonRecord;
}

export type TeachingActionType =
  | "course.update_profile"
  | "navigation.create_path"
  | "practice.create_flow"
  | "practice.update_step"
  | "rubric.create"
  | "evidence.attach"
  | "evidence.flag_gap"
  | "asset.create_node"
  | "asset.create_edge"
  | "ui.focus"
  | "user.ask"
  | "system.complete_stage";

export interface TeachingAction {
  id?: string;
  type: TeachingActionType;
  target?: string;
  payload: JsonRecord;
  evidenceRefs?: string[];
  confidence?: number;
  requiresTeacherReview?: boolean;
}

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  description: string;
  allowedActions: TeachingActionType[];
  systemPrompt: string;
}

export interface AgentTurnSummary {
  id: string;
  agentId: string;
  agentName: string;
  text: string;
  actions: TeachingAction[];
  rejectedActions: JsonRecord[];
  startedAt: string;
  endedAt: string;
  usage?: JsonRecord;
}

export interface DirectorState {
  currentStage?: string;
  completedStages?: string[];
  turnCount?: number;
  lastAgentId?: string;
  history?: AgentTurnSummary[];
  shouldEnd?: boolean;
  metadata?: JsonRecord;
}

export interface AgentRunRequest {
  userId?: string;
  courseId?: string;
  module?: TeachingModule;
  prompt?: string;
  storeState?: TeachingStoreState;
  courseContext?: CourseContext;
  artifacts?: TeachingArtifacts;
  evidenceLedger?: JsonRecord[];
  directorState?: DirectorState;
}

export type AgentStreamEvent =
  | {
      type: "director_thinking";
      turnIndex: number;
      nextAgentId?: string;
      shouldEnd: boolean;
      reason: string;
    }
  | {
      type: "agent_start";
      turnIndex: number;
      agentId: string;
      agentName: string;
      role: string;
    }
  | {
      type: "text_delta";
      turnIndex: number;
      agentId: string;
      delta: string;
    }
  | {
      type: "action";
      turnIndex: number;
      agentId: string;
      action: TeachingAction;
    }
  | {
      type: "agent_end";
      turnIndex: number;
      agentId: string;
      summary: AgentTurnSummary;
    }
  | {
      type: "session_state";
      turnIndex: number;
      storeState: TeachingStoreState;
      artifacts: TeachingArtifacts;
      evidenceLedger: JsonRecord[];
      directorState: DirectorState;
      maxTurnsReached?: boolean;
    }
  | {
      type: "error";
      message: string;
      data?: JsonRecord;
    };

export interface DirectorDecision {
  nextAgentId?: string;
  shouldEnd: boolean;
  reason: string;
}
