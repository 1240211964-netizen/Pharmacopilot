import type { JsonRecord } from "../types";
import { buildTeachingActions } from "../action/teaching-action-engine";
import { buildTeachingExportManifest } from "../export/teaching-export-manifest";
import { buildTeachingAgentOrchestration } from "../orchestration/teaching-agents";
import { buildTeachingSceneRuntime } from "../playback/teaching-scene-runtime";
import { generateAssetPack } from "./asset-pack-generator";
import { generateCourseOutline } from "./course-outline-generator";
import { generateEvidenceRules } from "./evidence-rule-generator";
import type { CourseGenerationInput, PipelineRunResult, TeachingSceneType } from "./pipeline-types";
import { generateTeachingScenes } from "./teaching-scene-generator";

const SCENE_RENDERERS: Array<{ sceneType: TeachingSceneType; renderer: string }> = [
  { sceneType: "design", renderer: "DesignSceneRenderer" },
  { sceneType: "practice", renderer: "PracticeSceneRenderer" },
  { sceneType: "evaluation", renderer: "EvaluationSceneRenderer" },
  { sceneType: "asset_graph", renderer: "AssetGraphRenderer" },
  { sceneType: "reflection", renderer: "ReflectionSceneRenderer" },
];

export function normalizeCourseGenerationInput(body: JsonRecord): CourseGenerationInput {
  return {
    userId: text(body.userId || body.user_id) || "anonymous-user",
    courseId: text(body.courseId || body.course_id) || "management-principles",
    topic: text(body.topic || body.prompt || body.query) || "SWOT 分析",
    prompt: text(body.prompt || body.query),
    mode: modeValue(body.mode),
    courseName: text(body.courseName || body.course_name) || "管理学原理",
    studentProfile: text(body.studentProfile || body.student_profile) || "药事管理专业本科生",
    constraints: list(body.constraints),
    sourceBoundary: text(body.sourceBoundary || body.source_boundary),
    metadata: objectValue(body.metadata),
  };
}

export function runCourseGenerationPipeline(body: JsonRecord): PipelineRunResult {
  const input = normalizeCourseGenerationInput(body);
  const outline = generateCourseOutline(input);
  const scenes = generateTeachingScenes(outline);
  const evidenceRules = generateEvidenceRules(outline, scenes);
  const assetPack = generateAssetPack(outline, scenes, evidenceRules);
  return {
    ok: true,
    pipeline: "pharmacopilot-course-generation",
    input,
    outline,
    scenes,
    evidenceRules,
    assetPack,
    orchestration: buildTeachingAgentOrchestration(),
    runtime: buildTeachingSceneRuntime(scenes),
    actions: buildTeachingActions(scenes),
    renderers: SCENE_RENDERERS,
    exports: buildTeachingExportManifest(assetPack),
  };
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : value === undefined || value === null ? "" : String(value).trim();
}

function list(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(text).filter(Boolean);
  const raw = text(value);
  return raw ? raw.split(/[;；,\n]/).map((item) => item.trim()).filter(Boolean) : [];
}

function objectValue(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function modeValue(value: unknown): CourseGenerationInput["mode"] {
  const raw = text(value);
  if (raw === "outline" || raw === "scene" || raw === "evidence" || raw === "asset_pack" || raw === "full") return raw;
  return "full";
}
