import type { JsonRecord } from "../types";

export type TeachingSceneType = "design" | "practice" | "evaluation" | "asset_graph" | "reflection";

export type TeachingActionType =
  | "generate_objective"
  | "generate_case"
  | "generate_question"
  | "simulate_student_response"
  | "evaluate_task"
  | "generate_rubric"
  | "collect_evidence"
  | "export_asset";

export interface CourseGenerationInput {
  userId: string;
  courseId: string;
  topic: string;
  prompt: string;
  mode: "outline" | "scene" | "evidence" | "asset_pack" | "full";
  courseName: string;
  studentProfile: string;
  constraints: string[];
  sourceBoundary: string;
  metadata: JsonRecord;
}

export interface CourseOutline {
  id: string;
  title: string;
  courseName: string;
  topic: string;
  studentProfile: string;
  stages: Array<{
    id: string;
    title: string;
    objective: string;
    stepRange: string;
  }>;
  objectives: string[];
  constraints: string[];
  sourceBoundary: string;
}

export interface TeachingScene {
  id: string;
  type: TeachingSceneType;
  stepIds: number[];
  title: string;
  runtimeState: "queued" | "running" | "needs_teacher_takeover" | "completed";
  agent: string;
  actions: TeachingActionType[];
  expectedEvidence: string[];
}

export interface EvidenceRule {
  id: string;
  dimension: string;
  observableBehavior: string;
  evidenceRefs: string[];
  teacherCheck: string;
}

export interface TeachingAssetItem {
  id: string;
  type: "lesson_plan" | "ppt" | "activity_sheet" | "rubric" | "evidence_chain" | "reflection_report";
  title: string;
  sourceScenes: string[];
  exportAction: TeachingActionType;
}

export interface AssetPack {
  id: string;
  title: string;
  items: TeachingAssetItem[];
  sourceBoundary: string;
}

export interface PipelineRunResult {
  ok: true;
  pipeline: "pharmacopilot-course-generation";
  input: CourseGenerationInput;
  outline: CourseOutline;
  scenes: TeachingScene[];
  evidenceRules: EvidenceRule[];
  assetPack: AssetPack;
  orchestration: JsonRecord;
  runtime: JsonRecord;
  actions: JsonRecord[];
  renderers: Array<{ sceneType: TeachingSceneType; renderer: string }>;
  exports: JsonRecord;
}
