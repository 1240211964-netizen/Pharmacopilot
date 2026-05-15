import type { AssetPack, CourseOutline, EvidenceRule, TeachingAssetItem, TeachingScene } from "./pipeline-types";

const ASSET_ITEMS: Array<Omit<TeachingAssetItem, "sourceScenes">> = [
  { id: "asset-lesson-plan", type: "lesson_plan", title: "教案", exportAction: "export_asset" },
  { id: "asset-ppt", type: "ppt", title: "PPT", exportAction: "export_asset" },
  { id: "asset-activity-sheet", type: "activity_sheet", title: "课堂活动单", exportAction: "export_asset" },
  { id: "asset-rubric", type: "rubric", title: "rubric", exportAction: "export_asset" },
  { id: "asset-evidence-chain", type: "evidence_chain", title: "评价证据链", exportAction: "export_asset" },
  { id: "asset-reflection-report", type: "reflection_report", title: "教学反思报告", exportAction: "export_asset" },
];

export function generateAssetPack(outline: CourseOutline, scenes: TeachingScene[], rules: EvidenceRule[]): AssetPack {
  const sceneIds = scenes.map((scene) => scene.id);
  return {
    id: `asset-pack-${outline.id}`,
    title: `${outline.courseName} · ${outline.topic} 导出资产包`,
    items: ASSET_ITEMS.map((item) => ({
      ...item,
      sourceScenes: item.type === "rubric" || item.type === "evidence_chain"
        ? [...sceneIds, ...rules.map((rule) => rule.id)]
        : sceneIds,
    })),
    sourceBoundary: outline.sourceBoundary,
  };
}
