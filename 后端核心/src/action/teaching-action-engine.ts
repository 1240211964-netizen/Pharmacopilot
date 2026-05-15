import type { TeachingActionType, TeachingScene } from "../generation/pipeline-types";
import type { JsonRecord } from "../types";

const ACTION_LABELS: Record<TeachingActionType, string> = {
  generate_objective: "生成教学目标",
  generate_case: "生成药学管理案例",
  generate_question: "生成课堂问题",
  simulate_student_response: "模拟学生回应",
  evaluate_task: "评价课堂任务",
  generate_rubric: "生成评价量规",
  collect_evidence: "收集评价证据",
  export_asset: "导出教学资产",
};

export function buildTeachingActions(scenes: TeachingScene[]): JsonRecord[] {
  const uniqueActions = new Set<TeachingActionType>();
  scenes.forEach((scene) => scene.actions.forEach((action) => uniqueActions.add(action)));
  return Array.from(uniqueActions).map((action) => ({
    id: action,
    label: ACTION_LABELS[action],
    engine: "pharmacopilot-teaching-action-engine",
    requiresTeacherApproval: action === "evaluate_task" || action === "export_asset",
  }));
}
