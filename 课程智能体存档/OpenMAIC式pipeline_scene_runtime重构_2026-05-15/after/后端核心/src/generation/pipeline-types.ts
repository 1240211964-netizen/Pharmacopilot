import type { JsonRecord } from "../types";

export type TeachingRuntimeState = "queued" | "running" | "needs_teacher_takeover" | "completed" | "reflected";

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

export type TeachingAssetType =
  | "lesson_plan"
  | "ppt"
  | "activity_sheet"
  | "rubric"
  | "evidence_chain"
  | "reflection_report";

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

export interface CourseStage {
  id: string;
  title: string;
  objective: string;
  stepRange: string;
  stepIds: number[];
  sceneType: TeachingSceneType;
}

export interface TeachingStep {
  id: number;
  stageId: string;
  sceneType: TeachingSceneType;
  title: string;
  objective: string;
  task: string;
  output: string;
  rubric: string;
  theory: string;
  agent: string;
  learnerEvidence: string[];
  agentActions: TeachingActionType[];
}

export interface CourseOutline {
  id: string;
  title: string;
  courseName: string;
  topic: string;
  studentProfile: string;
  stages: CourseStage[];
  steps: TeachingStep[];
  objectives: string[];
  constraints: string[];
  sourceBoundary: string;
}

export interface TeacherInterventionPoint {
  required: boolean;
  checkpoint: string;
  teacherQuestion: string;
}

export interface TeachingSceneProgress {
  order: number;
  total: number;
  percent: number;
  state: TeachingRuntimeState;
}

export interface TeachingScene {
  id: string;
  type: TeachingSceneType;
  stageId: string;
  phaseTitle: string;
  stepIds: number[];
  title: string;
  objective: string;
  inputs: string[];
  outputs: string[];
  runtimeState: TeachingRuntimeState;
  agent: string;
  actions: TeachingActionType[];
  expectedEvidence: string[];
  evaluationFocus: string[];
  teacherIntervention: TeacherInterventionPoint;
  riskFlags: string[];
  progress: TeachingSceneProgress;
}

export interface EvidenceLevelDescriptors {
  insufficient: string;
  basic: string;
  good: string;
  excellent: string;
}

export interface EvidenceRule {
  id: string;
  sceneId?: string;
  dimension: string;
  observableBehavior: string;
  evidenceRefs: string[];
  teacherCheck: string;
  levelDescriptors?: EvidenceLevelDescriptors;
}

export interface TeachingAssetItem {
  id: string;
  type: TeachingAssetType;
  title: string;
  sourceScenes: string[];
  sourceRules: string[];
  exportAction: TeachingActionType;
  requiresTeacherReview: boolean;
}

export interface AssetPack {
  id: string;
  title: string;
  items: TeachingAssetItem[];
  sourceBoundary: string;
}

export interface TeachingActionManifest {
  id: TeachingActionType;
  label: string;
  engine: "pharmacopilot-teaching-action-engine";
  description: string;
  inputRefs: string[];
  outputRefs: string[];
  requiresTeacherApproval: boolean;
  sceneIds: string[];
  status: TeachingRuntimeState | "ready";
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
  actions: TeachingActionManifest[];
  renderers: Array<{ sceneType: TeachingSceneType; renderer: string }>;
  exports: JsonRecord;
  summary: JsonRecord;
}
