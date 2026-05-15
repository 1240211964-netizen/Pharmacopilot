import type { AssetPack } from "../generation/pipeline-types";
import type { JsonRecord } from "../types";

export function buildTeachingExportManifest(assetPack: AssetPack): JsonRecord {
  return {
    exportFirst: true,
    packId: assetPack.id,
    title: assetPack.title,
    sourceBoundary: assetPack.sourceBoundary,
    formats: assetPack.items.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      status: "ready_for_teacher_review",
    })),
  };
}
