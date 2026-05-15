import type { CourseGenerationInput, CourseOutline } from "./pipeline-types";

const DEFAULT_STAGES = [
  ["pre-class", "课前教学设计与准备", "明确课程任务、学情起点、目标和资源", "01-08"],
  ["in-class", "课中教学实施与调控", "推进问题情境、协作探究、互动追问和即时反馈", "09-16"],
  ["post-class", "课后评价反馈与持续改进", "收集成果证据、诊断困难、沉淀反思和资产", "17-20"],
] as const;

export function generateCourseOutline(input: CourseGenerationInput): CourseOutline {
  const topic = input.topic || "SWOT 分析";
  const courseName = input.courseName || "管理学原理";
  return {
    id: stableId("outline", input.courseId, topic),
    title: `${courseName} · ${topic} 课程生成骨架`,
    courseName,
    topic,
    studentProfile: input.studentProfile || "药事管理专业本科生",
    stages: DEFAULT_STAGES.map(([id, title, objective, stepRange]) => ({
      id,
      title,
      objective,
      stepRange,
    })),
    objectives: [
      `解释 ${topic} 的关键概念和适用边界。`,
      `基于药事管理情境完成证据分析和方案判断。`,
      "形成可观察、可评价、可复盘的课堂学习产出。",
    ],
    constraints: input.constraints.length
      ? input.constraints
      : ["2 学时", "新教师可审校", "所有评价维度必须绑定证据来源"],
    sourceBoundary: input.sourceBoundary || "仅使用教师确认的课程资料、课堂记录和授权学习数据。",
  };
}

function stableId(prefix: string, courseId: string, topic: string): string {
  return `${prefix}-${courseId || "course"}-${topic}`.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, "-");
}
