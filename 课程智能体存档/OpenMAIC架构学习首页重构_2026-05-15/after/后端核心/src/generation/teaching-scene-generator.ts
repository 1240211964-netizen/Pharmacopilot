import type { CourseOutline, TeachingScene } from "./pipeline-types";

export function generateTeachingScenes(outline: CourseOutline): TeachingScene[] {
  return [
    {
      id: "scene-design",
      type: "design",
      stepIds: [1, 2, 3, 4, 5, 6, 7, 8],
      title: "课前教学设计与准备场景",
      runtimeState: "queued",
      agent: "teaching-design-mentor",
      actions: ["generate_objective", "generate_case", "generate_question", "generate_rubric"],
      expectedEvidence: ["课程目标", "学情诊断", "案例材料", "预习任务", "评价量规草案"],
    },
    {
      id: "scene-practice",
      type: "practice",
      stepIds: [9, 10, 11, 12, 13, 14, 15, 16],
      title: "课中教学实施与调控场景",
      runtimeState: "running",
      agent: "simulated-student-agent",
      actions: ["generate_question", "simulate_student_response", "evaluate_task", "collect_evidence"],
      expectedEvidence: ["课堂追问", "学生回应", "小组成果", "即时反馈记录"],
    },
    {
      id: "scene-evaluation",
      type: "evaluation",
      stepIds: [17, 18, 19],
      title: "课后评价证据场景",
      runtimeState: "needs_teacher_takeover",
      agent: "evidence-rule-assistant",
      actions: ["generate_rubric", "collect_evidence", "evaluate_task"],
      expectedEvidence: ["学习成果", "评分记录", "困难诊断", "反馈模板"],
    },
    {
      id: "scene-asset-graph",
      type: "asset_graph",
      stepIds: [20],
      title: "课程资产图谱场景",
      runtimeState: "queued",
      agent: "course-asset-curator",
      actions: ["collect_evidence", "export_asset"],
      expectedEvidence: ["教案", "PPT", "课堂活动单", "rubric", "证据链", "教学反思报告"],
    },
    {
      id: "scene-reflection",
      type: "reflection",
      stepIds: [20],
      title: `${outline.topic} 教学反思与改进场景`,
      runtimeState: "queued",
      agent: "teaching-design-mentor",
      actions: ["evaluate_task", "collect_evidence", "export_asset"],
      expectedEvidence: ["教师反思", "学生表现证据", "下一轮改进动作"],
    },
  ];
}
