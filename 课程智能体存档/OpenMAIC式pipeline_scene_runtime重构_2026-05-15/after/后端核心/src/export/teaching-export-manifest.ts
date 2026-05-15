import type { AssetPack, TeachingAssetType } from "../generation/pipeline-types";
import type { JsonRecord } from "../types";

const RECOMMENDED_FORMATS: Record<TeachingAssetType, string> = {
  lesson_plan: "docx/html",
  ppt: "pptx",
  activity_sheet: "pdf/html",
  rubric: "xlsx/html",
  evidence_chain: "html/json",
  reflection_report: "docx/html",
};

export function buildTeachingExportManifest(assetPack: AssetPack): JsonRecord {
  const formats = assetPack.items.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    status: item.requiresTeacherReview ? "ready_for_teacher_review" : "ready_to_export",
    sourceScenes: item.sourceScenes,
    sourceRules: item.sourceRules,
    requiredReview: item.requiresTeacherReview,
    recommendedFormat: RECOMMENDED_FORMATS[item.type],
  }));
  return {
    exportFirst: true,
    packId: assetPack.id,
    title: assetPack.title,
    sourceBoundary: assetPack.sourceBoundary,
    formats,
    reviewQueue: formats
      .filter((format) => format.requiredReview)
      .map((format) => ({
        id: format.id,
        title: format.title,
        sourceScenes: format.sourceScenes,
        status: "pending_teacher_review",
      })),
    exportOrder: assetPack.items.map((item, index) => ({
      order: index + 1,
      id: item.id,
      type: item.type,
      recommendedFormat: RECOMMENDED_FORMATS[item.type],
    })),
  };
}
