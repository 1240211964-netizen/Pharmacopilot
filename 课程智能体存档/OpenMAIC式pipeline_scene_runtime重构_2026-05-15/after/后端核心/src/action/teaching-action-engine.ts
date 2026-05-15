import type { TeachingActionManifest, TeachingActionType, TeachingScene } from "../generation/pipeline-types";

const ACTION_ORDER: TeachingActionType[] = [
  "generate_objective",
  "generate_case",
  "generate_question",
  "simulate_student_response",
  "evaluate_task",
  "generate_rubric",
  "collect_evidence",
  "export_asset",
];

const ACTION_META: Record<TeachingActionType, { label: string; description: string; requiresTeacherApproval: boolean }> = {
  generate_objective: {
    label: "生成教学目标",
    description: "根据课程输入、学生对象和教学阶段生成可观察、可评价的学习目标。",
    requiresTeacherApproval: true,
  },
  generate_case: {
    label: "生成课程案例",
    description: "生成或整理与当前课程主题相匹配的案例材料和证据片段。",
    requiresTeacherApproval: false,
  },
  generate_question: {
    label: "生成课堂问题",
    description: "围绕当前 scene 生成导学问题、课堂追问和迁移问题。",
    requiresTeacherApproval: false,
  },
  simulate_student_response: {
    label: "模拟学生回应",
    description: "按学生画像模拟常见回答、误区和协作讨论片段。",
    requiresTeacherApproval: false,
  },
  evaluate_task: {
    label: "评价课堂任务",
    description: "依据量规和 evidenceRefs 评价学生任务表现并给出反馈。",
    requiresTeacherApproval: true,
  },
  generate_rubric: {
    label: "生成评价量规",
    description: "为目标、任务和学生产出生成带等级描述的评价量规。",
    requiresTeacherApproval: true,
  },
  collect_evidence: {
    label: "收集评价证据",
    description: "收集当前 scene 的学习产出、过程记录和教师确认痕迹。",
    requiresTeacherApproval: false,
  },
  export_asset: {
    label: "导出教学资产",
    description: "把已确认的教学内容、评价证据和反思材料导出为资产包。",
    requiresTeacherApproval: true,
  },
};

export function buildTeachingActions(scenes: TeachingScene[]): TeachingActionManifest[] {
  return ACTION_ORDER.map((action) => {
    const sourceScenes = scenes.filter((scene) => scene.actions.includes(action));
    const running = sourceScenes.some((scene) => scene.runtimeState === "running");
    return {
      id: action,
      label: ACTION_META[action].label,
      engine: "pharmacopilot-teaching-action-engine",
      description: ACTION_META[action].description,
      inputRefs: sourceScenes.map((scene) => `${scene.id}.inputs`),
      outputRefs: sourceScenes.map((scene) => `${scene.id}.outputs`),
      requiresTeacherApproval: ACTION_META[action].requiresTeacherApproval,
      sceneIds: sourceScenes.map((scene) => scene.id),
      status: running ? "running" : sourceScenes.length ? "queued" : "ready",
    };
  });
}
