import type { TeachingRuntimeState, TeachingScene } from "../generation/pipeline-types";
import type { JsonRecord } from "../types";

const TRANSITIONS: Array<{ from: TeachingRuntimeState; to: TeachingRuntimeState; trigger: string }> = [
  { from: "queued", to: "running", trigger: "start_scene" },
  { from: "running", to: "needs_teacher_takeover", trigger: "hit_teacher_checkpoint" },
  { from: "needs_teacher_takeover", to: "running", trigger: "teacher_approved" },
  { from: "running", to: "completed", trigger: "scene_outputs_ready" },
  { from: "completed", to: "reflected", trigger: "reflection_recorded" },
];

export function buildTeachingSceneRuntime(scenes: TeachingScene[]): JsonRecord {
  const current = scenes.find((scene) => scene.runtimeState === "running") || scenes[0];
  const completedScenes = scenes.filter((scene) => scene.runtimeState === "completed" || scene.runtimeState === "reflected").length;
  const runningScenes = scenes.filter((scene) => scene.runtimeState === "running").length;
  const queuedScenes = scenes.filter((scene) => scene.runtimeState === "queued").length;
  const totalScenes = scenes.length;
  return {
    runtime: "pharmacopilot-teaching-scene-runtime",
    version: "0.2.0",
    state: current?.runtimeState || "queued",
    currentSceneId: current?.id || null,
    currentStepIds: current?.stepIds || [],
    progress: {
      totalScenes,
      completedScenes,
      runningScenes,
      queuedScenes,
      percent: totalScenes ? Math.round(((completedScenes + runningScenes) / totalScenes) * 100) : 0,
    },
    transitions: TRANSITIONS,
    takeoverPoints: scenes
      .filter((scene) => scene.teacherIntervention.required)
      .map((scene) => ({
        sceneId: scene.id,
        stepIds: scene.stepIds,
        title: scene.title,
        checkpoint: scene.teacherIntervention.checkpoint,
        teacherQuestion: scene.teacherIntervention.teacherQuestion,
        state: scene.runtimeState,
      })),
    playbackQueue: scenes.map((scene, index) => ({
      order: index + 1,
      sceneId: scene.id,
      stepIds: scene.stepIds,
      state: scene.runtimeState,
      title: scene.title,
      agent: scene.agent,
      actions: scene.actions,
    })),
    sceneIndex: scenes.map((scene) => ({
      sceneId: scene.id,
      title: scene.title,
      type: scene.type,
      state: scene.runtimeState,
      agent: scene.agent,
      progress: scene.progress,
    })),
  };
}
