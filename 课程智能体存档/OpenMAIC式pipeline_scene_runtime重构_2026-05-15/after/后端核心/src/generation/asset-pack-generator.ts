import type { AssetPack, CourseOutline, EvidenceRule, TeachingAssetItem, TeachingAssetType, TeachingScene } from "./pipeline-types";

interface AssetBlueprint {
  id: string;
  type: TeachingAssetType;
  title: string;
  sceneSelector: (scene: TeachingScene) => boolean;
  requiresTeacherReview: boolean;
}

const ASSET_BLUEPRINTS: AssetBlueprint[] = [
  {
    id: "asset-lesson-plan",
    type: "lesson_plan",
    title: "教案",
    sceneSelector: (scene) => scene.type === "design" || scene.id === "scene-16",
    requiresTeacherReview: true,
  },
  {
    id: "asset-ppt",
    type: "ppt",
    title: "PPT",
    sceneSelector: (scene) => ["scene-05", "scene-09", "scene-11", "scene-12", "scene-16"].includes(scene.id),
    requiresTeacherReview: true,
  },
  {
    id: "asset-activity-sheet",
    type: "activity_sheet",
    title: "课堂活动单",
    sceneSelector: (scene) => ["scene-06", "scene-09", "scene-12", "scene-13", "scene-14", "scene-16"].includes(scene.id),
    requiresTeacherReview: true,
  },
  {
    id: "asset-rubric",
    type: "rubric",
    title: "rubric",
    sceneSelector: (scene) => ["scene-03", "scene-08", "scene-15", "scene-17"].includes(scene.id),
    requiresTeacherReview: true,
  },
  {
    id: "asset-evidence-chain",
    type: "evidence_chain",
    title: "评价证据链",
    sceneSelector: (scene) => scene.type !== "asset_graph",
    requiresTeacherReview: true,
  },
  {
    id: "asset-reflection-report",
    type: "reflection_report",
    title: "教学反思报告",
    sceneSelector: (scene) => ["scene-18", "scene-19", "scene-20"].includes(scene.id),
    requiresTeacherReview: true,
  },
];

export function generateAssetPack(outline: CourseOutline, scenes: TeachingScene[], rules: EvidenceRule[]): AssetPack {
  return {
    id: `asset-pack-${outline.id}`,
    title: `${outline.courseName} · ${outline.topic} 导出资产包`,
    items: ASSET_BLUEPRINTS.map((blueprint) => buildAssetItem(blueprint, scenes, rules)),
    sourceBoundary: outline.sourceBoundary,
  };
}

function buildAssetItem(blueprint: AssetBlueprint, scenes: TeachingScene[], rules: EvidenceRule[]): TeachingAssetItem {
  const sourceScenes = scenes
    .filter((scene) => blueprint.sceneSelector(scene))
    .map((scene) => scene.id);
  const sourceRules = rules
    .filter((rule) => rule.sceneId && sourceScenes.includes(rule.sceneId))
    .map((rule) => rule.id);
  return {
    id: blueprint.id,
    type: blueprint.type,
    title: blueprint.title,
    sourceScenes,
    sourceRules,
    exportAction: "export_asset",
    requiresTeacherReview: blueprint.requiresTeacherReview,
  };
}
