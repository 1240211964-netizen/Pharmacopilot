import { generateStructuredJson } from "./ai";
import {
  assetSummaryJsonSchema,
  lessonPlanJsonSchema,
  rubricJsonSchema,
  sourceBoundaryJsonSchema,
} from "./json-schemas";
import type { CourseSource } from "./sources";
import { renderSourcesForPrompt } from "./sources";

type JsonRecord = Record<string, unknown>;

const systemPrompt = [
  "You are Pharmacopilot, a teaching copilot for novice pharmacy faculty in universities.",
  "Generate practical, classroom-ready teaching support in Simplified Chinese.",
  "Respect the supplied course source boundary. If evidence is missing, say so in the JSON limitations fields.",
  "Return only valid JSON matching the requested schema.",
].join("\n");

function courseContext(course: JsonRecord) {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
  };
}

export async function buildLessonPlan(input: JsonRecord, course: JsonRecord, sources: CourseSource[]) {
  const mock = {
    title: `${input.topic} 教案`,
    lessonOverview: "围绕药学管理场景组织一次可执行课堂，兼顾概念理解、案例讨论与形成性评价。",
    durationMinutes: Number(input.durationMinutes || 90),
    contextAlignment: {
      courseObjectives: input.learningObjectives || [],
      chapterObjectives: ["解释核心概念", "将概念迁移到药学管理情境"],
      teachingFocus: ["药学场景转化", "课堂互动", "证据化评价"],
      learnerAssumptions: [String(input.learnerProfile || "学生具备基础药学专业认知，但管理学迁移经验有限。")],
    },
    timeline: [
      {
        phase: "导入",
        minutes: 10,
        teacherActions: ["展示药学管理真实情境", "提出驱动问题"],
        studentActions: ["快速判断情境中的管理问题"],
        materials: ["案例卡"],
        checksForUnderstanding: ["请学生说出一个关键利益相关者"],
      },
      {
        phase: "讲授与活动",
        minutes: Number(input.durationMinutes || 90) - 20,
        teacherActions: ["讲解核心概念", "组织小组讨论", "追问决策依据"],
        studentActions: ["完成情境分析", "提交小组结论"],
        materials: ["板书结构", "讨论任务单"],
        checksForUnderstanding: ["用一句话解释概念与案例的关系"],
      },
      {
        phase: "总结评价",
        minutes: 10,
        teacherActions: ["总结易错点", "布置迁移任务"],
        studentActions: ["完成出口条"],
        materials: ["出口条"],
        checksForUnderstanding: ["写下一个仍不确定的问题"],
      },
    ],
    activities: [
      {
        name: "药学情境小组决策",
        purpose: "帮助学生把抽象管理概念迁移到药学岗位任务。",
        instructions: ["阅读情境", "识别问题", "提出两个备选方案", "说明选择依据"],
        expectedOutput: "一页小组决策说明。",
        pharmacyContext: "药品供应、药学服务、药店运营或医保支付场景。",
      },
    ],
    assessment: {
      formativeChecks: ["出口条", "小组汇报", "随堂判断题"],
      homework: "选择一个药学管理情境，写出问题、利益相关者和改进方案。",
      evidenceOfLearning: ["能准确解释概念", "能用证据支持管理判断"],
    },
    teachingNotes: ["保留可压缩环节以控制课堂节奏。", "对新教师提供追问脚本。"],
    sourceUse: {
      usedSources: sources.map((source) => source.id),
      limitations: sources.length ? [] : ["未提供课程材料，结果仅基于用户输入与通用教学设计原则。"],
    },
  };

  return generateStructuredJson({
    schemaName: "lesson_plan",
    schema: lessonPlanJsonSchema,
    systemPrompt,
    userPrompt: JSON.stringify(
      {
        task: "Generate a structured lesson plan.",
        course: courseContext(course),
        input,
        sources: renderSourcesForPrompt(sources),
      },
      null,
      2,
    ),
    mock,
  });
}

export async function buildRubric(input: JsonRecord, course: JsonRecord, sources: CourseSource[]) {
  const levels = (input.levels as string[] | undefined) || ["优秀", "良好", "合格", "需改进"];
  const mock = {
    title: `${input.title} Rubric`,
    taskDescription: String(input.taskDescription),
    totalScore: Number(input.totalScore || 100),
    dimensions: ["概念准确性", "药学情境分析", "证据与论证", "表达规范"].map((name) => ({
      name,
      weight: 25,
      criteria: levels.map((level, index) => ({
        level,
        scoreRange: index === 0 ? "21-25" : index === 1 ? "16-20" : index === 2 ? "11-15" : "0-10",
        descriptor: `${level}：围绕${name}给出清晰、可观察的表现描述。`,
      })),
    })),
    scoringGuide: ["先按维度独立评分，再核对证据是否来自任务产出。"],
    feedbackTemplates: ["你的优势是能联系药学情境，下一步需要补充更明确的证据。"],
    alignmentNotes: ["Rubric 维度与学习目标、课堂任务和药学岗位能力保持一致。"],
    sourceUse: {
      usedSources: sources.map((source) => source.id),
      limitations: sources.length ? [] : ["未提供课程材料，Rubric 依据用户任务描述生成。"],
    },
  };

  return generateStructuredJson({
    schemaName: "rubric",
    schema: rubricJsonSchema,
    systemPrompt,
    userPrompt: JSON.stringify(
      {
        task: "Generate a scoring rubric.",
        course: courseContext(course),
        input,
        sources: renderSourcesForPrompt(sources),
      },
      null,
      2,
    ),
    mock,
  });
}

export async function buildAssetSummary(input: JsonRecord, course: JsonRecord, sources: CourseSource[]) {
  const mock = {
    title: String(input.title),
    assetType: String(input.assetType || "teaching_asset"),
    shortSummary: "该教学资产可用于支持药学管理课堂的案例导入、概念讲解和讨论评价。",
    teachingUseCases: ["课前预习材料", "课堂案例讨论", "课后复盘资源"],
    keyConcepts: ["药学管理", "决策分析", "教学评价"],
    recommendedLessonMoments: ["导入环节", "互动讨论环节", "总结迁移环节"],
    cautions: ["若材料尚未完成文本解析，需要教师核对原文。"],
    sourceBoundary: "仅依据用户提交内容和已授权课程材料生成摘要。",
    sourceUse: {
      usedSources: sources.map((source) => source.id),
      limitations: sources.length ? [] : ["未关联课程材料。"],
    },
  };

  return generateStructuredJson({
    schemaName: "asset_summary",
    schema: assetSummaryJsonSchema,
    systemPrompt,
    userPrompt: JSON.stringify(
      {
        task: "Summarize a teaching asset and recommend classroom uses.",
        course: courseContext(course),
        input,
        sources: renderSourcesForPrompt(sources),
      },
      null,
      2,
    ),
    mock,
  });
}

export async function buildSourceBoundary(input: JsonRecord, course: JsonRecord, sources: CourseSource[]) {
  const mock = {
    boundaryStatement: "本次生成仅允许使用当前课程下已授权的课程材料、用户输入和明确标注的通用教学设计原则。",
    allowedSources: sources.map((source) => ({
      sourceId: source.id,
      title: source.title,
      reason: "该文件属于当前课程，且通过接口权限校验。",
    })),
    excludedSources: [],
    citationRules: ["引用课程材料时保留 sourceId。", "无法从材料确认的信息必须标记为待教师核验。"],
    modelGuardrails: ["不得伪造课程大纲或政策依据。", "不得引用未上传或未授权的私人材料。"],
    missingInformation: sources.length ? [] : ["当前课程尚未提供可用来源。"],
    nextSteps: ["上传课程大纲、培养方案、教材章节或案例材料后再生成。"],
  };

  return generateStructuredJson({
    schemaName: "source_boundary",
    schema: sourceBoundaryJsonSchema,
    systemPrompt,
    userPrompt: JSON.stringify(
      {
        task: "Define and audit the knowledge source boundary for a Pharmacopilot generation run.",
        course: courseContext(course),
        input,
        sources: renderSourcesForPrompt(sources),
      },
      null,
      2,
    ),
    mock,
  });
}
