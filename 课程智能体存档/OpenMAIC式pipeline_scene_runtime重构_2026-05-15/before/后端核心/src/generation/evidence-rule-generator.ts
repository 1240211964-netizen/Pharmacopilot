import type { CourseOutline, EvidenceRule, TeachingScene } from "./pipeline-types";

export function generateEvidenceRules(outline: CourseOutline, scenes: TeachingScene[]): EvidenceRule[] {
  const sceneRefs = scenes.map((scene) => scene.id);
  return [
    {
      id: "rule-objective-alignment",
      dimension: "目标一致性",
      observableBehavior: `学生能够围绕 ${outline.topic} 说明概念、情境和任务产出的关系。`,
      evidenceRefs: ["objective-map", "student-output", sceneRefs[0]],
      teacherCheck: "确认课堂任务没有偏离课程目标和学生专业背景。",
    },
    {
      id: "rule-case-evidence",
      dimension: "案例证据质量",
      observableBehavior: "学生在案例分析中引用课程材料、政策情境或经营数据支撑判断。",
      evidenceRefs: ["case-material", "group-record", sceneRefs[1]],
      teacherCheck: "确认案例证据来自教师允许的来源边界。",
    },
    {
      id: "rule-rubric-validity",
      dimension: "评价效度",
      observableBehavior: "rubric 每个维度都能对应可观察行为和学生产出。",
      evidenceRefs: ["rubric", "score-record", sceneRefs[2]],
      teacherCheck: "确认评分维度、等级描述和 evidenceRefs 完整。",
    },
    {
      id: "rule-reflection-loop",
      dimension: "反思改进",
      observableBehavior: "教师能基于课堂证据提出下一轮教学调整。",
      evidenceRefs: ["reflection-report", "asset-pack", sceneRefs[3]],
      teacherCheck: "确认反思报告区分事实证据和教师判断。",
    },
  ];
}
