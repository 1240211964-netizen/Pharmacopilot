import type { CourseOutline, EvidenceLevelDescriptors, EvidenceRule, TeachingScene } from "./pipeline-types";

interface DimensionProfile {
  id: string;
  dimension: string;
  focus: string;
  observable: (outline: CourseOutline, scene: TeachingScene) => string;
}

const DIMENSION_PROFILES: DimensionProfile[] = [
  {
    id: "objective-alignment",
    dimension: "目标一致性",
    focus: "目标、任务、产出和证据保持一致。",
    observable: (outline, scene) => `在“${scene.title}”中，学习任务能够支撑《${outline.courseName}》当前主题的目标达成。`,
  },
  {
    id: "learner-diagnosis",
    dimension: "学情诊断质量",
    focus: "诊断结果能解释学生起点、误区和支持需求。",
    observable: (_, scene) => `在“${scene.title}”中，教师能够基于学生证据识别学习起点或困难类型。`,
  },
  {
    id: "scenario-authenticity",
    dimension: "情境真实性",
    focus: "案例、问题和任务具备课程真实感与专业关联。",
    observable: (_, scene) => `在“${scene.title}”中，学生面对的情境能连接课程材料、真实问题和专业判断。`,
  },
  {
    id: "evidence-quality",
    dimension: "证据使用质量",
    focus: "学生或教师判断能够引用明确证据并说明边界。",
    observable: (_, scene) => `在“${scene.title}”中，产出能够区分事实、推论和判断，并回溯到证据来源。`,
  },
  {
    id: "cognitive-engagement",
    dimension: "认知参与水平",
    focus: "学生经历理解、分析、评价或迁移等可观察认知活动。",
    observable: (_, scene) => `在“${scene.title}”中，学生不只复述材料，还能解释、比较、论证或迁移。`,
  },
  {
    id: "evaluation-validity",
    dimension: "评价效度",
    focus: "评价标准、等级描述和学生产出可对应。",
    observable: (_, scene) => `在“${scene.title}”中，评价结论能够对应具体产出、量规维度和等级描述。`,
  },
  {
    id: "feedback-actionability",
    dimension: "反馈可操作性",
    focus: "反馈指向具体证据、具体问题和下一步行动。",
    observable: (_, scene) => `在“${scene.title}”中，反馈能让学生或教师明确下一步修正动作。`,
  },
  {
    id: "reflection-improvement",
    dimension: "反思改进质量",
    focus: "反思区分事实证据、教学判断和持续改进行动。",
    observable: (_, scene) => `在“${scene.title}”中，反思或改进建议能够基于证据形成下一轮教学调整。`,
  },
];

export function generateEvidenceRules(outline: CourseOutline, scenes: TeachingScene[]): EvidenceRule[] {
  return scenes.map((scene, index) => {
    const profile = profileForScene(scene, index);
    return {
      id: `rule-${scene.id}-${profile.id}`,
      sceneId: scene.id,
      dimension: profile.dimension,
      observableBehavior: profile.observable(outline, scene),
      evidenceRefs: evidenceRefsForScene(scene),
      teacherCheck: teacherCheckForScene(scene, profile),
      levelDescriptors: levelDescriptors(profile, scene),
    };
  });
}

function profileForScene(scene: TeachingScene, index: number): DimensionProfile {
  if (scene.type === "asset_graph") return DIMENSION_PROFILES[6];
  if (scene.type === "reflection") return DIMENSION_PROFILES[7];
  return DIMENSION_PROFILES[index % DIMENSION_PROFILES.length];
}

function evidenceRefsForScene(scene: TeachingScene): string[] {
  return [
    `${scene.id}.expectedEvidence`,
    `${scene.id}.outputs`,
    `${scene.id}.evaluationFocus`,
    ...scene.expectedEvidence.map((_, index) => `${scene.id}.expectedEvidence.${index + 1}`),
  ];
}

function teacherCheckForScene(scene: TeachingScene, profile: DimensionProfile): string {
  const checkpoint = scene.teacherIntervention.required
    ? `并在“${scene.teacherIntervention.checkpoint}”节点完成教师确认`
    : "并允许教师抽查证据完整性";
  return `确认“${scene.title}”的${profile.dimension}证据充分、来源合规，${checkpoint}。`;
}

function levelDescriptors(profile: DimensionProfile, scene: TeachingScene): EvidenceLevelDescriptors {
  return {
    insufficient: `${profile.focus} 当前证据不足，无法支撑“${scene.title}”的评价判断。`,
    basic: `${profile.focus} 已有基础证据，但证据来源、行为表现或等级判断仍需教师补充。`,
    good: `${profile.focus} 证据较完整，能支持主要评价判断，并能指出改进方向。`,
    excellent: `${profile.focus} 证据完整、边界清晰、判断可回溯，可直接进入资产沉淀或下一轮改进。`,
  };
}
