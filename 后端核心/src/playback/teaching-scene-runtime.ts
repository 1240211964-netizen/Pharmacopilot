import type { TeachingScene } from "../generation/pipeline-types";
import type { JsonRecord } from "../types";

export function buildTeachingSceneRuntime(scenes: TeachingScene[]): JsonRecord {
  const current = scenes.find((scene) => scene.runtimeState === "running") || scenes[0];
  return {
    runtime: "20-step-teaching-scene-runtime",
    state: current?.runtimeState || "queued",
    currentSceneId: current?.id || null,
    currentStepIds: current?.stepIds || [],
    transitions: [
      ["queued", "running"],
      ["running", "needs_teacher_takeover"],
      ["needs_teacher_takeover", "running"],
      ["running", "completed"],
      ["completed", "reflected"],
    ],
    takeoverPoints: scenes
      .filter((scene) => scene.runtimeState === "needs_teacher_takeover")
      .map((scene) => ({ sceneId: scene.id, title: scene.title, reason: "需要教师确认评价规则、案例边界或证据入库范围" })),
  };
}
