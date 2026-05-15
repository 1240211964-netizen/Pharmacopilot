import type { CourseOutline, TeacherInterventionPoint, TeachingScene, TeachingSceneType, TeachingStep } from "./pipeline-types";

const TEACHER_INTERVENTIONS: Record<number, Omit<TeacherInterventionPoint, "required">> = {
  3: {
    checkpoint: "确认教学目标",
    teacherQuestion: "当前教学目标是否准确覆盖知识理解、应用产出和评价证据？",
  },
  8: {
    checkpoint: "确认教学流程与评价量规",
    teacherQuestion: "活动序列、学习产出和评价量规是否已经对齐？",
  },
  12: {
    checkpoint: "确认案例证据边界",
    teacherQuestion: "案例材料、学生可引用证据和教师资料边界是否清晰？",
  },
  17: {
    checkpoint: "确认表现性评价依据",
    teacherQuestion: "表现性评价是否具备可回溯的学生作品、量规等级和评分依据？",
  },
  20: {
    checkpoint: "确认反思报告与资产入库",
    teacherQuestion: "反思报告是否区分事实证据、教师判断和下一轮改进行动？",
  },
};

export function generateTeachingScenes(outline: CourseOutline): TeachingScene[] {
  const stepScenes = outline.steps.map((step, index) => buildSceneFromStep(outline, step, index + 1, outline.steps.length + 1));
  return [...stepScenes, buildAssetGraphScene(outline, stepScenes.length + 1, stepScenes.length + 1)];
}

function buildSceneFromStep(outline: CourseOutline, step: TeachingStep, order: number, total: number): TeachingScene {
  const stage = outline.stages.find((item) => item.id === step.stageId);
  const intervention = buildTeacherIntervention(step.id);
  const runtimeState = step.id === 1 ? "running" : "queued";
  return {
    id: `scene-${String(step.id).padStart(2, "0")}`,
    type: sceneTypeForStep(step.id),
    stageId: step.stageId,
    phaseTitle: stage?.title || "教学运行阶段",
    stepIds: [step.id],
    title: step.title,
    objective: step.objective,
    inputs: [
      `course:${outline.courseName}`,
      `topic:${outline.topic}`,
      `studentProfile:${outline.studentProfile}`,
      `stage:${stage?.id || step.stageId}`,
      `sourceBoundary:${outline.sourceBoundary}`,
    ],
    outputs: [step.output],
    runtimeState,
    agent: step.agent,
    actions: step.agentActions,
    expectedEvidence: step.learnerEvidence,
    evaluationFocus: [step.rubric],
    teacherIntervention: intervention,
    riskFlags: buildRiskFlags(step, intervention),
    progress: {
      order,
      total,
      percent: runtimeState === "running" ? Math.round((order / total) * 100) : 0,
      state: runtimeState,
    },
  };
}

function buildAssetGraphScene(outline: CourseOutline, order: number, total: number): TeachingScene {
  return {
    id: "scene-asset-graph",
    type: "asset_graph",
    stageId: "asset-pack",
    phaseTitle: "课程资产图谱总览",
    stepIds: outline.steps.map((step) => step.id),
    title: "教学资产图谱与导出中心",
    objective: "汇总教案、PPT、活动单、rubric、评价证据链和教学反思报告的来源场景与导出顺序。",
    inputs: [
      `course:${outline.courseName}`,
      `topic:${outline.topic}`,
      `steps:${outline.steps.length}`,
      `sourceBoundary:${outline.sourceBoundary}`,
    ],
    outputs: ["资产图谱、导出清单和教师审阅队列"],
    runtimeState: "queued",
    agent: "course-asset-curator",
    actions: ["collect_evidence", "export_asset"],
    expectedEvidence: ["教案", "PPT", "课堂活动单", "rubric", "评价证据链", "教学反思报告"],
    evaluationFocus: ["资产必须声明来源场景、依赖评价规则、教师审阅要求和导出格式。"],
    teacherIntervention: {
      required: false,
      checkpoint: "资产图谱总览",
      teacherQuestion: "系统生成导出清单后，教师可在导出中心统一审阅。",
    },
    riskFlags: ["asset_source_boundary_review"],
    progress: {
      order,
      total,
      percent: 0,
      state: "queued",
    },
  };
}

function sceneTypeForStep(stepId: number): TeachingSceneType {
  if (stepId <= 8) return "design";
  if (stepId <= 16) return "practice";
  if (stepId <= 19) return "evaluation";
  return "reflection";
}

function buildTeacherIntervention(stepId: number): TeacherInterventionPoint {
  const intervention = TEACHER_INTERVENTIONS[stepId];
  if (!intervention) {
    return {
      required: false,
      checkpoint: "自动推进",
      teacherQuestion: "当前节点可由系统自动推进，教师可随时查看证据。",
    };
  }
  return {
    required: true,
    ...intervention,
  };
}

function buildRiskFlags(step: TeachingStep, intervention: TeacherInterventionPoint): string[] {
  const risks = new Set<string>();
  if (intervention.required) risks.add("teacher_checkpoint_required");
  if (step.sceneType === "practice") risks.add("classroom_timing_variance");
  if (step.agentActions.includes("collect_evidence")) risks.add("evidence_boundary_review");
  if (step.agentActions.includes("export_asset")) risks.add("asset_review_required");
  return Array.from(risks);
}
