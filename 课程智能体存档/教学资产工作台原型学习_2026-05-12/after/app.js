const NAVIGATION_TRAINING_KEY = "pharmacopilot-navigation-training-state";
const TRAINING_STATE_KEY = "pharmacopilot.trainingState";
const FANYA_AUTH_KEY = "pharmacopilot-fanya-auth-state";
const PRACTICE_WORKFLOW_KEY = "pharmacopilot-practice-workflow-state";
const ASSETS_KEY = "pharmacopilot-assets";
const ACCOUNT_SESSION_KEY = "pharmacopilot-account-session";
const HOME_TASK_ENTRY_KEY = "pharmacopilot-home-task-entry";
const FANYA_MOCK_ACCOUNT = {
  account: "teacher.demo@pharmacopilot.test",
  token: "mock-fanya-token-2026",
  platformUrl: "https://fanya.chaoxing.com",
  teacherName: "测试教师",
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const goalCalibratorScenarioOutputs = {
  chronic: {
    task: "某高校药事管理本科课堂围绕药品政策与机构管理情境开展 SWOT 分析，请学生从课程案例事实、政策要求、组织资源、利益相关者和风险边界等角度完成判断。",
    evidence: "评价学生的因素分类准确性、证据支撑充分性、策略匹配度和风险意识。",
  },
  insurance: {
    task: "某地区药品政策发生调整，请学生从政策目标、支付边界、机构管理、公众需求、合规要求和风险控制等角度完成 SWOT 分析。",
    evidence: "评价学生对政策机会与管理约束的识别准确性、依据引用、策略可行性和风险边界意识。",
  },
  operation: {
    task: "某药品零售企业准备优化处方药经营与库存周转，请学生从品类结构、供应链稳定性、药师服务能力、顾客需求、竞争格局和质量管理等角度完成 SWOT 分析。",
    evidence: "评价学生对经营因素的分类准确性、经营数据或案例证据使用、策略与资源匹配度和质量安全意识。",
  },
  compliance: {
    task: "某药店面临处方审核、药师在岗和促销宣传合规风险，请学生从制度流程、人员能力、监管要求、患者安全、品牌声誉和外部检查压力等角度完成 SWOT 分析。",
    evidence: "评价学生对合规风险的识别准确性、监管依据引用、策略边界清晰度和患者安全意识。",
  },
};

const goalCalibratorPlanOutputs = {
  A: "本课先帮助学生准确理解 SWOT 的四类要素与内外部边界，为后续案例判断建立共同语言。",
  B: "SWOT 分析帮助药事管理本科生在管理学原理课程案例中，识别内部条件与外部环境，并形成有证据支撑的管理判断。",
  C: "本课以可展示的 SWOT 矩阵和管理建议为产出，推动学生把概念学习转化为可提交、可评价的课堂作品。",
  D: "本课围绕真实药事管理问题展开探究，引导学生在证据不足、利益相关者复杂的情境中提出判断依据。",
  E: "本课面向药师、店长、医保与监管等职业情境，训练学生把 SWOT 工具用于岗位化管理决策表达。",
  F: "本课不仅训练工具使用，还强化证据意识、合规意识、患者安全意识与团队决策表达等综合素养。",
};

const goalCalibratorLevelOutputs = {
  understand:
    "学生能够基于一个药事管理案例，解释 SWOT 分析的用途，区分优势、劣势、机会与威胁，并说明每类因素的判断依据。",
  apply:
    "学生能够基于一个药事管理案例，填写 SWOT 矩阵，完成四类因素归类，并使用矩阵提出与情境匹配的管理策略。",
  analyze:
    "学生能够基于一个药事管理案例，比较门店内部资源与外部环境，拆解优势、劣势、机会与威胁，构建 SWOT 矩阵，并判断管理策略是否与情境匹配。",
  evaluate:
    "学生能够基于一个药事管理案例，论证 SWOT 判断的证据基础，权衡不同管理策略的收益与风险，并提出建议。",
};

const defaultTrainingCourse = {
  courseName: "管理学原理",
  lessonTitle: "管理学原理中的 SWOT 分析：药事管理本科课堂案例",
  topic: "SWOT 分析",
  scenario: "药事管理本科课堂中的 SWOT 分析教学",
  teachingObject: "药事管理本科生",
  userPersona: "新教师",
  lessonLength: "1次课 / 2学时",
  coreTask:
    "学生基于课程案例事实、政策材料、组织资源、利益相关者和风险边界完成一页 SWOT 矩阵，并提出一条有证据支撑的管理建议。",
};

const trainingContextFieldLabels = {
  courseName: "课程",
  topic: "主题",
  scenario: "场景",
};

function cleanContextValue(value, fallback) {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function normalizeStoredTrainingContext(stored = {}) {
  const topic = cleanContextValue(stored.topic, defaultTrainingCourse.topic);
  const scenario = cleanContextValue(stored.scenario, defaultTrainingCourse.scenario);
  const isOldDefaultExample =
    topic === defaultTrainingCourse.topic &&
    scenario === defaultTrainingCourse.scenario &&
    (!stored.courseName || stored.courseName === "药事管理");
  return {
    ...stored,
    courseName: isOldDefaultExample ? defaultTrainingCourse.courseName : stored.courseName,
    teachingObject:
      !stored.teachingObject || stored.teachingObject === "药事管理专业本科生" || stored.teachingObject === "药事管理本科生"
        ? defaultTrainingCourse.teachingObject
        : stored.teachingObject,
  };
}

function isDefaultTrainingContext(context = defaultTrainingCourse) {
  return (
    context.courseName === defaultTrainingCourse.courseName &&
    context.topic === defaultTrainingCourse.topic &&
    context.scenario === defaultTrainingCourse.scenario
  );
}

function isPharmacyTrainingContext(context = defaultTrainingCourse) {
  return /药|病|医保|处方|合规|监管|药师|药店|药品/.test(
    `${context.courseName || ""}${context.topic || ""}${context.scenario || ""}`,
  );
}

function getTrainingEvidenceText(context = defaultTrainingCourse) {
  if (isPharmacyTrainingContext(context)) return "课程案例事实、政策材料、组织资源、利益相关者和风险边界";
  return "课程资料、案例事实、学生已有经验、过程记录和评价要求";
}

function getTrainingOutputLabel(context = defaultTrainingCourse) {
  const text = `${context.topic || ""}${context.scenario || ""}`;
  if (/SWOT/i.test(text)) return "SWOT 矩阵与决策建议";
  if (/法规|合规|处方|监管|风险/.test(text)) return "风险识别报告与依据说明";
  if (/经营|运营|供应链|服务流程|优化/.test(text)) return "任务优化方案与证据说明";
  return `${context.topic}任务成果与证据说明`;
}

function getTrainingCaseMaterialLabel(context = defaultTrainingCourse) {
  if (isPharmacyTrainingContext(context)) return "课程案例材料";
  return "情境案例材料";
}

function buildTrainingLessonTitle(context = defaultTrainingCourse) {
  if (isDefaultTrainingContext(context)) return defaultTrainingCourse.lessonTitle;
  return `${context.courseName}中的${context.topic}：${context.scenario}`;
}

function buildTrainingCoreTask(context = defaultTrainingCourse) {
  if (isDefaultTrainingContext(context)) return defaultTrainingCourse.coreTask;
  return `学生基于${getTrainingEvidenceText(context)}完成一份${getTrainingOutputLabel(context)}，并提出一条可解释、可评价的改进建议。`;
}

function getTrainingCourseContext() {
  const stored = normalizeStoredTrainingContext(trainingState?.courseContext || {});
  const context = {
    ...defaultTrainingCourse,
    ...stored,
    courseName: cleanContextValue(stored.courseName, defaultTrainingCourse.courseName),
    topic: cleanContextValue(stored.topic, defaultTrainingCourse.topic),
    scenario: cleanContextValue(stored.scenario, defaultTrainingCourse.scenario),
    teachingObject: cleanContextValue(stored.teachingObject, defaultTrainingCourse.teachingObject),
    userPersona: cleanContextValue(stored.userPersona, defaultTrainingCourse.userPersona),
    lessonLength: cleanContextValue(stored.lessonLength, defaultTrainingCourse.lessonLength),
  };
  context.lessonTitle = buildTrainingLessonTitle(context);
  context.coreTask = cleanContextValue(stored.coreTask, buildTrainingCoreTask(context));
  return context;
}

function getStoredTrainingCourseContext() {
  const context = getTrainingCourseContext();
  return {
    courseName: context.courseName,
    topic: context.topic,
    scenario: context.scenario,
    teachingObject: context.teachingObject,
    userPersona: context.userPersona,
    lessonLength: context.lessonLength,
    coreTask: context.coreTask,
  };
}

function contextualizeTrainingText(value, context = getTrainingCourseContext()) {
  if (typeof value !== "string") return value;
  const evidence = getTrainingEvidenceText(context);
  const outputLabel = getTrainingOutputLabel(context);
  const caseMaterialLabel = getTrainingCaseMaterialLabel(context);
  let text = value
    .replace(/药事管理中的 SWOT 分析：药事管理本科课堂案例/g, context.lessonTitle)
    .replace(/药事管理专业本科生/g, context.teachingObject)
    .replace(/药事管理本科生/g, context.teachingObject)
    .replace(/药事管理专业培养/g, `${context.courseName}课程学习`)
    .replace(/药事管理专业能力/g, `${context.courseName}课程能力`)
    .replace(/药事管理专业/g, `${context.courseName}课程`)
    .replace(/药事管理本科课堂中的 SWOT 分析教学/g, context.scenario)
    .replace(/药事服务、药品经营、医保支付和合规监管情境/g, `${context.scenario}情境`)
    .replace(/药品政策、机构管理、公共卫生管理与合规监管等场景/g, `${context.scenario}等场景`)
    .replace(/药事服务、药品经营、医保支付和合规监管/g, context.scenario)
    .replace(/课程案例事实、政策材料、组织资源、利益相关者和风险边界/g, evidence)
    .replace(/患者需求、药师能力、医保支付、门店流程和监管要求/g, evidence)
    .replace(/门店资源、药师能力、患者需求、医保支付、监管要求和竞争环境/g, evidence)
    .replace(/政策要求、支付边界、患者负担、药师服务、门店流程和风险控制/g, evidence)
    .replace(/品类结构、供应链稳定性、药师服务能力、顾客需求、竞争格局和质量管理/g, evidence)
    .replace(/制度流程、人员能力、监管要求、患者安全、品牌声誉和外部检查压力/g, evidence)
    .replace(/课程案例材料/g, caseMaterialLabel)
    .replace(/SWOT 矩阵与决策建议/g, outputLabel)
    .replace(/SWOT 矩阵成果评价/g, "任务成果评价")
    .replace(/SWOT 任务书/g, "本课任务书")
    .replace(/SWOT 模板与证据表/g, "证据模板与记录表")
    .replace(/SWOT 过程文档/g, "学习过程文档")
    .replace(/一页 SWOT 矩阵/g, `一份${outputLabel}`)
    .replace(/SWOT 表/g, "任务成果表")
    .replace(/SWOT 四象限/g, "任务分析框架")
    .replace(/S、W、O、T 四类要素/g, "课程关键要素")
    .replace(/SWOT 四类要素/g, "课程关键要素")
    .replace(/SWOT 分类/g, "概念分类")
    .replace(/内部条件与外部环境/g, "概念边界与证据类型")
    .replace(/内部因素与外部因素/g, "概念边界与证据类型")
    .replace(/内部资源与外部环境/g, "课程资源与外部约束")
    .replace(/优势与机会混淆/g, "概念边界混淆")
    .replace(/优势、劣势、机会与威胁/g, "关键概念、约束条件与行动机会")
    .replace(/优势、机会/g, "关键概念")
    .replace(/SWOT 分析课/g, `${context.topic}课`)
    .replace(/SWOT 相关知识点/g, `${context.topic}相关知识点`)
    .replace(/SWOT 分析/g, context.topic)
    .replace(/SWOT/g, /SWOT/i.test(context.topic) ? "SWOT" : "本课主题");

  if (!isPharmacyTrainingContext(context)) {
    text = text
      .replace(/药事管理场景/g, `${context.courseName}场景`)
      .replace(/药事管理问题/g, `${context.courseName}问题`)
      .replace(/药事管理判断/g, `${context.courseName}判断`)
      .replace(/药事管理决策/g, `${context.courseName}任务`)
      .replace(/药事管理情境/g, `${context.scenario}情境`)
      .replace(/药学场景/g, `${context.courseName}场景`)
      .replace(/药学情境/g, `${context.courseName}情境`)
      .replace(/药学证据/g, "课程证据")
      .replace(/药学服务场景/g, `${context.courseName}场景`)
      .replace(/患者安全和合规边界/g, "任务边界和可行性")
      .replace(/患者安全、合规要求和决策可行性/g, "任务边界、实施要求和方案可行性")
      .replace(/药师、店长、医保与监管等职业情境/g, `${context.scenario}中的相关角色情境`);
  }

  return text;
}

function contextualizeTrainingValue(value, context = getTrainingCourseContext()) {
  if (typeof value === "string") return contextualizeTrainingText(value, context);
  if (Array.isArray(value)) return value.map((item) => contextualizeTrainingValue(item, context));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, contextualizeTrainingValue(item, context)]));
  }
  return value;
}

function getContextualTrainingStep(step, context = getTrainingCourseContext()) {
  const options = contextualizeTrainingValue({ ...step.options }, context);
  if (step.id === 5) {
    options.B = getTrainingCaseMaterialLabel(context);
    options.C = "本课任务书";
    options.E = "证据模板与记录表";
  }
  if (step.id === 8) options.F = "评价量规与证据清单";
  if (step.id === 12) options.C = `${getTrainingOutputLabel(context)}证据提取`;
  if (step.id === 17) options.A = `${getTrainingOutputLabel(context)}收集与归档`;
  if (step.id === 20) options.F = "下一轮教学改进计划";
  return {
    ...step,
    coreQuestion: contextualizeTrainingText(step.coreQuestion, context),
    options,
    courseContext: context,
  };
}

function getContextualTrainingWorkflowConfig(context = getTrainingCourseContext()) {
  return trainingWorkflowConfig.map((stage) => ({
    ...stage,
    steps: stage.steps.map((step) => getContextualTrainingStep(step, context)),
  }));
}

const trainingWorkflowConfig = [
  {
    stageId: "stage-1",
    stageTitle: "阶段一：课前教学设计与准备",
    steps: [
      {
        id: 1,
        title: "教学情境与课程任务分析",
        coreQuestion: "本次课要放在怎样的课程情境和专业任务中展开？",
        options: {
          A: "课程标准与培养方案导向",
          B: "真实问题与案例任务导向",
          C: "专业能力与岗位情境导向",
          D: "课堂产出与学习证据导向",
          E: "学生发展与课程思政导向",
          F: "平台数据与教学改进导向",
        },
      },
      {
        id: 2,
        title: "学情分析与学习起点诊断",
        coreQuestion: "学生当前的知识基础、学习困难和进入本课的起点是什么？",
        options: {
          A: "先备知识诊断",
          B: "常见误区识别",
          C: "学习动机与参与状态分析",
          D: "作业与测验数据分析",
          E: "能力差异与分层支持判断",
          F: "学生问题与学习需求收集",
        },
      },
      {
        id: 3,
        title: "教学目标与预期学习成果设计",
        coreQuestion: "本次课应形成哪些可观察、可评价的学习成果？",
        options: {
          A: "知识理解目标",
          B: "概念辨析目标",
          C: "案例分析目标",
          D: "证据判断目标",
          E: "方案决策目标",
          F: "反思迁移目标",
        },
      },
      {
        id: 4,
        title: "教学内容重构与核心概念提炼",
        coreQuestion: "如何把课程内容重构为适合本次课学习的核心概念与问题链？",
        options: {
          A: "核心概念提炼",
          B: "重点难点分解",
          C: "问题链组织",
          D: "案例线索嵌入",
          E: "认知负荷控制",
          F: "知识结构可视化",
        },
      },
      {
        id: 5,
        title: "学习资源与案例材料开发",
        coreQuestion: "本次课需要准备哪些能支撑学生学习和判断的资源材料？",
        options: {
          A: "课件与讲义",
          B: "课程案例材料",
          C: "本课任务书",
          D: "平台资源与视频材料",
          E: "证据模板与记录表",
          F: "政策、数据或行业资料",
        },
      },
      {
        id: 6,
        title: "课前学习支架与预习任务设计",
        coreQuestion: "课前应给学生提供怎样的支架和预习任务？",
        options: {
          A: "导学问题单",
          B: "概念预习材料",
          C: "案例背景阅读",
          D: "平台预习任务",
          E: "分层学习资源",
          F: "学生疑问收集表",
        },
      },
      {
        id: 7,
        title: "诊断性评价与学习问题收集",
        coreQuestion: "课前如何判断学生是否具备进入课堂活动的基础？",
        options: {
          A: "课前小测",
          B: "概念判断题",
          C: "案例预判题",
          D: "开放问题征集",
          E: "平台学习数据诊断",
          F: "教师课前预判记录",
        },
      },
      {
        id: 8,
        title: "教学过程、活动序列与评价量规设计",
        coreQuestion: "本次课的活动序列、时间安排和评价标准如何形成闭环？",
        options: {
          A: "讲授-练习序列",
          B: "案例-讨论序列",
          C: "任务-协作序列",
          D: "展示-评价序列",
          E: "线上线下混合序列",
          F: "评价量规与证据清单",
        },
      },
    ],
  },
  {
    stageId: "stage-2",
    stageTitle: "阶段二：课中教学实施与调控",
    steps: [
      {
        id: 9,
        title: "问题情境创设与学习动机激发",
        coreQuestion: "课堂如何从真实问题进入学习任务并激发学生投入？",
        options: {
          A: "真实案例导入",
          B: "冲突问题导入",
          C: "数据或政策情境导入",
          D: "学生经验唤起",
          E: "职业任务导入",
          F: "课堂投票或即时判断",
        },
      },
      {
        id: 10,
        title: "先行组织与已有经验激活",
        coreQuestion: "如何帮助学生调动已有经验并建立新旧知识联系？",
        options: {
          A: "先行组织图",
          B: "知识回顾提问",
          C: "经验分享与连接",
          D: "概念边界澄清",
          E: "学习目标重申",
          F: "任务规则说明",
        },
      },
      {
        id: 11,
        title: "核心概念讲解与认知支架提供",
        coreQuestion: "如何把关键概念讲清楚，并为学生完成任务提供支架？",
        options: {
          A: "概念规则讲解",
          B: "示范案例解析",
          C: "判断标准提示",
          D: "思维框架提供",
          E: "易错点即时澄清",
          F: "板书或可视化支架",
        },
      },
      {
        id: 12,
        title: "案例探究与证据分析活动",
        coreQuestion: "学生如何基于案例和证据开展分析、判断与论证？",
        options: {
          A: "案例事实提取",
          B: "证据分类整理",
          C: "任务成果证据提取",
          D: "政策或数据依据引用",
          E: "多角度比较分析",
          F: "初步判断与理由表达",
        },
      },
      {
        id: 13,
        title: "协作学习与角色任务推进",
        coreQuestion: "如何组织学生通过协作完成高质量学习任务？",
        options: {
          A: "小组协作分工",
          B: "角色任务推进",
          C: "同伴互助机制",
          D: "分层任务支持",
          E: "小组过程记录",
          F: "教师巡回指导",
        },
      },
      {
        id: 14,
        title: "学习成果展示、课堂对话与追问",
        coreQuestion: "如何通过展示、对话和追问提升学生思维质量？",
        options: {
          A: "小组成果展示",
          B: "同伴提问与回应",
          C: "教师证据追问",
          D: "观点比较与辩护",
          E: "即时展示评价",
          F: "优秀样例共建",
        },
      },
      {
        id: 15,
        title: "形成性评价与即时反馈调节",
        coreQuestion: "课堂中如何即时判断学生学习状态并调整教学？",
        options: {
          A: "课堂提问反馈",
          B: "即时测验反馈",
          C: "过程表现观察",
          D: "评价量规快速诊断",
          E: "学生自评互评",
          F: "教学节奏即时调整",
        },
      },
      {
        id: 16,
        title: "课堂总结、迁移提升与课后任务衔接",
        coreQuestion: "课堂结束时如何完成知识总结、迁移提升和课后衔接？",
        options: {
          A: "核心概念总结",
          B: "方法迁移提示",
          C: "学生困惑回应",
          D: "课后作业布置",
          E: "平台任务衔接",
          F: "学习资源推荐",
        },
      },
    ],
  },
  {
    stageId: "stage-3",
    stageTitle: "阶段三：课后评价反馈与持续改进",
    steps: [
      {
        id: 17,
        title: "学习成果收集与表现性评价",
        coreQuestion: "课后如何收集学生学习成果并进行可解释评价？",
        options: {
          A: "任务成果收集与归档",
          B: "表现性评价量规",
          C: "作业批改与批注",
          D: "学生作品样例分析",
          E: "过程证据整合",
          F: "成绩记录与反馈准备",
        },
      },
      {
        id: 18,
        title: "学习数据分析与学习困难诊断",
        coreQuestion: "如何用平台数据和学生作品识别学习困难？",
        options: {
          A: "测验与作业数据分析",
          B: "讨论参与数据分析",
          C: "错误类型归因",
          D: "低分维度诊断",
          E: "学生反馈归纳",
          F: "班级共性问题识别",
        },
      },
      {
        id: 19,
        title: "差异化反馈、补救教学与拓展支持",
        coreQuestion: "如何针对不同学习表现提供反馈、补救和拓展支持？",
        options: {
          A: "共性问题集中反馈",
          B: "个性化作业批注",
          C: "补救教学资源",
          D: "拓展学习任务",
          E: "学习小组互助",
          F: "下一次课前支持",
        },
      },
      {
        id: 20,
        title: "教学反思、资源沉淀与持续改进",
        coreQuestion: "如何把本次教学转化为下一轮可复用、可改进的教学资产？",
        options: {
          A: "教学反思记录",
          B: "教案与课件修订",
          C: "案例资源沉淀",
          D: "评价量规与反馈语复用",
          E: "平台数据复盘",
          F: "下一轮教学改进计划",
        },
      },
    ],
  },
];

const trainingSteps = trainingWorkflowConfig.flatMap((stage) =>
  stage.steps.map((step) => ({ ...step, stageId: stage.stageId, stageTitle: stage.stageTitle })),
);

function getPracticeLessonTitle(context) {
  return (
    context?.courseProfile?.lessonTitle ||
    context?.currentTopic ||
    context?.courseProfile?.courseName ||
    defaultTrainingCourse.lessonTitle
  );
}

function getPracticeTopicTitle(context) {
  return context?.currentTopic || context?.courseProfile?.chapter || getPracticeLessonTitle(context);
}

function formatPracticeLessonTitle(context) {
  const title = getPracticeLessonTitle(context);
  return title.startsWith("《") ? title : `《${title}》`;
}

function getPracticeCourseText(context) {
  return `${getPracticeLessonTitle(context)} ${getPracticeTopicTitle(context)} ${context?.courseProfile?.courseName || ""} ${
    context?.courseProfile?.chapter || ""
  }`;
}

function getPracticeOutputLabel(context) {
  const text = getPracticeCourseText(context);
  if (/法规|合规|处方|监管/.test(text)) return "合规风险识别报告与法规依据说明";
  if (/经营|运营|门店|供应链|服务流程/.test(text)) return "运营优化方案与证据说明";
  return "课程任务成果与证据说明";
}

function getPracticeCaseMaterialLabel(context) {
  const text = getPracticeCourseText(context);
  if (/法规|合规|处方|监管/.test(text)) return "法规案例材料";
  if (/经营|运营|门店|供应链|服务流程/.test(text)) return "门店运营案例材料";
  return "课程案例材料";
}

function getPracticeCoreQuestion(step, context) {
  const lesson = formatPracticeLessonTitle(context);
  const className = context?.className || defaultTrainingCourse.teachingObject;
  const questions = {
    1: `基于泛雅导入的${lesson}课程与班级数据，本课的主要定位是什么？`,
    2: `结合${lesson}课程目标和${className}学情，本课学习目标应主要强调什么？`,
    3: `泛雅学情显示，${className}在${lesson}中的主要学习特征是什么？`,
    4: `${className}完成${lesson}后应交付什么可评价成果？`,
    5: `${lesson}的主导教学方法应如何匹配当前资源与学情？`,
    6: `${lesson}内容应按什么逻辑展开？`,
    7: `${lesson}相关知识点应如何拆分和呈现？`,
    8: `课堂上学生主要围绕${lesson}做什么？`,
    9: `学生应该通过什么任务完成${lesson}学习？`,
    10: `${lesson}的课堂流程应该如何安排？`,
    11: `${lesson}需要什么教学资源？`,
    12: `学生完成${lesson}任务时需要什么支持？`,
    13: `如何评价学生是否真正掌握${lesson}的关键能力？`,
    14: `${lesson}评价标准应该如何制定？`,
    15: `通过什么证据判断学生在${lesson}中的学习过程和结果？`,
    16: `${lesson}实施应如何安排？`,
    17: `${lesson}课堂中最需要管理什么？`,
    18: `教师如何给学生的${lesson}学习表现反馈？`,
    19: `${lesson}实施中最大的风险是什么？`,
    20: `${lesson}结束后如何基于泛雅数据优化？`,
  };
  return questions[step.id] || step.coreQuestion;
}

function getPracticeOptions(step, context) {
  const options = { ...step.options };
  const outputLabel = getPracticeOutputLabel(context);
  const caseMaterialLabel = getPracticeCaseMaterialLabel(context);
  if (step.id === 4) options.C = outputLabel;
  if (step.id === 11) {
    options.B = caseMaterialLabel;
    options.C = "本课任务书";
    options.E = "证据模板与记录表";
  }
  if (step.id === 13) options.C = "任务成果评价";
  if (step.id === 15) options.D = "学习过程文档";
  if (step.id === 18) options.C = "阶段性书面反馈";
  if (step.id === 20) options.D = "根据课程成果质量优化";
  return options;
}

function getPracticeStep(step, context) {
  if (!context) return step;
  return {
    ...step,
    coreQuestion: getPracticeCoreQuestion(step, context),
    options: getPracticeOptions(step, context),
    sourceCoreQuestion: step.coreQuestion,
    sourceOptions: step.options,
    practiceContext: context,
  };
}

function contextualizePracticeText(value, context) {
  if (typeof value !== "string") return value;
  const courseText = getPracticeCourseText(context);
  if (/SWOT/i.test(courseText)) return value;
  const topic = getPracticeTopicTitle(context);
  const outputLabel = getPracticeOutputLabel(context);
  return value
    .replace(/SWOT 矩阵与决策建议/g, outputLabel)
    .replace(/SWOT 矩阵成果评价/g, "任务成果评价")
    .replace(/SWOT 任务书/g, "本课任务书")
    .replace(/SWOT 模板与证据表/g, "证据模板与记录表")
    .replace(/SWOT 过程文档/g, "学习过程文档")
    .replace(/一页 SWOT 矩阵/g, `一份${outputLabel}`)
    .replace(/SWOT 表/g, "任务成果表")
    .replace(/SWOT 四象限/g, "任务分析框架")
    .replace(/S、W、O、T 四类要素/g, "课程关键要素")
    .replace(/SWOT 四类要素/g, "课程关键要素")
    .replace(/SWOT 分类/g, "概念分类")
    .replace(/内部条件与外部环境/g, "概念边界与证据类型")
    .replace(/内部因素与外部因素/g, "概念边界与证据类型")
    .replace(/优势与机会混淆/g, "概念边界混淆")
    .replace(/优势、机会/g, "关键概念")
    .replace(/药品政策、机构管理、公共卫生管理或监管合规等具体场景/g, `${topic}相关具体场景`)
    .replace(/药事管理本科课堂案例/g, "当前课程案例")
    .replace(/患者需求、药师服务能力、医保支付、门店流程和监管要求/g, "课程资源、案例事实、平台记录和评价要求")
    .replace(/SWOT 分析课/g, `${topic}课`)
    .replace(/SWOT 分析/g, topic)
    .replace(/SWOT/g, "本课");
}

function contextualizePracticeValue(value, context) {
  if (typeof value === "string") return contextualizePracticeText(value, context);
  if (Array.isArray(value)) return value.map((item) => contextualizePracticeValue(item, context));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, contextualizePracticeValue(item, context)]));
  }
  return value;
}

function getPracticeRubric(rubric, context) {
  if (!context || !rubric) return rubric;
  return contextualizePracticeValue(rubric, context);
}

const WORKFLOW_CANVAS_WIDTH = 2600;
const WORKFLOW_CANVAS_HEIGHT = 1240;

const workflowNodes = [
  {
    id: "entry",
    type: "main",
    title: "用户入口",
    description: "新教师进入平台",
    x: 60,
    y: 100,
    width: 150,
    height: 120,
  },
  {
    id: "auth",
    type: "main",
    title: "身份认证",
    description: "泛雅 / 校内账号登录",
    x: 250,
    y: 100,
    width: 150,
    height: 120,
  },
  {
    id: "mode",
    type: "main",
    title: "模式分流",
    description: "教学导航模式 / 教学实践模式",
    x: 440,
    y: 100,
    width: 150,
    height: 120,
  },
  {
    id: "profile",
    type: "main",
    title: "基础信息采集",
    description: "课程信息、教师画像、教学目标",
    x: 630,
    y: 100,
    width: 155,
    height: 120,
  },
  {
    id: "resource-import",
    type: "main",
    title: "资源导入",
    description: "教案、课件、学情与平台数据",
    x: 825,
    y: 100,
    width: 155,
    height: 120,
  },
  {
    id: "diagnosis",
    type: "diagnosis",
    title: "智能诊断",
    description: "识别教学痛点，生成个性化建议",
    x: 1020,
    y: 100,
    width: 165,
    height: 120,
  },
  {
    id: "training",
    type: "subflow",
    title: "20环节教学实践训练",
    description: "逐环节指导、任务推进、阶段性反馈",
    x: 1235,
    y: 75,
    width: 255,
    height: 160,
    items: ["循环训练", "阶段反馈", "任务推进"],
  },
  {
    id: "implementation",
    type: "main",
    title: "教学实施支持",
    description: "课堂策略、互动设计、材料生成",
    x: 1530,
    y: 100,
    width: 160,
    height: 120,
  },
  {
    id: "process-collection",
    type: "main",
    title: "过程数据采集",
    description: "学习行为、完成度、互动反馈",
    x: 1730,
    y: 100,
    width: 160,
    height: 120,
  },
  {
    id: "analysis",
    type: "main",
    title: "多维评价分析",
    description: "评价量规、雷达图、证据链输出",
    x: 1930,
    y: 100,
    width: 160,
    height: 120,
  },
  {
    id: "optimization",
    type: "main",
    title: "反馈优化与知识沉淀",
    description: "形成改进建议、案例库与成长档案",
    x: 2130,
    y: 100,
    width: 170,
    height: 120,
  },
  {
    id: "output",
    type: "output",
    title: "最终产出",
    description: "面向教师汇报与后续迭代的结果包",
    x: 2340,
    y: 58,
    width: 240,
    height: 275,
    items: [
      "个性化教学改进方案",
      "20环节训练记录",
      "可视化评价结果",
      "教师成长档案",
      "课程智能体持续优化建议",
    ],
  },
  {
    id: "llm-engine",
    type: "capability",
    title: "大模型引擎",
    description: "理解任务、生成建议与对话协同",
    x: 930,
    y: 440,
    width: 205,
    height: 104,
  },
  {
    id: "teaching-kb",
    type: "capability",
    title: "教学知识库",
    description: "课程资料、案例、政策与教学经验",
    x: 1165,
    y: 440,
    width: 205,
    height: 104,
  },
  {
    id: "rag",
    type: "capability",
    title: "RAG 检索",
    description: "可追溯证据召回与来源约束",
    x: 1400,
    y: 440,
    width: 205,
    height: 104,
  },
  {
    id: "prompt-orchestration",
    type: "capability",
    title: "规则与 Prompt 编排",
    description: "按场景组织规则、提示词与工具链",
    x: 1635,
    y: 440,
    width: 205,
    height: 104,
  },
  {
    id: "analytics-module",
    type: "capability",
    title: "数据分析模块",
    description: "学习行为、评价证据与趋势分析",
    x: 1870,
    y: 440,
    width: 205,
    height: 104,
  },
  {
    id: "danielson",
    type: "evaluation",
    title: "Danielson",
    description: "教师专业实践框架",
    x: 2135,
    y: 735,
    width: 205,
    height: 104,
  },
  {
    id: "seeq",
    type: "evaluation",
    title: "SEEQ",
    description: "学生教学体验评价依据",
    x: 1900,
    y: 735,
    width: 205,
    height: 104,
  },
  {
    id: "copus-tdop",
    type: "evaluation",
    title: "COPUS / TDOP",
    description: "课堂观察与教学行为编码",
    x: 1665,
    y: 735,
    width: 205,
    height: 104,
  },
  {
    id: "bloom",
    type: "evaluation",
    title: "Bloom 目标层级",
    description: "学习目标与认知层级对齐",
    x: 1195,
    y: 735,
    width: 205,
    height: 104,
  },
  {
    id: "rubric20",
    type: "evaluation",
    title: "20 环节评价量规",
    description: "环节级评价标准与证据要求",
    x: 1430,
    y: 735,
    width: 205,
    height: 104,
  },
  {
    id: "data-input",
    type: "data",
    title: "输入数据",
    description: "课程、教师、目标、资源与学情",
    x: 650,
    y: 1040,
    width: 210,
    height: 104,
  },
  {
    id: "data-process",
    type: "data",
    title: "过程数据",
    description: "行为、完成度、互动与任务轨迹",
    x: 1705,
    y: 1040,
    width: 210,
    height: 104,
  },
  {
    id: "data-result",
    type: "data",
    title: "评价结果",
    description: "评价量规分析、雷达图与证据链",
    x: 1905,
    y: 1040,
    width: 210,
    height: 104,
  },
  {
    id: "data-iteration",
    type: "data",
    title: "迭代优化",
    description: "把反馈转化为下一轮诊断与训练",
    x: 2110,
    y: 1040,
    width: 210,
    height: 104,
  },
  {
    id: "data-asset",
    type: "data",
    title: "资产沉淀",
    description: "案例库、成长档案与知识库更新",
    x: 2345,
    y: 1040,
    width: 210,
    height: 104,
  },
];

const workflowNodeBlueprints = workflowNodes;

const workflowLanes = [
  {
    type: "main",
    title: "主流程",
    caption: "教师业务链路",
    x: 30,
    y: 36,
    width: 2550,
    height: 320,
  },
  {
    type: "capability",
    title: "智能能力层",
    caption: "模型、知识库、检索、Prompt 与分析模块",
    x: 880,
    y: 395,
    width: 1235,
    height: 205,
  },
  {
    type: "evaluation",
    title: "评价依据层",
    caption: "教学评价框架与 20 环节评价量规",
    x: 1130,
    y: 680,
    width: 1230,
    height: 205,
  },
  {
    type: "data",
    title: "数据闭环层",
    caption: "输入、过程、评价、迭代与资产沉淀",
    x: 590,
    y: 985,
    width: 1980,
    height: 205,
  },
  {
    type: "output",
    title: "成果区",
    caption: "最终产出与回流优化",
    x: 2290,
    y: 36,
    width: 300,
    height: 350,
  },
];

const workflowEdges = [
  { from: "entry", to: "auth", type: "main", dashed: false },
  { from: "auth", to: "mode", type: "main", dashed: false },
  { from: "mode", to: "profile", type: "main", dashed: false },
  { from: "profile", to: "resource-import", type: "main", dashed: false },
  { from: "resource-import", to: "diagnosis", type: "main", dashed: false },
  { from: "diagnosis", to: "training", type: "main", dashed: false },
  { from: "training", to: "implementation", type: "main", dashed: false },
  { from: "implementation", to: "process-collection", type: "main", dashed: false },
  { from: "process-collection", to: "analysis", type: "main", dashed: false },
  { from: "analysis", to: "optimization", type: "main", dashed: false },
  { from: "optimization", to: "output", type: "main", dashed: false },
  { from: "llm-engine", to: "diagnosis", type: "capability", dashed: true, routeY: 368 },
  { from: "teaching-kb", to: "training", type: "capability", dashed: true, routeY: 382 },
  { from: "rag", to: "training", type: "capability", dashed: true, routeY: 396 },
  { from: "prompt-orchestration", to: "implementation", type: "capability", dashed: true, routeY: 410 },
  { from: "analytics-module", to: "analysis", type: "capability", dashed: true, routeY: 424 },
  { from: "bloom", to: "training", type: "evaluation", dashed: true, routeY: 626 },
  { from: "rubric20", to: "training", type: "evaluation", dashed: true, routeY: 642 },
  { from: "copus-tdop", to: "implementation", type: "evaluation", dashed: true, routeY: 658 },
  { from: "seeq", to: "analysis", type: "evaluation", dashed: true, routeY: 674 },
  { from: "danielson", to: "optimization", type: "evaluation", dashed: true, routeY: 690 },
  { from: "data-input", to: "data-process", type: "data", dashed: true },
  { from: "data-process", to: "data-result", type: "data", dashed: true },
  { from: "data-result", to: "data-iteration", type: "data", dashed: true },
  { from: "data-iteration", to: "data-asset", type: "data", dashed: true },
  { from: "data-input", to: "profile", type: "data", dashed: true, routeY: 930 },
  { from: "data-input", to: "resource-import", type: "data", dashed: true, routeY: 954 },
  { from: "data-process", to: "process-collection", type: "data", dashed: true, routeY: 930 },
  { from: "data-result", to: "analysis", type: "data", dashed: true, routeY: 946 },
  { from: "data-iteration", to: "optimization", type: "data", dashed: true, routeY: 962 },
  { from: "data-asset", to: "output", type: "data", dashed: true, routeY: 978 },
  { from: "output", to: "data-iteration", type: "feedback", dashed: true, animated: true, label: "成果回流", arcY: 1198 },
  { from: "data-asset", to: "data-iteration", type: "feedback", dashed: true, animated: true, label: "资产回流", arcY: 1184 },
  { from: "data-iteration", to: "diagnosis", type: "feedback", dashed: true, animated: true, label: "再诊断", arcY: 1212 },
  { from: "data-iteration", to: "training", type: "feedback", dashed: true, animated: true, label: "再训练", arcY: 1226 },
];

const workflowNodeMap = new Map(workflowNodeBlueprints.map((node) => [node.id, node]));
let workflowState = {
  zoom: 0.82,
  panX: 24,
  panY: 24,
  selectedNodeId: "",
  pathFocusNodeId: "",
  runningEdgeId: "",
  query: "",
  nodePositions: {},
  dragging: null,
  panning: null,
  demoTimer: null,
};

const TRAINING_REPORT_EXPORT_KEY = "pharmacopilot.trainingReport";
const STEP_DIAGNOSTICS_KEY = "pharmacopilot.stepDiagnostics";
const FINAL_DIAGNOSTIC_KEY = "pharmacopilot.finalDiagnostic";

const FINAL_DIAGNOSTIC_DIMENSIONS = [
  {
    key: "alignment",
    label: "目标—活动—评价一致性",
    shortLabel: "一致性",
    weight: 0.2,
    theory: "Constructive Alignment",
    description: "评价学习目标、课堂活动、学生产出和评价证据之间是否形成一致闭环。",
  },
  {
    key: "authenticity",
    label: "学科内容与药事管理情境真实性",
    shortLabel: "真实性",
    weight: 0.15,
    theory: "Authentic Learning",
    description: "评价教学内容是否嵌入真实或高仿真的药事管理问题情境。",
  },
  {
    key: "learner",
    label: "学情分析与学习起点诊断",
    shortLabel: "学情诊断",
    weight: 0.15,
    theory: "学情分析 / UDL",
    description: "评价教学设计是否基于学生先备知识、常见误区、能力差异和学习支持需要。",
  },
  {
    key: "engagement",
    label: "认知参与与高阶思维",
    shortLabel: "参与度",
    weight: 0.2,
    theory: "Revised Bloom's Taxonomy",
    description: "评价课堂任务是否推动学生从记忆理解进入应用、分析、评价与创造。",
  },
  {
    key: "assessment",
    label: "评价证据与反馈效度",
    shortLabel: "评价效度",
    weight: 0.2,
    theory: "Formative Assessment / Validity",
    description: "评价量规、学生产出和反馈建议是否能够有效证明学习目标达成。",
  },
  {
    key: "reflection",
    label: "数据复盘与持续改进",
    shortLabel: "复盘改进",
    weight: 0.1,
    theory: "TDOP / COPUS / Learning Analytics",
    description: "评价教师是否能够基于平台数据、学生表现和低分维度进行教学改进。",
  },
];

const ACADEMIC_SCORE_DIMENSIONS = FINAL_DIAGNOSTIC_DIMENSIONS.map((dimension) => ({
  ...dimension,
  name: dimension.label,
}));

const SCORE_LEVELS = [
  { range: "0–1.5", level: "待建构", description: "缺少关键要素，不能支撑后续教学设计。" },
  { range: "1.5–2.5", level: "基本成形", description: "有基本方向，但表达笼统、证据不足。" },
  { range: "2.5–3.5", level: "良好", description: "能支撑新教师实际备课与课堂实施。" },
  { range: "3.5–4.0", level: "优秀", description: "逻辑清楚、证据充分、可复用、可迁移。" },
];

const HOME_SAMPLE_DIAGNOSTIC = [
  { key: "alignment", label: "目标—活动—评价一致性", shortLabel: "一致性", theory: "Constructive Alignment", score: 3.2 },
  { key: "authenticity", label: "学科内容与药事管理情境真实性", shortLabel: "真实性", theory: "Authentic Learning", score: 3.5 },
  { key: "learner", label: "学情分析与学习起点诊断", shortLabel: "学情诊断", theory: "学情分析 / UDL", score: 2.8 },
  { key: "engagement", label: "认知参与与高阶思维", shortLabel: "参与度", theory: "Bloom", score: 3.4 },
  { key: "assessment", label: "评价证据与反馈效度", shortLabel: "评价效度", theory: "Formative Assessment", score: 2.4 },
  { key: "reflection", label: "数据复盘与持续改进", shortLabel: "复盘改进", theory: "Learning Analytics", score: 2.7 },
];

const THEORY_SOURCE_LIBRARY = {
  alignment: {
    theory: "Constructive Alignment",
    author: "John Biggs; John Biggs & Catherine Tang",
    work: "Teaching for Quality Learning at University",
    extractedPrinciple: "学习目标、教学活动与评价证据应保持一致。",
  },
  authenticity: {
    theory: "Authentic Learning",
    author: "Jan Herrington; Thomas C. Reeves; Ron Oliver",
    work: "A Guide to Authentic e-Learning",
    extractedPrinciple: "真实任务、真实情境和多角色决策能提升学习迁移质量。",
  },
  learner: {
    theory: "Danielson Framework / UDL",
    author: "Charlotte Danielson; CAST",
    work: "Enhancing Professional Practice; UDL Guidelines",
    extractedPrinciple: "教学准备应理解学生基础、差异和学习障碍，并提供适切支架。",
  },
  engagement: {
    theory: "Revised Bloom’s Taxonomy",
    author: "Lorin W. Anderson; David R. Krathwohl",
    work: "A Taxonomy for Learning, Teaching, and Assessing",
    extractedPrinciple: "课堂任务应从记忆理解逐步走向应用、分析、评价与创造。",
  },
  assessment: {
    theory: "Formative Assessment / Validity",
    author: "Paul Black; Dylan Wiliam; Samuel Messick",
    work: "Assessment and Classroom Learning; Validity, in Educational Measurement",
    extractedPrinciple: "评价证据和反馈应能支持学习目标达成的解释与改进。",
  },
  reflection: {
    theory: "TDOP / COPUS / Learning Analytics",
    author: "TDOP; COPUS; George Siemens; Phil Long",
    work: "Teaching Dimensions Observation Protocol; Classroom Observation Protocol for Undergraduate STEM; Penetrating the Fog",
    extractedPrinciple: "课堂行为观察和学习过程数据可为教学复盘提供可追溯证据。",
  },
};

const TRAINING_RUBRIC_SHORT_LABELS = {
  professional_relevance: "专业关联",
  course_value_clarity: "课程价值",
  topic_boundary_accuracy: "主题边界",
  design_expandability: "可展开性",
  core_question_focus: "问题聚焦",
  topic_scope_fit: "范围适切",
  pharmacy_context_embedding: "情境嵌入",
  problem_driven_structure: "问题驱动",
  learner_identity_clarity: "对象明确",
  prior_knowledge_judgment: "先备判断",
  learning_difficulty_identification: "困难识别",
  differentiated_support_awareness: "差异支持",
  prerequisite_completeness: "先备完整",
  misconception_accuracy: "误区识别",
  diagnostic_method_feasibility: "诊断方式",
  teaching_adjustment_value: "调整价值",
  observable_verbs: "动词清晰",
  measurability: "可测量性",
  cognitive_level_balance: "层级合理",
  target_quantity_fit: "数量适切",
  bloom_alignment: "层级匹配",
  higher_order_ratio: "高阶占比",
  difficulty_progression: "难度递进",
  learner_attainability: "能力可达",
  situational_authenticity: "情境真实",
  stakeholder_completeness: "角色完整",
  decision_conflict_clarity: "冲突清晰",
  goal_service_degree: "目标服务",
  case_relevance: "案例相关",
  evidence_sufficiency: "证据充分",
  material_readability: "材料可读",
  material_use_clarity: "材料用途",
  content_thread_clarity: "主线清晰",
  key_difficulty_identification: "重难识别",
  content_progression: "层次递进",
  cognitive_load_control: "负荷控制",
  method_goal_match: "目标匹配",
  method_content_fit: "方法适用",
  novice_teacher_feasibility: "教师可执行",
  method_combination_logic: "组合合理",
  process_completeness: "流程完整",
  time_allocation_fit: "时间分配",
  rhythm_control: "节奏控制",
  transition_clarity: "转场清晰",
  hook_strength: "导入吸引",
  theme_relevance: "主题关联",
  experience_connection: "经验连接",
  discussability: "可讨论性",
  concept_accuracy: "概念准确",
  explanation_accessibility: "解释通俗",
  example_fit: "举例匹配",
  lecture_restraint: "讲授节制",
  question_progression: "问题递进",
  probing_effectiveness: "追问有效",
  participation_coverage: "参与覆盖",
  immediate_feedback: "即时反馈",
  task_goal_clarity: "任务清晰",
  role_distribution_fit: "角色分工",
  collaboration_necessity: "协作必要",
  output_requirement_clarity: "成果要求",
  output_format_clarity: "产出明确",
  target_correspondence: "目标对应",
  evidence_expression_requirement: "证据表达",
  collectability: "可收集性",
  assessment_timing: "评价时点",
  assessment_method_diversity: "方式多样",
  assessment_goal_match: "目标匹配",
  feedback_usability: "反馈可用",
  criterion_clarity: "指标清晰",
  level_distinction: "等级区分",
  evidence_correspondence: "证据对应",
  operationality: "可操作性",
  feedback_specificity: "反馈具体",
  improvement_actionability: "改进可行",
  positive_guidance: "正向引导",
  target_alignment: "目标一致",
  classroom_risk_identification: "风险识别",
  response_strategy_feasibility: "应对可行",
  data_review_awareness: "数据复盘",
  asset_deposition_value: "资产沉淀",
};

function inferTheorySourceKey(dimension = {}) {
  const key = dimension.key || "";
  const text = `${dimension.label || ""} ${dimension.description || ""} ${dimension.evidenceQuestion || ""}`;
  if (key === "professional_relevance") return "authenticity";
  if (["course_value_clarity", "topic_boundary_accuracy", "design_expandability"].includes(key)) return "alignment";
  if (/情境|角色|冲突|案例|材料|利益相关者|药学情境|场景/.test(text)) return "authenticity";
  if (/学习者|学生|先备|误区|差异|支架|支持|新教师|可达|参与覆盖/.test(text)) return "learner";
  if (/Bloom|认知|高阶|分析|评价|创造|追问|讨论|协作|动机|问题层级/.test(text)) return "engagement";
  if (/评价|评价量规|量规|评分|反馈|证据|效度|指标|等级|可操作/.test(text)) return "assessment";
  if (/数据|复盘|反思|资产|优化|风险|观察|沉淀|持续改进/.test(text)) return "reflection";
  return "alignment";
}

function inferDimensionTheorySource(dimension = {}) {
  const sourceKey = inferTheorySourceKey(dimension);
  return THEORY_SOURCE_LIBRARY[sourceKey] || THEORY_SOURCE_LIBRARY.alignment;
}

function buildGenericScoringAnchors(dimension = {}) {
  const label = dimension.label || "该维度";
  return {
    low: `0–1.5：${label}缺少关键要素，暂不能支撑本环节教学判断。`,
    medium: `1.5–2.5：${label}已有基本方向，但表达仍较笼统，证据链不足。`,
    good: `2.5–3.5：${label}较清楚，能支撑新教师完成本环节设计，但还可强化药事管理情境和可评价证据。`,
    excellent: `3.5–4.0：${label}清晰、具体、可执行，能够自然连接后续活动、评价与复盘。`,
  };
}

function rubricDimension(key, label, description, evidenceQuestion, improvementHint) {
  const baseDimension = { key, label, description, evidenceQuestion, improvementHint };
  return {
    key,
    label,
    name: label,
    shortLabel: TRAINING_RUBRIC_SHORT_LABELS[key] || label,
    description,
    evidenceQuestion,
    improvementHint,
    theorySource: inferDimensionTheorySource(baseDimension),
    scoringAnchors: buildGenericScoringAnchors(baseDimension),
    score: null,
  };
}

function getAnchorByScore(scoringAnchors, score) {
  if (!scoringAnchors || !hasNumericScore(score)) return "";
  if (score < 1.5) return scoringAnchors.low || "";
  if (score < 2.5) return scoringAnchors.medium || "";
  if (score < 3.5) return scoringAnchors.good || "";
  return scoringAnchors.excellent || "";
}

function buildTheoryAnchor(dimension, score) {
  const source = dimension?.theorySource || inferDimensionTheorySource(dimension);
  const scoringAnchors = dimension?.scoringAnchors || buildGenericScoringAnchors(dimension);
  return {
    theory: source.theory || "理论来源待补",
    author: source.author || "",
    work: source.work || "",
    principle: source.extractedPrinciple || "",
    currentAnchor: getAnchorByScore(scoringAnchors, score),
    improvementHint: dimension?.improvementHint || dimension?.improvement || "",
  };
}

function makeTrainingStepRubric(stepId, title, phase, assessmentTitle, assessmentFocus, dimensions, finalDimensionMapping) {
  return { stepId, title, phase, assessmentTitle, assessmentFocus, dimensions, finalDimensionMapping };
}

const TRAINING_STEP_RUBRICS = [
  makeTrainingStepRubric(1, "教学情境与课程任务分析", "阶段一：课前教学设计与准备", "课程任务定位诊断", "评价教师是否能把本次课放入高校课程目标、专业培养和真实任务情境中。", [
    rubricDimension("course_context_alignment", "课程情境匹配度", "是否说明本次课在课程标准、培养方案或章节结构中的位置。", "当前任务是否清楚回答了“这节课为什么在这里教”？", "补充本课与课程目标、章节任务和专业能力之间的关系。"),
    rubricDimension("professional_task_relevance", "专业任务关联度", "是否把学习主题转化为药事管理或相关专业中的真实任务。", "学生是否能看到本课学习与未来专业判断之间的关系？", "加入真实案例、岗位任务或管理决策场景。"),
    rubricDimension("teaching_problem_clarity", "教学问题清晰度", "是否形成一个能统领教学活动的核心教学问题。", "本课是否有清晰的问题主线，而不是只罗列知识点？", "把主题改写为需要分析、判断或决策的问题。"),
    rubricDimension("evidence_boundary_clarity", "证据边界清晰度", "是否明确本课可使用的课程资料、平台数据和案例材料范围。", "教师是否知道哪些材料能作为本课依据？", "标注课程资料、泛雅数据和教师上传材料的使用边界。"),
  ], ["authenticity", "alignment"]),
  makeTrainingStepRubric(2, "学情分析与学习起点诊断", "阶段一：课前教学设计与准备", "学习起点诊断质量", "评价教师是否能基于平台数据、作业表现和课堂经验判断学生进入本课的真实起点。", [
    rubricDimension("prior_learning_diagnosis", "先备学习诊断", "是否判断学生已有知识、能力基础和前序课程经验。", "学生进入本课前已经会什么、不会什么？", "结合预习、测验或前序作业补充学生学习起点。"),
    rubricDimension("learning_difficulty_prediction", "学习困难预判", "是否识别学生可能出现的概念混淆、证据不足或表达困难。", "教师是否提前识别了高概率学习障碍？", "列出本课最可能出现的 2-3 类学习困难。"),
    rubricDimension("learning_data_use", "学情数据使用度", "是否使用预习、作业、测验、讨论或反馈数据支持判断。", "学情判断是否有平台数据或学生作品依据？", "引用泛雅模拟数据、学生作业样例或课堂观察记录。"),
    rubricDimension("support_need_identification", "支持需求识别", "是否把学情差异转化为分层支架或补救准备。", "不同基础学生需要哪些不同支持？", "为基础薄弱、进阶学生和高风险学生分别设计支持。"),
  ], ["learner", "alignment"]),
  makeTrainingStepRubric(3, "教学目标与预期学习成果设计", "阶段一：课前教学设计与准备", "预期学习成果诊断", "评价教学目标是否可观察、可评价，并能导向学生的真实学习产出。", [
    rubricDimension("outcome_alignment", "成果导向一致性", "是否从课程目标推导出本课预期学习成果。", "学习成果是否能回应课程目标和专业能力要求？", "用 OBE 方式写清学生学完后能完成什么。"),
    rubricDimension("observable_behavior", "可观察行为清晰度", "是否使用分析、判断、论证、设计等可观察行为动词。", "目标是否能被课堂产出或作业表现观察到？", "把“理解”类目标改写为可观察的学习行为。"),
    rubricDimension("assessment_match", "评价匹配度", "是否为每个目标配置对应的学生产出和评价证据。", "目标和评价任务是否一一对应？", "为每个目标匹配作业、展示、测验或评价量规证据。"),
    rubricDimension("higher_order_goal_balance", "高阶目标比例", "是否包含应用、分析、评价或创造层面的高阶目标。", "本课是否不只停留在记忆和理解？", "至少加入一个需要证据判断或方案选择的目标。"),
  ], ["alignment", "engagement", "assessment"]),
  makeTrainingStepRubric(4, "教学内容重构与核心概念提炼", "阶段一：课前教学设计与准备", "内容重构质量诊断", "评价教师是否能将教材内容重构为适合课堂学习的问题链、概念链和任务链。", [
    rubricDimension("core_concept_extraction", "核心概念提炼度", "是否提炼出本课必须讲清的核心概念和判断规则。", "本课真正需要学生掌握的关键概念是什么？", "压缩背景信息，突出核心概念、判断标准和关键关系。"),
    rubricDimension("difficulty_boundary", "重难点边界清晰度", "是否区分重点、难点和可简化处理的补充内容。", "哪些内容必须深讲，哪些内容可以作为背景？", "标出重点难点，并说明为什么对学生构成困难。"),
    rubricDimension("problem_chain_logic", "问题链逻辑", "是否把内容组织为由浅入深的问题链。", "学生是否能沿着问题链逐步推进理解？", "按“是什么-为什么-依据是什么-如何决策”组织内容。"),
    rubricDimension("cognitive_load_control", "认知负荷控制", "是否避免一次性投放过多概念、案例和材料。", "学生是否会被信息量压垮？", "分阶段释放材料，保留概念解释、案例分析和产出时间。"),
  ], ["alignment", "learner", "engagement"]),
  makeTrainingStepRubric(5, "学习资源与案例材料开发", "阶段一：课前教学设计与准备", "学习资源适配度诊断", "评价教师是否准备了真实、可读、可评价并符合高校课程规范的学习资源。", [
    rubricDimension("resource_relevance", "资源相关性", "资源是否直接服务本课目标、案例任务和评价要求。", "这些材料是否能帮助学生完成本课任务？", "删除与目标无关的材料，保留关键事实和证据。"),
    rubricDimension("case_authenticity", "案例真实性", "案例是否来自真实或高仿真的专业情境。", "案例是否像真实药事管理问题，而不是虚构背景？", "补充政策、机构、服务、合规或管理决策背景。"),
    rubricDimension("student_readability", "学生可读性", "材料是否适合本科生在课前或课堂时间内理解。", "学生能否在给定时间内读懂材料？", "压缩材料长度，增加关键词、图表或结构化提示。"),
    rubricDimension("source_boundary_marking", "来源边界标注", "是否标明材料来源、适用范围和使用限制。", "教师和学生是否知道材料来自哪里、能用到什么程度？", "为每份资源标注来源、授权范围和教师核验要求。"),
  ], ["authenticity", "learner", "assessment"]),
  makeTrainingStepRubric(6, "课前学习支架与预习任务设计", "阶段一：课前教学设计与准备", "课前支架有效性诊断", "评价课前任务是否能帮助学生带着基础、问题和材料进入课堂。", [
    rubricDimension("preview_task_clarity", "预习任务清晰度", "是否明确学生课前要读什么、看什么、提交什么。", "学生是否知道课前任务的具体产出？", "写清预习材料、完成方式、提交要求和截止时间。"),
    rubricDimension("scaffold_fit", "支架适配度", "是否为学生提供导学问题、概念提示或案例阅读框架。", "学生能否借助支架完成预习？", "增加导学单、关键词解释、案例阅读问题或示例。"),
    rubricDimension("platform_task_feasibility", "平台任务可执行性", "任务是否适合在泛雅等平台发布、收集和跟踪。", "平台能否收集学生完成情况和问题？", "把预习任务设计成可发布、可提交、可统计的形式。"),
    rubricDimension("question_collection_value", "问题收集价值", "是否能收集学生课前疑问并反向调整课堂。", "预习是否能帮助教师知道学生卡在哪里？", "设置开放问题或困惑收集，课中回应共性问题。"),
  ], ["learner", "alignment", "reflection"]),
  makeTrainingStepRubric(7, "诊断性评价与学习问题收集", "阶段一：课前教学设计与准备", "诊断性评价质量", "评价课前诊断是否能有效识别学生学习起点、误区和课堂调控依据。", [
    rubricDimension("diagnostic_focus", "诊断目标聚焦度", "诊断任务是否聚焦本课关键概念、前置知识和高风险误区。", "诊断是否测到了课堂真正需要的起点信息？", "围绕核心概念、案例判断和证据使用设计诊断题。"),
    rubricDimension("diagnostic_method_feasibility", "诊断方式可执行性", "诊断方式是否适合高校课堂时间和平台操作。", "教师能否在课前快速收集并解读结果？", "使用少量高价值题目、在线小测或简短问卷。"),
    rubricDimension("student_problem_visibility", "学生问题可见度", "诊断是否能暴露学生的具体错误类型和疑问。", "教师是否能看到学生为什么错？", "增加理由说明、开放题或错误选项归因。"),
    rubricDimension("teaching_adjustment_link", "教学调整关联度", "诊断结果是否能反向影响课堂重点和活动安排。", "诊断结果会改变教师怎么教吗？", "写明不同诊断结果对应的讲解、分组或支架调整。"),
  ], ["learner", "assessment", "alignment"]),
  makeTrainingStepRubric(8, "教学过程、活动序列与评价量规设计", "阶段一：课前教学设计与准备", "教学闭环设计诊断", "评价课前是否形成目标、活动、评价、时间和证据之间的完整教学闭环。", [
    rubricDimension("activity_sequence_logic", "活动序列逻辑", "活动是否从导入、讲解、探究、展示、评价逐步展开。", "课堂活动是否有清晰先后关系？", "按学习发生顺序组织活动，而不是罗列环节。"),
    rubricDimension("time_structure_fit", "时间结构适配度", "时间分配是否符合高校课堂课时和学生认知节奏。", "讲授、活动、展示和反馈的时间是否合理？", "控制讲授比例，为学生任务和反馈留足时间。"),
    rubricDimension("rubric_operationality", "评价量规可操作性", "评价量规是否能让教师直接评价学生表现。", "评分标准是否具体、分层、可观察？", "用明确指标和表现等级替代抽象描述。"),
    rubricDimension("evidence_chain_integrity", "学习证据链完整度", "是否明确每个活动会留下什么学习证据。", "课堂结束后能否判断学生是否学会？", "为提问、讨论、产出、展示和作业配置证据记录。"),
  ], ["alignment", "assessment", "reflection"]),
  makeTrainingStepRubric(9, "问题情境创设与学习动机激发", "阶段二：课中教学实施与调控", "课堂导入有效性诊断", "评价课堂开端是否能以真实问题激发学习动机并指向本课任务。", [
    rubricDimension("problem_situation_authenticity", "问题情境真实性", "导入是否来自真实或高仿真的专业问题。", "学生是否能感到这个问题值得解决？", "用药事管理、政策、服务或机构管理场景启动课堂。"),
    rubricDimension("motivation_activation", "学习动机激发度", "导入是否能激发学生好奇、冲突感或专业责任感。", "学生是否愿意继续参与本课任务？", "加入判断冲突、角色立场或真实数据。"),
    rubricDimension("task_orientation_clarity", "学习任务指向性", "导入是否自然引出本课学习目标和任务产出。", "学生是否知道接下来要解决什么、交付什么？", "在导入后明确本课问题、活动和产出要求。"),
    rubricDimension("student_experience_connection", "学生经验连接度", "导入是否连接学生已有课程经验、实习经验或生活经验。", "学生能否凭已有经验进入讨论？", "增加学生熟悉的药店、医院药房、政策或管理案例。"),
  ], ["authenticity", "engagement", "learner"]),
  makeTrainingStepRubric(10, "先行组织与已有经验激活", "阶段二：课中教学实施与调控", "先行组织质量诊断", "评价教师是否能帮助学生激活已有经验，并建立新旧知识联系。", [
    rubricDimension("advance_organizer_clarity", "先行组织清晰度", "是否提供概念框架、问题框架或任务框架。", "学生是否知道本课知识结构和任务路径？", "用概念图、流程图、问题链或任务单建立学习框架。"),
    rubricDimension("prior_experience_activation", "已有经验激活度", "是否调动学生已有知识、案例经验或平台预习结果。", "课堂是否从学生已经知道的内容出发？", "设置回顾提问、经验分享或预习结果展示。"),
    rubricDimension("misconception_clarification", "误区澄清及时性", "是否及时澄清进入任务前的关键误区。", "学生是否带着错误理解进入活动？", "在活动前澄清概念边界、证据类型和任务规则。"),
    rubricDimension("learning_path_visibility", "学习路径可见度", "是否让学生看见从起点到成果的学习路径。", "学生是否知道如何一步步完成任务？", "说明课堂流程、关键节点和评价方式。"),
  ], ["learner", "alignment", "engagement"]),
  makeTrainingStepRubric(11, "核心概念讲解与认知支架提供", "阶段二：课中教学实施与调控", "概念讲解与支架诊断", "评价核心概念讲解是否准确、通俗，并能支撑学生完成高阶任务。", [
    rubricDimension("concept_accuracy", "概念准确性", "核心概念、判断规则和边界是否讲准确。", "概念是否存在明显误解、混用或边界模糊？", "明确概念定义、适用条件、例子和反例。"),
    rubricDimension("explanation_accessibility", "解释可理解性", "是否能用学生可理解的语言和案例解释抽象概念。", "学生能否用自己的话解释概念？", "使用生活化、专业化兼具的例子降低理解门槛。"),
    rubricDimension("cognitive_scaffold_quality", "认知支架质量", "是否提供思维框架、判断步骤或示范样例。", "学生能否借助支架完成后续任务？", "提供分析模板、证据表、示范答案或判断流程。"),
    rubricDimension("lecture_restraint", "讲授节制性", "讲授是否服务任务而不过度挤占学生活动时间。", "讲授是否压缩了探究、协作和反馈时间？", "把讲授压缩为概念、规则、示例和任务说明。"),
  ], ["alignment", "learner", "engagement"]),
  makeTrainingStepRubric(12, "案例探究与证据分析活动", "阶段二：课中教学实施与调控", "案例探究质量诊断", "评价学生是否能基于案例事实和证据材料开展分析、论证和判断。", [
    rubricDimension("evidence_extraction", "证据提取质量", "学生是否能从案例、政策、数据或平台材料中提取有效证据。", "学生判断是否有明确证据来源？", "要求学生标注事实、数据、角色立场或政策依据。"),
    rubricDimension("analysis_depth", "分析深度", "活动是否推动学生解释原因、比较方案和权衡利弊。", "学生是否只是摘录信息，还是进行了分析？", "增加因果追问、比较任务和决策权衡问题。"),
    rubricDimension("disciplinary_reasoning", "学科推理贴合度", "学生分析是否使用本课程概念和药事管理语境。", "学生是否把案例分析回到课程概念？", "要求学生用课程概念解释证据，而不是泛泛讨论。"),
    rubricDimension("inquiry_process_visibility", "探究过程可见度", "学生分析过程是否能被教师观察、记录和反馈。", "教师是否看得见学生怎么分析？", "使用过程记录表、小组草稿或平台提交记录。"),
  ], ["authenticity", "engagement", "assessment"]),
  makeTrainingStepRubric(13, "协作学习与角色任务推进", "阶段二：课中教学实施与调控", "协作学习质量诊断", "评价小组协作是否有真实任务、合理分工和过程调控。", [
    rubricDimension("collaborative_task_necessity", "协作必要性", "任务是否需要多角色、多证据或多观点协作完成。", "这个任务是否真的需要小组合作？", "设计需要整合证据、协商判断或角色立场的任务。"),
    rubricDimension("role_responsibility_clarity", "角色责任清晰度", "小组角色、职责和交付要求是否明确。", "每个学生是否知道自己承担什么？", "明确记录员、汇报人、证据员、质询员等角色。"),
    rubricDimension("process_guidance", "过程指导有效性", "教师是否在协作过程中提供巡视、提示和调控。", "小组遇到偏题、沉默或争议时教师如何介入？", "设计教师巡回观察点和关键提示语。"),
    rubricDimension("equitable_participation", "参与公平性", "活动是否避免少数学生包办或边缘学生沉默。", "更多学生是否有真实参与机会？", "设置个人准备、小组分工和随机展示机制。"),
  ], ["engagement", "learner", "authenticity"]),
  makeTrainingStepRubric(14, "学习成果展示、课堂对话与追问", "阶段二：课中教学实施与调控", "课堂对话质量诊断", "评价展示和追问是否能促进学生表达、比较、修正和深化理解。", [
    rubricDimension("presentation_requirement_clarity", "展示要求清晰度", "学生是否知道展示什么、怎么展示、依据是什么。", "展示是否有明确结构和评价标准？", "给出展示模板、时间限制和证据要求。"),
    rubricDimension("dialogue_quality", "课堂对话质量", "展示后是否形成师生、生生之间的实质性对话。", "课堂是否只有汇报，没有比较、回应和追问？", "加入同伴质询、观点比较和教师回应。"),
    rubricDimension("probing_depth", "追问深度", "教师追问是否推动学生补充证据、澄清逻辑和修正判断。", "追问是否让学生说明依据和推理？", "设计证据追问、因果追问、反例追问和迁移追问。"),
    rubricDimension("feedback_timing", "反馈及时性", "教师是否能在展示和讨论过程中即时反馈关键问题。", "反馈是否及时帮助学生修正理解？", "在展示后立即指出优点、证据缺口和改进方向。"),
  ], ["engagement", "assessment", "learner"]),
  makeTrainingStepRubric(15, "形成性评价与即时反馈调节", "阶段二：课中教学实施与调控", "课堂形成性评价诊断", "评价教师是否能在课堂过程中持续判断学习状态并即时调整教学。", [
    rubricDimension("formative_checkpoints", "形成性检查点", "课堂是否在关键节点设置学习检查点。", "教师在哪些节点判断学生是否学会？", "在导入、概念讲解、案例分析、展示总结处设置检查。"),
    rubricDimension("feedback_actionability", "反馈可操作性", "反馈是否具体指出问题、依据和修改方向。", "学生听完反馈知道下一步怎么改吗？", "采用“肯定-问题-证据-改进动作”的反馈结构。"),
    rubricDimension("instructional_adjustment", "教学调节有效性", "教师是否根据学生表现调整讲解、活动或时间。", "课堂反馈是否真正改变教学安排？", "预设低正确率、低参与度和时间不足时的调整策略。"),
    rubricDimension("assessment_evidence_capture", "评价证据采集", "形成性评价是否留下可复盘的课堂证据。", "课堂中的判断是否有记录可查？", "记录投票、小测、讨论表现、教师观察和学生产出。"),
  ], ["assessment", "alignment", "reflection"]),
  makeTrainingStepRubric(16, "课堂总结、迁移提升与课后任务衔接", "阶段二：课中教学实施与调控", "课堂收束与迁移诊断", "评价课堂结束是否完成知识整合、迁移提升和课后学习衔接。", [
    rubricDimension("summary_structure", "课堂总结结构性", "总结是否回到核心概念、问题主线和学习目标。", "学生是否能带走清晰的知识结构？", "用要点归纳、概念图或任务成果回扣目标。"),
    rubricDimension("transfer_guidance", "迁移提升引导", "是否引导学生把本课方法迁移到新情境。", "学生是否知道这个方法还能用于哪些问题？", "提供相近案例、延伸问题或职业应用情境。"),
    rubricDimension("post_class_task_connection", "课后任务衔接度", "课后作业是否承接课堂成果并继续深化学习。", "课后任务是否只是重复练习，还是延伸课堂？", "把课堂产出转化为作业、反思或平台任务。"),
    rubricDimension("resource_recommendation_fit", "资源推荐适切性", "是否根据课堂表现推荐补充资源或拓展材料。", "不同学生是否得到适合的后续资源？", "根据薄弱点推荐补救材料、案例和拓展阅读。"),
  ], ["alignment", "learner", "reflection"]),
  makeTrainingStepRubric(17, "学习成果收集与表现性评价", "阶段三：课后评价反馈与持续改进", "表现性评价质量诊断", "评价课后是否能收集学生成果并基于评价量规进行可解释评价。", [
    rubricDimension("learning_product_collection", "学习成果收集完整性", "是否完整收集作业、课堂产出、展示材料和过程记录。", "学生学习成果是否可追踪、可归档？", "整理平台作业、课堂记录、小组产出和展示材料。"),
    rubricDimension("rubric_scoring_validity", "评价量规评分效度", "评分是否依据清晰指标和学生实际表现。", "评分是否能解释学生为什么得分？", "用评价量规对照学生证据逐项评分并记录理由。"),
    rubricDimension("performance_evidence_quality", "表现证据质量", "学生成果是否能证明目标达成程度。", "作业或作品是否体现了本课核心能力？", "保留能体现分析、判断、证据使用和表达的样例。"),
    rubricDimension("grading_feedback_preparation", "批改反馈准备度", "评价结果是否能转化为后续反馈和改进建议。", "评分结果是否能指导学生修改？", "把每个低分维度转化为具体反馈语和改进任务。"),
  ], ["assessment", "alignment", "reflection"]),
  makeTrainingStepRubric(18, "学习数据分析与学习困难诊断", "阶段三：课后评价反馈与持续改进", "课后学习分析诊断", "评价教师是否能用平台数据和学生作品识别班级共性问题与个体差异。", [
    rubricDimension("learning_analytics_use", "学习数据使用度", "是否使用作业、测验、讨论、预习和反馈数据进行分析。", "课后判断是否基于数据而不是印象？", "汇总泛雅模拟数据、作业得分和课堂记录。"),
    rubricDimension("error_pattern_diagnosis", "错误类型诊断", "是否归纳学生常见错误、误区和证据缺口。", "学生到底错在概念、证据、推理还是表达？", "按错误类型分类，并关联对应学习目标。"),
    rubricDimension("group_difference_awareness", "群体差异识别", "是否识别不同学生群体的学习表现差异。", "是否看到了基础薄弱、进阶学生和高风险学生的差异？", "按完成度、得分维度、参与度和问题类型分组分析。"),
    rubricDimension("diagnosis_to_action", "诊断转化度", "分析结果是否能转化为补救教学、反馈或下一次课调整。", "这些数据会带来什么教学动作？", "把数据结论写成补救清单、反馈重点和下轮改进项。"),
  ], ["reflection", "learner", "assessment"]),
  makeTrainingStepRubric(19, "差异化反馈、补救教学与拓展支持", "阶段三：课后评价反馈与持续改进", "反馈与补救支持诊断", "评价教师是否能针对不同学习表现提供具体、可执行的反馈和支持。", [
    rubricDimension("feedback_specificity", "反馈具体性", "反馈是否指出学生具体问题、对应证据和修改方向。", "学生能否知道自己具体哪里需要改？", "指出错误类型、证据缺口、推理问题和下一步动作。"),
    rubricDimension("remedial_teaching_fit", "补救教学适配度", "补救活动是否对应学生真实薄弱点。", "补救是否针对问题，而不是统一重复讲解？", "为共性错误设计微课、练习、案例重做或面批。"),
    rubricDimension("extension_support_value", "拓展支持价值", "是否为学有余力学生提供更高阶任务。", "进阶学生是否有继续挑战的路径？", "提供拓展案例、开放问题、项目任务或资料阅读。"),
    rubricDimension("feedback_delivery_feasibility", "反馈实施可行性", "反馈方式是否符合高校课堂规模和平台条件。", "教师能否在真实班级规模下完成反馈？", "组合使用批量反馈、个性化批注、小组反馈和平台消息。"),
  ], ["learner", "assessment", "reflection"]),
  makeTrainingStepRubric(20, "教学反思、资源沉淀与持续改进", "阶段三：课后评价反馈与持续改进", "教学改进闭环诊断", "评价本轮教学是否能形成反思、资产沉淀和下一轮课程优化。", [
    rubricDimension("reflective_teaching_depth", "教学反思深度", "是否基于目标、活动、评价和学习数据进行反思。", "反思是否超越“课堂顺利/不顺利”的主观描述？", "按目标达成、活动质量、评价证据和学生困难进行反思。"),
    rubricDimension("asset_deposition_value", "资源沉淀价值", "是否把教案、案例、评价量规、反馈语和学生样例沉淀为资产。", "哪些内容能复用于下一轮教学？", "将可复用材料保存到教学资产并标注来源边界。"),
    rubricDimension("iteration_plan_feasibility", "迭代计划可执行性", "是否形成具体、可验证的下一轮改进措施。", "下一次课或下一轮教学具体改什么？", "写出负责人、材料、时间、评价方式和预期变化。"),
    rubricDimension("data_review_continuity", "数据复盘连续性", "是否把本次数据与后续教学改进连接起来。", "本次数据会不会进入下一轮学情分析？", "把低分维度、学生反馈和平台数据纳入下一轮课前诊断。"),
  ], ["reflection", "assessment", "alignment"]),
];

let trainingState = null;
let fanyaAuthState = null;
let practiceWorkflowState = null;
let currentAssetStore = null;
let pendingUploadFiles = [];
let assetGraphState = null;
let selectedAssetId = "";
const assetFilterState = {
  source: "全部",
  type: "全部",
  status: "全部",
  query: "",
};

const ASSET_SOURCE_FILTERS = ["全部", "教学导航", "教学实践", "教师上传", "泛雅同步"];
const ASSET_TYPE_FILTERS = ["全部", "课程画像", "教学设计方案", "课堂活动脚本", "案例材料", "评价量规", "学习证据", "教学复盘", "来源边界", "其他"];
const ASSET_STATUS_FILTERS = ["全部", "待核验", "可复用", "已用于实践", "需更新"];

attachTrainingOptionScoring();

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function loadFromLocalStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`无法读取 ${key}`, error);
    return fallback;
  }
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getOptionLabel(option) {
  if (!option) return "";
  if (typeof option === "string") return option;
  return option.title || option.label || "";
}

function getStepOption(stepId, optionId) {
  const rubric = TRAINING_STEP_RUBRICS.find((item) => item.stepId === Number(stepId));
  return rubric?.options?.find((option) => option.id === optionId) || null;
}

function getStepRubric(stepId) {
  return getTrainingStepRubric(stepId);
}

function getSelectedOption(stepId) {
  const id = String(stepId);
  const selectedOptionId =
    trainingState?.currentSelections?.[id] ||
    trainingState?.stepResults?.[id]?.selectedOptionId ||
    trainingState?.choices?.[id]?.primary;
  if (!selectedOptionId) return null;
  return getStepOption(stepId, selectedOptionId);
}

function attachTrainingOptionScoring() {
  TRAINING_STEP_RUBRICS.forEach((rubric) => {
    const step = trainingSteps.find((item) => item.id === rubric.stepId);
    if (!step) return;
    rubric.options = Object.entries(step.options).map(([id, label]) =>
      createScoredTrainingOption(step, rubric, id, label),
    );
    dedupeOptionScores(rubric);
  });
}

function dedupeOptionScores(rubric) {
  const seen = new Map();
  rubric.options.forEach((option, optionIndex) => {
    let signature = Object.values(option.dimensionScores).join("|");
    if (!seen.has(signature)) {
      seen.set(signature, option.id);
      return;
    }
    const dimension = rubric.dimensions[optionIndex % rubric.dimensions.length] || rubric.dimensions[0];
    const direction = optionIndex % 2 === 0 ? 0.12 : -0.12;
    option.dimensionScores[dimension.key] = normalizeAcademicScore(Number(option.dimensionScores[dimension.key] || 0) + direction);
    option.dimensionRationales[dimension.key] = buildOptionDimensionRationale(
      option.title,
      dimension,
      option.dimensionScores[dimension.key],
    );
    const dimensions = buildScoredDimensions(rubric, option);
    const lowest = getLowestDimension(dimensions);
    const highest = getHighestDimension(dimensions);
    option.overallDiagnosis = `选择“${option.title}”后，本环节的相对优势是“${highest?.label || "待判断"}”，主要短板是“${lowest?.label || "待判断"}”。`;
    option.improvementAdvice = lowest?.improvementHint || option.improvementAdvice;
    signature = Object.values(option.dimensionScores).join("|");
    seen.set(signature, option.id);
  });
}

function createScoredTrainingOption(step, rubric, id, label) {
  const dimensionScores = buildOptionLevelDimensionScores(step, rubric, id, label);
  const dimensionRationales = Object.fromEntries(
    rubric.dimensions.map((dimension) => [
      dimension.key,
      buildOptionDimensionRationale(label, dimension, dimensionScores[dimension.key]),
    ]),
  );
  const dimensions = buildScoredDimensions(rubric, { dimensionScores, dimensionRationales });
  const lowest = getLowestDimension(dimensions);
  const highest = getHighestDimension(dimensions);
  return {
    id,
    title: label,
    label,
    description: optionDescription(step, id, label),
    template: `建议在“${step.title}”环节采用“${label}”，并围绕${defaultTrainingCourse.scenario}写清学生产出、证据来源和教师追问。`,
    rationale: buildOptionRationale(step, label, highest, lowest),
    dimensionScores,
    dimensionRationales,
    overallDiagnosis: `选择“${label}”后，本环节的相对优势是“${highest?.label || "待判断"}”，主要短板是“${lowest?.label || "待判断"}”。`,
    improvementAdvice: lowest?.improvementHint || "补充本环节与真实药事管理任务、学生产出和评价证据的对应关系。",
  };
}

function buildOptionLevelDimensionScores(step, rubric, optionId, label) {
  const special = getSpecialOptionScores(step.id, optionId, rubric);
  if (special) return special;
  const profile = getOptionQualityProfile(label);
  const optionOffset = { A: -0.05, B: 0.08, C: 0.14, D: 0.04, E: 0.12, F: 0.02 }[optionId] || 0;
  const optionVector = {
    A: [-0.04, 0.02, -0.02, 0.03],
    B: [0.03, -0.01, 0.04, -0.02],
    C: [0.05, 0.03, -0.01, 0.02],
    D: [-0.01, 0.05, 0.02, -0.03],
    E: [0.02, -0.04, 0.03, 0.05],
    F: [0.06, -0.03, 0.05, -0.01],
  }[optionId] || [0, 0, 0, 0];
  return Object.fromEntries(
    rubric.dimensions.map((dimension, index) => {
      const text = `${dimension.label} ${dimension.description} ${dimension.evidenceQuestion}`;
      let score = profile.base + optionOffset + optionVector[index] + ((index % 2 === 0 ? 0.08 : -0.06) + index * 0.03);
      if (profile.keywords.some((keyword) => text.includes(keyword))) score += 0.32;
      if (/真实|情境|案例|药事|证据|专业|问题|角色|冲突/.test(text) && profile.authentic) score += 0.24;
      if (/目标|产出|评价|评价量规|证据|对应|可测量|可收集/.test(text) && profile.alignment) score += 0.22;
      if (/学生|学习者|差异|支架|误区|先备|支持|参与/.test(text) && profile.learner) score += 0.24;
      if (/高阶|分析|评价|决策|探究|协作|讨论|追问|创造/.test(text) && profile.engagement) score += 0.2;
      if (/讲授|记忆|纸笔|课件/.test(label) && /高阶|真实|证据|产出|复盘|协作/.test(text)) score -= 0.35;
      if (/开放|综合|同行|研究/.test(label) && /新教师|可执行|时间|负荷|范围/.test(text)) score -= 0.18;
      return [dimension.key, normalizeAcademicScore(score)];
    }),
  );
}

function getSpecialOptionScores(stepId, optionId, rubric) {
  if (Number(stepId) !== 1) return null;
  const presets = {
    A: [1.5, 1.7, 1.4, 1.8],
    B: [3.1, 3.2, 2.8, 3.2],
    C: [3.0, 3.4, 3.3, 3.7],
    D: [2.9, 3.1, 3.2, 3.3],
    E: [3.8, 3.7, 3.6, 3.6],
    F: [3.1, 3.0, 2.7, 3.0],
  };
  const values = presets[optionId];
  if (!values) return null;
  return Object.fromEntries(rubric.dimensions.map((dimension, index) => [dimension.key, values[index]]));
}

function getOptionQualityProfile(label) {
  const profile = {
    base: 2.55,
    keywords: [],
    authentic: false,
    alignment: false,
    learner: false,
    engagement: false,
  };
  const add = (points, keywords, flags = {}) => {
    profile.base += points;
    profile.keywords.push(...keywords);
    Object.assign(profile, flags);
  };
  if (/知识|记忆|讲授|课件|纸笔|注意力|纪律/.test(label)) {
    add(-0.7, ["概念", "知识", "流程"], { alignment: false });
  }
  if (/案例|情境|慢病|政策|监管|经营|服务/.test(label)) {
    add(0.45, ["真实", "情境", "案例", "证据", "问题", "药事"], { authentic: true, engagement: true });
  }
  if (/项目|任务|成果|产出|矩阵|作业|文档|模板|证据表/.test(label)) {
    add(0.38, ["产出", "任务", "证据", "目标", "评价", "可收集"], { alignment: true, engagement: true });
  }
  if (/能力|应用|操作|评价|判断|分析|深度|表现/.test(label)) {
    add(0.34, ["目标", "高阶", "分析", "评价", "决策", "证据"], { alignment: true, engagement: true });
  }
  if (/探究|问题|讨论|小组|协作|互评|展示|角色/.test(label)) {
    add(0.22, ["问题", "参与", "协作", "追问", "角色"], { engagement: true, learner: true });
  }
  if (/分层|支持|反馈|过程|概念解释|学习日志|个性化/.test(label)) {
    add(0.28, ["学生", "学习者", "支架", "误区", "反馈", "支持"], { learner: true, alignment: true });
  }
  if (/量规|评价量规|评价|评分|证据|测验|答辩/.test(label)) {
    add(0.25, ["评价", "评价量规", "证据", "指标", "反馈"], { alignment: true });
  }
  if (/数据|复盘|优化|反思|同行|课堂观察/.test(label)) {
    add(0.2, ["数据", "复盘", "改进", "资产", "反馈"], { alignment: true });
  }
  if (/综合|研究|开放|创造/.test(label)) {
    add(0.05, ["综合", "创造", "迁移"], { engagement: true });
  }
  profile.base = clamp(profile.base, 1.0, 3.55);
  return profile;
}

function buildOptionDimensionRationale(label, dimension, score) {
  const level = getScoreLevel(score);
  if (score < 1.5) return `“${label}”暂未充分回应“${dimension.label}”，关键证据和教学展开线索不足，当前处于${level}。`;
  if (score < 2.5) return `“${label}”能提供基本方向，但对“${dimension.label}”的证据、边界或可执行路径仍偏笼统，当前为${level}。`;
  if (score < 3.5) return `“${label}”较好回应了“${dimension.label}”，已能支撑新教师开展本环节设计，当前为${level}。`;
  return `“${label}”能清晰支撑“${dimension.label}”，并能自然连接真实任务、学生产出和后续评价，当前为${level}。`;
}

function buildOptionRationale(step, label, highest, lowest) {
  return `“${label}”用于“${step.title}”时，优势集中在“${highest?.label || "待判断"}”，但仍需补强“${lowest?.label || "待判断"}”，避免方案停留在口号或活动名称。`;
}

function buildScoredDimensions(stepRubric, selectedOption) {
  return stepRubric.dimensions.map((dimension, index) => {
    const rawScore = selectedOption?.dimensionScores?.[dimension.key];
    const hasScore = Number.isFinite(Number(rawScore));
    const theorySource = dimension.theorySource || inferDimensionTheorySource(dimension);
    const scoringAnchors = dimension.scoringAnchors || buildGenericScoringAnchors(dimension);
    return {
      ...dimension,
      index: index + 1,
      theorySource,
      scoringAnchors,
      score: hasScore ? normalizeAcademicScore(rawScore) : null,
      scoreLabel: hasScore ? getScoreLevel(rawScore) : "待评分",
      rationale:
        selectedOption?.dimensionRationales?.[dimension.key] ||
        "尚未选择方案，暂无该维度的评分理由。",
      explanation:
        selectedOption?.dimensionRationales?.[dimension.key] ||
        "尚未选择方案，暂无该维度的评分理由。",
      improvement: dimension.improvementHint,
      shortLabel: dimension.shortLabel || dimension.label,
    };
  });
}

function createStepPreview(stepId, optionId, mode = "training", importedContext = null) {
  const baseStep = getTrainingStep(stepId);
  const trainingContext = mode === "training" ? getTrainingCourseContext() : null;
  const step =
    mode === "practice" && importedContext
      ? getPracticeStep(baseStep, importedContext)
      : mode === "training"
        ? getContextualTrainingStep(baseStep, trainingContext)
        : baseStep;
  const baseRubric = getTrainingStepRubric(stepId);
  const rubric = mode === "practice" && importedContext ? getPracticeRubric(baseRubric, importedContext) : baseRubric;
  const baseSelectedOption = getStepOption(stepId, optionId);
  const selectedOption =
    mode === "practice" && baseSelectedOption
      ? {
          ...baseSelectedOption,
          template: contextualizePracticeText(baseSelectedOption.template, importedContext),
          rationale: contextualizePracticeText(baseSelectedOption.rationale, importedContext),
          dimensionRationales: contextualizePracticeValue(baseSelectedOption.dimensionRationales || {}, importedContext),
          overallDiagnosis: contextualizePracticeText(baseSelectedOption.overallDiagnosis, importedContext),
          improvementAdvice: contextualizePracticeText(baseSelectedOption.improvementAdvice, importedContext),
          title: getOptionLabel(step.options[optionId]) || baseSelectedOption.title,
          label: getOptionLabel(step.options[optionId]) || baseSelectedOption.label,
          description: optionDescription(step, optionId, getOptionLabel(step.options[optionId]) || baseSelectedOption.title),
        }
      : mode === "training" && baseSelectedOption
        ? {
            ...baseSelectedOption,
            template: contextualizeTrainingText(baseSelectedOption.template, trainingContext),
            rationale: contextualizeTrainingText(baseSelectedOption.rationale, trainingContext),
            dimensionRationales: contextualizeTrainingValue(baseSelectedOption.dimensionRationales || {}, trainingContext),
            overallDiagnosis: contextualizeTrainingText(baseSelectedOption.overallDiagnosis, trainingContext),
            improvementAdvice: contextualizeTrainingText(baseSelectedOption.improvementAdvice, trainingContext),
            title: getOptionLabel(step.options[optionId]) || contextualizeTrainingText(baseSelectedOption.title, trainingContext),
            label: getOptionLabel(step.options[optionId]) || contextualizeTrainingText(baseSelectedOption.label, trainingContext),
            description: optionDescription(step, optionId, getOptionLabel(step.options[optionId]) || baseSelectedOption.title),
          }
      : baseSelectedOption;
  let dimensions = buildScoredDimensions(rubric, selectedOption);
  if (mode === "practice" && selectedOption && importedContext) {
    dimensions = enhancePracticeScoredDimensions(step, dimensions, selectedOption, importedContext);
  }
  const scored = dimensions.filter((dimension) => Number.isFinite(Number(dimension.score)));
  const stepScore = scored.length ? calculateStepScore(scored) : 0;
  const lowestDimension = scored.length ? getLowestDimension(scored) : null;
  const highestDimension = scored.length ? getHighestDimension(scored) : null;
  const primaryLabel = selectedOption?.title || "";
  const score = {
    type: "step-rubric",
    pending: !selectedOption,
    stepId: step.id,
    title: rubric.title,
    phase: rubric.phase,
    assessmentTitle: rubric.assessmentTitle,
    assessmentFocus: rubric.assessmentFocus,
    metricLabel: mode === "practice" ? "数据增强环节成熟度" : "环节成熟度",
    total: stepScore,
    grade: selectedOption ? getScoreLevel(stepScore) : "待评分",
    dimensions,
    finalDimensionMapping: rubric.finalDimensionMapping,
    highestDimension,
    lowestDimension,
    improvements: selectedOption
      ? [selectedOption.improvementAdvice || lowestDimension?.improvementHint].filter(Boolean)
      : ["请选择一个主方案后，系统会生成低分维度诊断和改进建议。"],
    needsReview: selectedOption ? scored.some((dimension) => Number(dimension.score) < 2.5) || stepScore < 2.5 : false,
    diagnosis: selectedOption?.overallDiagnosis || "请选择一个方案后生成诊断。",
    improvementAdvice: selectedOption?.improvementAdvice || lowestDimension?.improvementHint || "请选择一个方案后生成改进建议。",
    selectedOption,
  };
  const secondaryLabels = mode === "practice"
    ? (practiceWorkflowState?.choices?.[String(step.id)]?.secondary || []).map((id) => getOptionLabel(step.options[id])).filter(Boolean)
    : (trainingState?.choices?.[String(step.id)]?.secondary || []).map((id) => getOptionLabel(step.options[id])).filter(Boolean);
  const analysis = selectedOption
    ? createOptionDrivenAnalysis(step, selectedOption, score, mode, importedContext, secondaryLabels)
    : {
        retainAdvice: "请选择一个主方案后，系统将基于当前方案更新本环节成熟度。",
        nextReminder: "当前显示为评价量规预览态。",
        strengths: [],
        risks: [],
        suggestions: [],
      };
  const fragment = selectedOption
    ? mode === "practice"
      ? generatePracticeFragment(step, primaryLabel, secondaryLabels, importedContext)
      : generateTrainingFragment(step, primaryLabel, secondaryLabels)
    : "";
  return {
    stepId: step.id,
    selectedOptionId: optionId || "",
    selectedOption,
    dimensions,
    stepScore,
    level: selectedOption ? getScoreLevel(stepScore) : "待评分",
    lowestDimension,
    highestDimension,
    diagnosis: score.diagnosis,
    improvementAdvice: score.improvementAdvice,
    score,
    analysis,
    fragment,
    template: selectedOption
      ? mode === "practice"
        ? generatePracticeExcellentTemplate(step, primaryLabel, secondaryLabels, importedContext)
        : generateExcellentTemplate(step, primaryLabel, secondaryLabels)
      : null,
  };
}

function createOptionDrivenAnalysis(step, selectedOption, score, mode = "training", importedContext = null, secondaryLabels = []) {
  const lowest = score.lowestDimension;
  const highest = score.highestDimension;
  const next = trainingSteps.find((item) => item.id === step.id + 1);
  const context = getTrainingCourseContext();
  const contextText = mode === "practice" && importedContext
    ? `${importedContext.className}的泛雅模拟导入数据`
    : `${context.scenario}`;
  return {
    strengths: [
      `当前选择“${selectedOption.title}”，最高维度为“${highest?.label || "待判断"}”，说明该方案在本环节有明确优势。`,
      `方案已被放入${contextText}中进行判断，而不是沿用默认评价量规分数。`,
      secondaryLabels.length ? `辅助方案“${secondaryLabels.join("、")}”可作为后续文本生成支撑，但本次成熟度主评分来自主方案。` : "本次成熟度评分来自当前主方案。",
    ],
    risks: [
      lowest ? `最低维度为“${lowest.label}”，需要优先补充证据或执行路径。` : "尚未形成低分维度。",
      score.needsReview ? "存在低于 2.5 的维度，建议确认前先复查。" : "当前没有明显低分维度，但仍需在后续环节核验一致性。",
    ],
    suggestions: [selectedOption.improvementAdvice || lowest?.improvementHint || "继续检查方案与学生产出、评价证据之间的关系。"],
    nextReminder: next ? `下一环节是“${next.title}”，请继续检查本环节决策如何影响后续设计。` : "已经到达最后一个环节，请生成报告并保存到教学资产。",
    retainAdvice: score.total >= 2.5 ? "建议保留当前选择。" : "建议复查当前选择，先补强低分维度再确认。",
  };
}

function enhancePracticeScoredDimensions(step, dimensions, selectedOption, importedContext) {
  const label = selectedOption.title || "";
  const learnerText = importedContext.learnerProfile.commonDifficulties.join("、");
  const weakText = importedContext.assignmentProfile.weakPoints.join("、");
  const misconceptionText = importedContext.learningAnalytics.commonMisconceptions.join("、");
  const has = (patterns) => patterns.some((pattern) => label.includes(pattern));
  return dimensions.map((dimension) => {
    let delta = 0;
    const text = `${dimension.label} ${dimension.description}`;
    const reasons = [];
    if (/学生|学习者|差异|支架|误区|支持|先备/.test(text)) {
      if (importedContext.learnerProfile.priorKnowledgeLevel.includes("差异") || importedContext.learningAnalytics.previewCompletionRate < 70) {
        delta += has(["分层", "支持", "过程指导", "概念解释", "案例分析框架", "课前学习"]) ? 0.35 : -0.16;
        reasons.push("已结合预习完成率、基础差异和常见困难修正学习者适配分。");
      }
    }
    if (/真实|情境|案例|药事|证据|问题/.test(text)) {
      if (importedContext.resourceProfile.caseCount > 0) {
        delta += has(["案例", "SWOT 课堂案例材料", "案例问题逻辑", "案例分析任务"]) ? 0.32 : 0.08;
        reasons.push("课程资源中已有案例材料，提升真实情境适配度。");
      }
      if (importedContext.resourceProfile.missingResources.includes("课堂案例证据表") && has(["项目", "调研", "数据"])) {
        delta -= 0.16;
        reasons.push("缺少课堂案例证据表，资源可行性存在扣分。");
      }
    }
    if (/评价|证据|评价量规|反馈|产出|目标/.test(text)) {
      if (weakText.includes("证据引用不足") || learnerText.includes("证据") || misconceptionText.includes("证据来源")) {
        delta += has(["证据", "过程性评价", "学习过程文档", "任务成果评价", "分析深度标准", "矩阵成果评价", "评价量规"]) ? 0.34 : -0.18;
        reasons.push("作业薄弱点集中在证据引用，已对评价证据维度进行数据增强。");
      }
    }
    if (/参与|协作|讨论|追问|反馈|节奏/.test(text)) {
      if (importedContext.learningAnalytics.discussionParticipation < 60) {
        delta += has(["讨论", "小组", "协作", "即时", "教师反馈", "追问"]) ? 0.28 : -0.12;
        reasons.push("讨论参与率偏低，互动与反馈类方案获得额外加权。");
      }
    }
    const score = normalizeAcademicScore(Number(dimension.score || 0) + delta);
    const dataReason = reasons.length ? ` 数据增强：${reasons.join("；")}` : " 数据增强：当前方案与导入数据无明显额外加权。";
    return {
      ...dimension,
      score,
      scoreLabel: getScoreLevel(score),
      rationale: `${dimension.rationale || dimension.explanation || ""}${dataReason}`,
      explanation: `${dimension.explanation || dimension.rationale || ""}${dataReason}`,
    };
  });
}

function createConfirmedTrainingStepResult(stepId, optionId) {
  const preview = createStepPreview(stepId, optionId, "training");
  if (!preview.selectedOption) return null;
  const step = getContextualTrainingStep(getTrainingStep(stepId));
  return {
    stepId: Number(stepId),
    selectedOptionId: optionId,
    selectedOptionTitle: preview.selectedOption.title,
    optionTitle: preview.selectedOption.title,
    dimensions: preview.dimensions,
    dimensionScores: Object.fromEntries(preview.dimensions.map((item) => [item.key, item.score])),
    stepScore: preview.stepScore,
    score: preview.stepScore,
    level: preview.level,
    lowestDimension: preview.lowestDimension,
    highestDimension: preview.highestDimension,
    diagnosis: preview.diagnosis,
    improvementAdvice: preview.improvementAdvice,
    fragment: preview.fragment,
    title: getTrainingStepRubric(stepId).title,
    workflowTitle: step.title,
    phase: getTrainingStepRubric(stepId).phase,
    assessmentTitle: getTrainingStepRubric(stepId).assessmentTitle,
    assessmentFocus: getTrainingStepRubric(stepId).assessmentFocus,
    finalDimensionMapping: getTrainingStepRubric(stepId).finalDimensionMapping,
    completed: true,
    needsReview: preview.stepScore < 2.5 || preview.dimensions.some((dimension) => Number(dimension.score) < 2.5),
    confirmedAt: new Date().toISOString(),
  };
}

function createConfirmedPracticeStepResult(stepId, optionId) {
  const context = practiceWorkflowState?.importedContext;
  const preview = createStepPreview(stepId, optionId, "practice", context);
  if (!preview.selectedOption) return null;
  const step = getTrainingStep(stepId);
  const rubric = getTrainingStepRubric(stepId);
  return {
    stepId: Number(stepId),
    selectedOptionId: optionId,
    selectedOptionTitle: preview.selectedOption.title,
    optionTitle: preview.selectedOption.title,
    dimensions: preview.dimensions,
    dimensionScores: Object.fromEntries(preview.dimensions.map((item) => [item.key, item.score])),
    stepScore: preview.stepScore,
    score: preview.stepScore,
    level: preview.level,
    lowestDimension: preview.lowestDimension,
    highestDimension: preview.highestDimension,
    diagnosis: preview.diagnosis,
    improvementAdvice: preview.improvementAdvice,
    fragment: preview.fragment,
    title: rubric.title,
    workflowTitle: step.title,
    phase: rubric.phase,
    assessmentTitle: rubric.assessmentTitle,
    assessmentFocus: rubric.assessmentFocus,
    finalDimensionMapping: rubric.finalDimensionMapping,
    completed: true,
    needsReview: preview.stepScore < 2.5 || preview.dimensions.some((dimension) => Number(dimension.score) < 2.5),
    confirmedAt: new Date().toISOString(),
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatDate(value) {
  return new Date(value || Date.now()).toLocaleString("zh-CN", { hour12: false });
}

function maskFanyaAccount(account = "") {
  const value = account.trim();
  if (!value) return "测试账号";
  if (/^\d{7,}$/.test(value)) return `${value.slice(0, 3)}****${value.slice(-4)}`;
  if (value.includes("@")) {
    const [local, domain] = value.split("@");
    const safeLocal = local.length <= 2 ? `${local.slice(0, 1)}*` : `${local.slice(0, 2)}***${local.slice(-1)}`;
    return `${safeLocal}@${domain}`;
  }
  if (value.length <= 4) return `${value.slice(0, 1)}***`;
  return `${value.slice(0, 2)}***${value.slice(-2)}`;
}

function makeTeacherNameFromAccount(account = "") {
  const value = account.trim();
  if (!value) return FANYA_MOCK_ACCOUNT.teacherName;
  const digits = value.replace(/\D/g, "");
  if (digits.length >= 4) return `测试教师 ${digits.slice(-4)}`;
  const label = value.includes("@") ? value.split("@")[0] : value;
  return `${label.replace(/[._-]+/g, " ").slice(0, 12)} 教师`;
}

function makeMockFanyaSession(account = "") {
  const seed = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const accountPart = account.trim() ? maskFanyaAccount(account).replace(/[^\w]+/g, "-").slice(0, 18) : "demo";
  return {
    id: `mock-fanya-session-${seed}`,
    tokenPreview: `mock-fanya-token-${accountPart}-${seed.slice(-6)}`,
  };
}

function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function parseTags(value = "") {
  return value
    .split(/[,，、\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text || "");
    showToast("已复制到剪贴板");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text || "";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast("已复制到剪贴板");
  }
}

function downloadMarkdown(filename, text) {
  const blob = new Blob([text || ""], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function showToast(message) {
  $(".toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2200);
}

function initGlobalNav() {
  const button = $("#navMenuToggle");
  const nav = $("#primaryNav");
  if (button && nav) {
    button.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    $$(".nav-link", nav).forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        button.setAttribute("aria-expanded", "false");
      });
    });
  }
  setActiveNav();
}

function initTheoryAnchorToggles() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-theory-anchor-toggle]");
    if (!trigger) return;
    const panel = trigger.closest(".step-diagnostic-panel")?.querySelector(".theory-anchor-panel");
    if (!panel) return;
    panel.open = true;
    if (document.body.dataset.page === "teaching-navigation") return;
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function setActiveNav() {
  const page = document.body.dataset.page;
  $$(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.nav === page));
}

const HOME_FEATURE_DEMOS = {
  navigation: {
    label: "教学导航",
    short: "新手教师训练营",
    kicker: "从目标到训练路径",
    summary: "左侧输入课程目标与教师条件，右侧生成三阶段、20 环节的新手教师训练路线。",
    prompt:
      "我是一名新入职教师，需要准备《管理学原理》中的 SWOT 分析教学单元。请根据课程目标，生成一条可执行的 20 环节教学训练路线。",
    attachments: [
      { title: "课程大纲", meta: "管理学原理 · SWOT 单元", accent: "amber" },
      { title: "教师画像", meta: "首轮授课 / 缺少课堂经验", accent: "stone" },
      { title: "教学目标", meta: "理解 SWOT · 完成案例分析", accent: "teal" },
    ],
    activity: [
      "解析课程目标与教学边界",
      "拆解知识点、能力点与易错点",
      "匹配新手教师 20 环节训练路径",
      "生成课前、课中、课后导航路线",
    ],
    outputTitle: "新手教师 20 环节训练路线",
    outputSubtitle: "将备课、活动、评价与复盘拆解为可执行路径",
  },
  practice: {
    label: "教学实践",
    short: "真实课程工作台",
    kicker: "从学情到课堂执行",
    summary: "左侧输入模拟学情和课堂证据，右侧形成活动、追问、测验和评价量规草稿。",
    prompt:
      "根据本周学生预习、随堂测和课堂反馈情况，帮我优化 SWOT 分析这节课的教学活动，并生成形成性评价方案。",
    attachments: [
      { title: "学情摘要", meta: "预习完成率 72% · 易错点集中", accent: "blue" },
      { title: "课堂证据", meta: "提问记录 · 小组讨论结果", accent: "amber" },
      { title: "评价需求", meta: "随堂测 / 小组任务 / 评价量规", accent: "teal" },
    ],
    activity: [
      "读取学情摘要与课堂证据",
      "识别机会与威胁混淆等薄弱点",
      "转化为药学管理案例与追问提示",
      "生成课堂活动、随堂测与评价量规",
    ],
    outputTitle: "SWOT 分析授课工作台",
    outputSubtitle: "把学情诊断转化为课堂活动与形成性评价",
  },
  assets: {
    label: "教学资产",
    short: "课程资产库",
    kicker: "从产物到可复用资产",
    summary: "左侧输入教学产物和复盘记录，右侧整理下一轮授课可复用的资产库。",
    prompt:
      "请将本次 SWOT 教学单元的教案、活动设计、评价任务和课后反思归档，并整理成下一轮授课可复用的教学资产。",
    attachments: [
      { title: "教学设计", meta: "教案 · 活动单 · 案例材料", accent: "amber" },
      { title: "评价材料", meta: "随堂测 · 小组任务评价量规", accent: "teal" },
      { title: "复盘记录", meta: "课堂证据 · 教师反思", accent: "blue" },
    ],
    activity: [
      "提取教案、活动、评价与复盘产物",
      "自动分类、打标签并关联知识点",
      "识别可复用模板与待改进环节",
      "更新教学资产库与下一轮建议",
    ],
    outputTitle: "SWOT 单元教学资产库",
    outputSubtitle: "沉淀教案、案例、评价与复盘，支持下一轮迭代",
  },
};

const HOME_FEATURE_KEYS = ["navigation", "practice", "assets"];
const HOME_TASK_TARGETS = {
  practice: {
    label: "教学实践",
    page: "practice",
    href: "./practice.html",
  },
  assets: {
    label: "教学资产",
    page: "assets",
    href: "./assets.html",
  },
};

function getHomeFeatureDemo(featureKey) {
  return HOME_FEATURE_DEMOS[featureKey] || HOME_FEATURE_DEMOS.navigation;
}

function inferHomeTaskTarget(text = "") {
  const content = String(text).trim();
  if (/资产|沉淀|复用|归档|资源库|模板库|案例库|历史|整理/.test(content)) return "assets";
  return "practice";
}

function getHomeTaskTarget(target) {
  return HOME_TASK_TARGETS[target] || HOME_TASK_TARGETS.practice;
}

function saveHomeTaskEntry(prompt, target) {
  const targetConfig = getHomeTaskTarget(target);
  const entry = {
    prompt,
    target: Object.keys(HOME_TASK_TARGETS).includes(target) ? target : "practice",
    targetLabel: targetConfig.label,
    createdAt: new Date().toISOString(),
  };
  saveToLocalStorage(HOME_TASK_ENTRY_KEY, entry);
  return entry;
}

function readHomeTaskEntry() {
  const entry = loadFromLocalStorage(HOME_TASK_ENTRY_KEY, null);
  if (!entry || typeof entry !== "object") return null;
  return entry;
}

function initHomeTaskEntry() {
  const form = $("#homeTaskEntryForm");
  const input = $("#homeTaskInput");
  if (!form || !input) return;
  form.dataset.homeTaskTarget = "practice";

  const presetButtons = $$("[data-home-task-preset]", form);
  function activatePreset(button) {
    presetButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    form.dataset.homeTaskTarget = button.dataset.homeTaskTarget || "navigation";
    if (button.dataset.homeTaskText) input.value = button.dataset.homeTaskText;
  }

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activatePreset(button);
      input.focus();
    });
  });
  input.addEventListener("input", () => {
    const activePreset = presetButtons.find((button) => button.classList.contains("is-active"));
    if (!activePreset || input.value === activePreset.dataset.homeTaskText) return;
    presetButtons.forEach((button) => button.classList.remove("is-active"));
    delete form.dataset.homeTaskTarget;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const prompt = input.value.trim();
    if (!prompt) {
      showToast("请先输入要准备的教学任务");
      input.focus();
      return;
    }
    const target = form.dataset.homeTaskTarget || inferHomeTaskTarget(prompt);
    const entry = saveHomeTaskEntry(prompt, target);
    const targetConfig = getHomeTaskTarget(entry.target);
    const url = new URL(targetConfig.href, window.location.href);
    url.searchParams.set("from", "home-task");
    window.location.href = url.href;
  });
}

function surfaceHomeTaskEntry(page) {
  if (!["practice", "assets"].includes(page)) return;
  const params = new URLSearchParams(window.location.search);
  if (params.get("from") !== "home-task") return;
  const entry = readHomeTaskEntry();
  if (!entry || getHomeTaskTarget(entry.target).page !== page) return;
  const preview = entry.prompt.length > 28 ? `${entry.prompt.slice(0, 28)}...` : entry.prompt;
  window.setTimeout(() => {
    showToast(`已接收首页任务：${preview}`);
  }, 320);
}

function renderHomeFeatureTabs(activeKey) {
  return HOME_FEATURE_KEYS.map((key, index) => {
    const feature = getHomeFeatureDemo(key);
    const isActive = key === activeKey;
    return `
      <button class="home-feature-tab ${isActive ? "is-active" : ""}" type="button" role="tab" aria-selected="${String(isActive)}" data-home-feature="${escapeHtml(key)}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(feature.label)}</strong>
        <small>${escapeHtml(feature.short)}</small>
      </button>
    `;
  }).join("");
}

function renderHomeCoworkAttachments(feature, activeAttachment) {
  return feature.attachments
    .map((attachment, index) => {
      const isActive = activeAttachment === index;
      return `
        <button class="home-cowork-attachment accent-${escapeHtml(attachment.accent)} ${isActive ? "is-active" : ""}" type="button" data-home-attachment="${index}" aria-pressed="${String(isActive)}">
          <span>${escapeHtml(attachment.title.slice(0, 1))}</span>
          <strong>${escapeHtml(attachment.title)}</strong>
          <small>${escapeHtml(attachment.meta)}</small>
        </button>
      `;
    })
    .join("");
}

function renderHomeCoworkActivity(feature) {
  return feature.activity
    .map(
      (item, index) => `
        <div class="home-cowork-activity-step ${index < 3 ? "is-done" : "is-live"}">
          <span>${index < 3 ? "✓" : "•"}</span>
          <p>${escapeHtml(item)}</p>
        </div>
      `,
    )
    .join("");
}

function homeOutputHighlight(index, activeAttachment) {
  return activeAttachment === index ? "is-highlighted" : "";
}

function renderHomeNavigationPreview(activeAttachment) {
  const phases = ["准备", "设计", "实施", "复盘"];
  const stages = [
    ["课前教学设计与准备", "课程目标、学情分析与学习起点诊断、资源与预习任务"],
    ["课中教学实施与调控", "问题情境、案例探究、课堂追问与形成性评价"],
    ["课后评价反馈与持续改进", "表现性评价、学习困难诊断、反馈与资源沉淀"],
  ];
  const steps = [
    ["01", "教学情境与课程任务分析"],
    ["02", "学情分析与学习起点诊断"],
    ["03", "教学目标与预期学习成果设计"],
    ["04", "教学内容重构与核心概念提炼"],
    ["05", "学习资源与案例材料开发"],
    ["20", "教学反思、资源沉淀与持续改进"],
  ];
  const activePhase = activeAttachment === null ? 0 : activeAttachment;
  return `
    <div class="home-output-phase-switch" aria-label="教学导航阶段">
      ${phases
        .map(
          (phase, index) => `
            <span class="${index === activePhase ? "is-active" : ""}">${escapeHtml(phase)}</span>
          `,
        )
        .join("")}
    </div>
    <div class="home-output-stage-grid">
      ${stages
        .map(
          ([title, copy], index) => `
            <article class="home-output-item ${homeOutputHighlight(index, activeAttachment)}">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${escapeHtml(title)}</strong>
              <p>${escapeHtml(copy)}</p>
            </article>
          `,
        )
        .join("")}
    </div>
    <div class="home-output-route">
      ${steps
        .map(
          ([no, title], index) => `
            <div class="home-output-route-node ${index < 3 ? homeOutputHighlight(index, activeAttachment) : ""}">
              <span>${escapeHtml(no)}</span>
              <strong>${escapeHtml(title)}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderHomePracticePreview(activeAttachment) {
  const metrics = [
    ["预习完成", "72%", "需要补充概念辨析"],
    ["课堂提问", "3 条", "集中在外部环境判断"],
    ["评价任务", "2 类", "随堂测与小组分析"],
  ];
  const activities = [
    ["课前诊断", "5 题预习测，识别机会/威胁混淆"],
    ["课中活动", "药学企业市场进入案例，小组完成 SWOT 分析"],
    ["形成性评价", "小组任务评价量规，同伴互评与教师反馈"],
  ];
  const rubric = [
    ["概念准确", "58%"],
    ["证据使用", "67%"],
    ["利益相关者", "76%"],
    ["改进建议", "85%"],
  ];
  return `
    <div class="home-output-metrics">
      ${metrics
        .map(
          ([label, value, copy], index) => `
            <article class="home-output-item ${homeOutputHighlight(index, activeAttachment)}">
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(value)}</strong>
              <p>${escapeHtml(copy)}</p>
            </article>
          `,
        )
        .join("")}
    </div>
    <div class="home-output-card-grid">
      ${activities
        .map(
          ([title, copy], index) => `
            <article class="home-output-compact ${homeOutputHighlight(index, activeAttachment)}">
              <strong>${escapeHtml(title)}</strong>
              <p>${escapeHtml(copy)}</p>
            </article>
          `,
        )
        .join("")}
    </div>
    <div class="home-output-rubric" aria-label="评价量规预览">
      ${rubric
        .map(
          ([label, width]) => `
            <div>
              <span>${escapeHtml(label)}</span>
              <i><b style="width: ${escapeHtml(width)}"></b></i>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderHomeAssetsPreview(activeAttachment) {
  const assets = [
    ["教案", "1"],
    ["案例", "2"],
    ["活动", "3"],
    ["测验", "1"],
    ["评价量规", "1"],
    ["复盘", "1"],
  ];
  const reuse = ["SWOT 小组活动模板", "药品市场进入案例包", "机会/威胁辨析测验", "课堂追问与复盘清单"];
  return `
    <div class="home-output-asset-grid">
      ${assets
        .map(
          ([label, count], index) => `
            <article class="home-output-asset ${homeOutputHighlight(index % 3, activeAttachment)}">
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(count)}</strong>
              <small>已归档</small>
            </article>
          `,
        )
        .join("")}
    </div>
    <div class="home-output-reuse">
      <strong>推荐复用</strong>
      ${reuse
        .map(
          (item, index) => `
            <div class="${homeOutputHighlight(index % 3, activeAttachment)}">
              <span>${index + 1}</span>
              <p>${escapeHtml(item)}</p>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderHomeCoworkOutput(featureKey, activeAttachment) {
  const feature = getHomeFeatureDemo(featureKey);
  const body =
    featureKey === "practice"
      ? renderHomePracticePreview(activeAttachment)
      : featureKey === "assets"
        ? renderHomeAssetsPreview(activeAttachment)
        : renderHomeNavigationPreview(activeAttachment);
  return `
    <div class="home-output-head">
      <div>
        <span>Output Preview</span>
        <h3>${escapeHtml(feature.outputTitle)}</h3>
        <p>${escapeHtml(feature.outputSubtitle)}</p>
      </div>
      <div class="home-output-actions" aria-hidden="true">
        <button type="button" tabindex="-1">预览</button>
        <button type="button" tabindex="-1">编辑</button>
      </div>
    </div>
    ${body}
  `;
}

function initHomeCoworkDemo() {
  const tabs = $("#homeFeatureTabs");
  const stage = $("#homeCoworkStage");
  const kicker = $("#homeCoworkKicker");
  const title = $("#homeCoworkTitle");
  const summary = $("#homeCoworkSummary");
  const prompt = $("#homeCoworkPrompt");
  const attachments = $("#homeCoworkAttachments");
  const activity = $("#homeCoworkActivity");
  const output = $("#homeCoworkOutput");
  if (!tabs || !stage || !kicker || !title || !summary || !prompt || !attachments || !activity || !output) return;

  let activeKey = "navigation";
  let activeAttachment = null;

  function renderOutputOnly() {
    output.innerHTML = renderHomeCoworkOutput(activeKey, activeAttachment);
    $$("[data-home-attachment]", attachments).forEach((button) => {
      const isActive = Number(button.dataset.homeAttachment) === activeAttachment;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function bindAttachments() {
    $$("[data-home-attachment]", attachments).forEach((button) => {
      const index = Number(button.dataset.homeAttachment);
      button.addEventListener("mouseenter", () => {
        activeAttachment = index;
        renderOutputOnly();
      });
      button.addEventListener("mouseleave", () => {
        activeAttachment = null;
        renderOutputOnly();
      });
      button.addEventListener("focus", () => {
        activeAttachment = index;
        renderOutputOnly();
      });
      button.addEventListener("blur", () => {
        activeAttachment = null;
        renderOutputOnly();
      });
    });
  }

  function renderFeature(featureKey) {
    activeKey = HOME_FEATURE_DEMOS[featureKey] ? featureKey : "navigation";
    activeAttachment = null;
    const feature = getHomeFeatureDemo(activeKey);
    stage.dataset.homeFeature = activeKey;
    tabs.innerHTML = renderHomeFeatureTabs(activeKey);
    kicker.textContent = feature.kicker;
    title.textContent = feature.label;
    summary.textContent = feature.summary;
    prompt.textContent = feature.prompt;
    attachments.innerHTML = renderHomeCoworkAttachments(feature, activeAttachment);
    activity.innerHTML = renderHomeCoworkActivity(feature);
    renderOutputOnly();
    $$("[data-home-feature]", tabs).forEach((button) => {
      button.addEventListener("click", () => renderFeature(button.dataset.homeFeature));
    });
    bindAttachments();
  }

  renderFeature(activeKey);
}

function initHomePage() {
  renderBulletChart($("#homeDiagnosticBulletChart"), HOME_SAMPLE_DIAGNOSTIC);
  initHomeTaskEntry();
  initHomeCoworkDemo();
}

function makeEmptyAccountSession() {
  return {
    isAuthenticated: false,
    account: null,
    updatedAt: null,
  };
}

function loadAccountSession() {
  const saved = loadFromLocalStorage(ACCOUNT_SESSION_KEY, null);
  if (!saved || typeof saved !== "object") return makeEmptyAccountSession();
  return {
    ...makeEmptyAccountSession(),
    ...saved,
    account: saved.account && typeof saved.account === "object" ? saved.account : null,
  };
}

function saveAccountSession(session) {
  const nextSession = {
    ...makeEmptyAccountSession(),
    ...session,
    updatedAt: new Date().toISOString(),
  };
  saveToLocalStorage(ACCOUNT_SESSION_KEY, nextSession);
  return nextSession;
}

function clearAccountSession() {
  localStorage.removeItem(ACCOUNT_SESSION_KEY);
  return makeEmptyAccountSession();
}

function getAuthModeFromUrl() {
  try {
    const mode = new URLSearchParams(window.location.search).get("mode");
    if (mode === "register" || mode === "login") return mode;
  } catch {
    // Ignore malformed URL state and use the route name below.
  }
  return /register/i.test(window.location.pathname || "") ? "register" : "login";
}

function setAuthMode(mode, shouldSyncUrl = true) {
  const nextMode = mode === "register" ? "register" : "login";
  const label = $("#authModeLabel");
  document.body.dataset.authMode = nextMode;
  if (label) label.textContent = nextMode === "register" ? "注册" : "登录";

  $$("[data-auth-mode]").forEach((button) => {
    const isActive = button.dataset.authMode === nextMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  $$("[data-auth-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.authPanel !== nextMode;
  });

  if (shouldSyncUrl && window.history?.replaceState) {
    const url = new URL(window.location.href);
    url.searchParams.set("mode", nextMode);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }
}

function getReadableAuthTime(isoValue) {
  if (!isoValue) return "刚刚";
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) return "刚刚";
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function validateAuthPassword(password) {
  if (String(password || "").length < 6) {
    showToast("密码至少需要 6 位");
    return false;
  }
  return true;
}

function handleAuthProviderClick(event) {
  const provider = event.currentTarget?.dataset?.authProvider;
  if (provider === "school") {
    setAuthMode("login");
    $("#loginIdentifier")?.focus();
    showToast("校内账号入口目前为模拟入口，请用邮箱或手机号继续");
    return;
  }
  if (provider === "google") {
    setAuthMode("login");
    $("#loginIdentifier")?.focus();
    showToast("Google Workspace 登录为预留入口，当前请使用本地邮箱会话");
    return;
  }
  if (provider === "sso") {
    showToast("SSO 将在接入学校统一身份认证后启用");
  }
}

function renderAccountSession(session = loadAccountSession()) {
  const panel = $("#authStatusPanel");
  if (!panel) return;
  if (!session.isAuthenticated || !session.account) {
    panel.innerHTML = `
      <p class="eyebrow">Session</p>
      <h2>尚未登录</h2>
      <p>完成登录或注册后，可从这里继续进入教学导航、教学实践和教学资产。</p>
      <div class="auth-session-actions">
        <button class="secondary-action" type="button" data-auth-mode="login">切换到登录</button>
        <button class="primary-action" type="button" data-auth-mode="register">创建账号</button>
      </div>
    `;
    $$("[data-auth-mode]", panel).forEach((button) => {
      button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
    });
    return;
  }

  const account = session.account;
  panel.innerHTML = `
    <p class="eyebrow">Session</p>
    <h2>已登录：${escapeHtml(account.teacherName || "课程教师")}</h2>
    <p>当前账号会话保存在本机浏览器，可继续进入药学管理课程教学工作流。</p>
    <dl class="auth-session-meta">
      <div><dt>账号</dt><dd>${escapeHtml(account.identifier || account.email || "未填写")}</dd></div>
      <div><dt>学校 / 院系</dt><dd>${escapeHtml(account.school || "待补充")}</dd></div>
      <div><dt>最近登录</dt><dd>${escapeHtml(getReadableAuthTime(session.updatedAt))}</dd></div>
    </dl>
    <div class="auth-session-actions">
      <a class="primary-action" href="./teaching-navigation.html">进入教学导航</a>
      <a class="secondary-action" href="./practice.html">进入教学实践</a>
      <a class="secondary-action" href="./assets.html">查看教学资产</a>
      <button class="small-action" type="button" data-auth-logout>退出登录</button>
    </div>
  `;
  $("[data-auth-logout]", panel)?.addEventListener("click", () => {
    clearAccountSession();
    renderAccountSession();
    showToast("已退出登录");
  });
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const identifier = form.identifier?.value?.trim();
  const password = form.password?.value || "";
  if (!identifier) {
    showToast("请输入邮箱或手机号");
    return;
  }
  if (!validateAuthPassword(password)) return;
  const teacherName = identifier.includes("@") ? identifier.split("@")[0] : "课程教师";
  const session = saveAccountSession({
    isAuthenticated: true,
    account: {
      teacherName,
      identifier,
      email: identifier.includes("@") ? identifier : "",
      school: "",
      source: "local-login",
    },
  });
  renderAccountSession(session);
  showToast("登录成功，已进入本地账号会话");
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const teacherName = form.teacherName?.value?.trim();
  const school = form.school?.value?.trim();
  const email = form.email?.value?.trim();
  const password = form.password?.value || "";
  const agreement = Boolean(form.agreement?.checked);
  if (!teacherName || !school || !email) {
    showToast("请补全注册信息");
    return;
  }
  if (!validateAuthPassword(password)) return;
  if (!agreement) {
    showToast("请先确认本地账号会话说明");
    return;
  }
  const session = saveAccountSession({
    isAuthenticated: true,
    account: {
      teacherName,
      identifier: email,
      email,
      school,
      source: "local-register",
    },
  });
  renderAccountSession(session);
  showToast("账号已创建，已进入本地账号会话");
}

function initAuthPage() {
  setAuthMode(getAuthModeFromUrl(), false);
  $$("[data-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
  });
  $("#loginForm")?.addEventListener("submit", handleLoginSubmit);
  $("#registerForm")?.addEventListener("submit", handleRegisterSubmit);
  $$("[data-auth-provider]").forEach((button) => {
    button.addEventListener("click", handleAuthProviderClick);
  });
  renderAccountSession();
}

function getTrainingStep(stepId = trainingState?.currentStepId || 1) {
  return trainingSteps.find((step) => step.id === Number(stepId)) || trainingSteps[0];
}

function getChoice(stepId) {
  const id = String(stepId);
  trainingState.choices[id] ||= { primary: "", secondary: [] };
  trainingState.choices[id].secondary ||= [];
  return trainingState.choices[id];
}

function createDefaultTrainingState() {
  const courseContext = {
    courseName: defaultTrainingCourse.courseName,
    topic: defaultTrainingCourse.topic,
    scenario: defaultTrainingCourse.scenario,
    teachingObject: defaultTrainingCourse.teachingObject,
    userPersona: defaultTrainingCourse.userPersona,
    lessonLength: defaultTrainingCourse.lessonLength,
    coreTask: defaultTrainingCourse.coreTask,
  };
  const state = {
    currentStepId: 1,
    currentSelections: {
      1: "E",
    },
    courseContext,
    currentPreview: null,
    stepResults: {},
    choices: {
      1: { primary: "E", secondary: [] },
    },
    templates: {},
    scores: {},
    analyses: {},
    generatedFragments: {},
    completedStepIds: [],
    needsReviewStepIds: [],
    trainingReport: "",
    isTrainingCompleted: false,
    updatedAt: new Date().toISOString(),
  };
  return state;
}

function loadTrainingState() {
  const fallback = createDefaultTrainingState();
  const savedState =
    loadFromLocalStorage(TRAINING_STATE_KEY, null) ||
    loadFromLocalStorage(NAVIGATION_TRAINING_KEY, fallback);
  trainingState = {
    ...fallback,
    ...savedState,
  };
  trainingState.currentStepId = clamp(Number(trainingState.currentStepId || 1), 1, trainingSteps.length);
  trainingState.currentSelections ||= {};
  trainingState.courseContext = {
    ...fallback.courseContext,
    ...(trainingState.courseContext || {}),
  };
  trainingState.currentPreview ||= null;
  trainingState.stepResults ||= {};
  trainingState.choices ||= {};
  trainingState.templates ||= {};
  trainingState.scores ||= {};
  trainingState.analyses ||= {};
  trainingState.generatedFragments ||= {};
  trainingState.completedStepIds ||= [];
  trainingState.needsReviewStepIds ||= [];
  Object.entries(trainingState.choices).forEach(([stepId, choice]) => {
    if (choice?.primary && !trainingState.currentSelections[String(stepId)]) {
      trainingState.currentSelections[String(stepId)] = choice.primary;
    }
  });
  Object.entries(trainingState.currentSelections).forEach(([stepId, optionId]) => {
    trainingState.choices[String(stepId)] ||= { primary: "", secondary: [] };
    trainingState.choices[String(stepId)].primary ||= optionId;
    trainingState.choices[String(stepId)].secondary ||= [];
  });
  migrateConfirmedTrainingResults();
  return trainingState;
}

function saveTrainingState() {
  trainingState.updatedAt = new Date().toISOString();
  saveToLocalStorage(TRAINING_STATE_KEY, {
    currentSelections: trainingState.currentSelections || {},
    courseContext: getStoredTrainingCourseContext(),
    stepResults: trainingState.stepResults || {},
    currentStepId: trainingState.currentStepId,
    choices: trainingState.choices || {},
    templates: trainingState.templates || {},
    analyses: trainingState.analyses || {},
    generatedFragments: trainingState.generatedFragments || {},
    completedStepIds: trainingState.completedStepIds || [],
    needsReviewStepIds: trainingState.needsReviewStepIds || [],
    trainingReport: trainingState.trainingReport || "",
    stepDiagnostics: trainingState.stepDiagnostics || [],
    finalDiagnostic: trainingState.finalDiagnostic || null,
    priorityReviewList: trainingState.priorityReviewList || [],
    isTrainingCompleted: Boolean(trainingState.isTrainingCompleted),
    updatedAt: trainingState.updatedAt,
  });
  saveToLocalStorage(NAVIGATION_TRAINING_KEY, trainingState);
}

function migrateConfirmedTrainingResults() {
  trainingState.completedStepIds.forEach((stepId) => {
    const id = String(stepId);
    if (trainingState.stepResults[id]) return;
    const selectedOptionId = trainingState.currentSelections?.[id] || trainingState.choices?.[id]?.primary;
    if (!selectedOptionId) return;
    const result = createConfirmedTrainingStepResult(stepId, selectedOptionId);
    if (result) trainingState.stepResults[id] = result;
  });
  trainingState.needsReviewStepIds = Object.values(trainingState.stepResults)
    .filter((result) => Number(result.stepScore) < 2.5 || (result.dimensions || []).some((dimension) => Number(dimension.score) < 2.5))
    .map((result) => Number(result.stepId));
}

function buildGoalCalibratorValueOutput(plan, context = getTrainingCourseContext()) {
  const options = {
    A: `本课先帮助学生准确理解“${context.topic}”的关键概念、适用边界和基本语言，为后续进入“${context.scenario}”建立共同基础。`,
    B: `“${context.topic}”帮助学生在“${context.scenario}”中识别关键条件、分析证据并形成有依据的判断。`,
    C: `本课以可展示的${getTrainingOutputLabel(context)}为产出，推动学生把概念学习转化为可提交、可评价的课堂作品。`,
    D: `本课围绕“${context.scenario}”中的真实问题展开探究，引导学生在证据不足、条件复杂的情境中提出判断依据。`,
    E: `本课面向“${context.scenario}”中的应用任务，训练学生把“${context.topic}”用于岗位化或实践化的问题分析与表达。`,
    F: `本课不仅训练“${context.topic}”的使用，还强化证据意识、边界意识、协作表达和反思改进等综合素养。`,
  };
  return options[plan] || options.B;
}

function buildGoalCalibratorGoalOutput(level, context = getTrainingCourseContext()) {
  const options = {
    understand: `学生能够基于“${context.scenario}”，解释“${context.topic}”的用途、关键概念和判断依据。`,
    apply: `学生能够基于“${context.scenario}”，使用“${context.topic}”完成一项课堂任务，并形成可检查的过程记录。`,
    analyze: `学生能够基于“${context.scenario}”，比较关键条件与证据关系，完成${getTrainingOutputLabel(context)}，并说明方案与情境的匹配性。`,
    evaluate: `学生能够基于“${context.scenario}”，论证“${context.topic}”判断的证据基础，权衡不同方案的收益与风险，并提出建议。`,
  };
  return options[level] || options.analyze;
}

function buildGoalCalibratorTaskOutput(context = getTrainingCourseContext()) {
  if (isDefaultTrainingContext(context)) return goalCalibratorScenarioOutputs.chronic.task;
  return `围绕“${context.scenario}”，请学生从${getTrainingEvidenceText(context)}等角度完成“${context.topic}”任务，并提交${getTrainingOutputLabel(context)}。`;
}

function buildGoalCalibratorEvidenceOutput(context = getTrainingCourseContext()) {
  if (isDefaultTrainingContext(context)) return goalCalibratorScenarioOutputs.chronic.evidence;
  return `评价学生的概念边界清晰度、证据支撑充分性、任务成果质量、方案可行性和反思改进意识。`;
}

function syncTrainingContextInputs(root = document) {
  const context = getTrainingCourseContext();
  $$("[data-training-context-field]", root).forEach((field) => {
    const key = field.dataset.trainingContextField;
    if (!key) return;
    field.placeholder = defaultTrainingCourse[key] || trainingContextFieldLabels[key] || "";
    if (field !== document.activeElement) field.value = context[key] || "";
  });
}

function renderTrainingContextSummary() {
  const context = getTrainingCourseContext();
  const setText = (selector, text) => {
    const target = $(selector);
    if (target) target.textContent = text;
  };
  syncTrainingContextInputs();
  setText("#profileTeachingObject", context.teachingObject);
  setText("#profileUserPersona", context.userPersona);
  setText("#profileLessonLength", context.lessonLength);
  setText("#calibratorTopicLabel", context.topic);
  setText("#calibratorScenarioLabel", context.scenario);
  setText(
    "#navigationLede",
    `面向${context.teachingObject}，围绕《${context.courseName}》课程中的${context.topic}知识点，完成课前教学设计、课中教学实施、课后评价反馈与持续改进训练。`,
  );
  setText(
    "#goalCalibratorSubtitle",
    `把“教${context.topic}”转化为“训练学生在${context.scenario}中进行结构化判断与决策表达”。`,
  );
  setText(
    "#trainingIntroCopy",
    `这不是正式操作真实课程，而是以“${context.courseName}｜${context.topic}｜${context.scenario}”为例，训练你完成一次覆盖课前、课中、课后的教学判断。每一步都会给出优秀模板、环节专属评价量规、4 维成熟度条形诊断图、低分维度诊断和改进建议。`,
  );
}

function invalidateTrainingReport() {
  trainingState.trainingReport = "";
  trainingState.stepDiagnostics = [];
  trainingState.finalDiagnostic = null;
  trainingState.priorityReviewList = [];
  trainingState.reportViewModel = null;
  trainingState.isTrainingCompleted = trainingState.completedStepIds.length >= trainingSteps.length;
}

function refreshTrainingArtifactsForContext() {
  if (!trainingState) return;
  Object.entries(trainingState.currentSelections || {}).forEach(([stepId, optionId]) => {
    if (!optionId) return;
    const preview = createStepPreview(Number(stepId), optionId, "training");
    trainingState.templates[String(stepId)] = preview.template;
    trainingState.scores[String(stepId)] = preview.score;
    trainingState.analyses[String(stepId)] = preview.analysis;
    trainingState.generatedFragments[String(stepId)] = preview.fragment;
    if (Number(stepId) === Number(trainingState.currentStepId)) trainingState.currentPreview = preview;
  });
  trainingState.completedStepIds.forEach((stepId) => {
    const id = String(stepId);
    const selectedOptionId = trainingState.currentSelections?.[id] || trainingState.choices?.[id]?.primary;
    if (!selectedOptionId) return;
    const result = createConfirmedTrainingStepResult(stepId, selectedOptionId);
    if (result) trainingState.stepResults[id] = result;
  });
  trainingState.needsReviewStepIds = Object.values(trainingState.stepResults || {})
    .filter((result) => Number(result.stepScore) < 2.5 || (result.dimensions || []).some((dimension) => Number(dimension.score) < 2.5))
    .map((result) => Number(result.stepId));
  invalidateTrainingReport();
}

function updateTrainingCourseContext(partialContext) {
  if (!trainingState) return;
  trainingState.courseContext = {
    ...(trainingState.courseContext || {}),
    ...partialContext,
  };
  refreshTrainingArtifactsForContext();
  saveTrainingState();
  renderTrainingContextSummary();
  renderTrainingWorkflow();
}

function initGoalCalibratorModule() {
  const root = $("#goalCalibrator");
  if (!root) return;
  const state = {
    plan: trainingState?.currentSelections?.["1"] || trainingState?.choices?.["1"]?.primary || $(".calibrator-plan.is-active", root)?.dataset.calibratorPlan || "B",
    level: $("[data-calibrator-level].is-active", root)?.dataset.calibratorLevel || "analyze",
    foundation: $("[data-calibrator-foundation].is-active", root)?.dataset.calibratorFoundation || "new",
  };
  const updateActive = (selector, activeValue, dataKey) => {
    $$(selector, root).forEach((button) => {
      button.classList.toggle("is-active", button.dataset[dataKey] === activeValue);
    });
  };
  const render = () => {
    const context = getTrainingCourseContext();
    const valueOutput = buildGoalCalibratorValueOutput(state.plan, context);
    const goalOutput = buildGoalCalibratorGoalOutput(state.level, context);
    const valueTarget = $("#calibratorValueOutput", root);
    const goalTarget = $("#calibratorGoalOutput", root);
    const taskTarget = $("#calibratorTaskOutput", root);
    const evidenceTarget = $("#calibratorEvidenceOutput", root);
    if (valueTarget) valueTarget.textContent = valueOutput;
    if (goalTarget) goalTarget.textContent = goalOutput;
    if (taskTarget) taskTarget.textContent = buildGoalCalibratorTaskOutput(context);
    if (evidenceTarget) evidenceTarget.textContent = buildGoalCalibratorEvidenceOutput(context);
    renderTrainingContextSummary();
  };

  $$("[data-training-context-field]").forEach((field) => {
    field.addEventListener("input", () => {
      updateTrainingCourseContext({ [field.dataset.trainingContextField]: field.value });
      render();
    });
  });

  root.addEventListener("click", (event) => {
    const planButton = event.target.closest("[data-calibrator-plan]");
    if (planButton && root.contains(planButton)) {
      state.plan = planButton.dataset.calibratorPlan;
      updateActive("[data-calibrator-plan]", state.plan, "calibratorPlan");
      const choice = getChoice(1);
      choice.primary = state.plan;
      trainingState.currentSelections["1"] = state.plan;
      trainingState.currentStepId = 1;
      saveTrainingState();
      renderTrainingWorkflow();
      render();
      return;
    }

    const levelButton = event.target.closest("[data-calibrator-level]");
    if (levelButton && root.contains(levelButton)) {
      state.level = levelButton.dataset.calibratorLevel;
      updateActive("[data-calibrator-level]", state.level, "calibratorLevel");
      render();
      return;
    }

    const foundationButton = event.target.closest("[data-calibrator-foundation]");
    if (foundationButton && root.contains(foundationButton)) {
      state.foundation = foundationButton.dataset.calibratorFoundation;
      updateActive("[data-calibrator-foundation]", state.foundation, "calibratorFoundation");
    }
  });

  updateActive("[data-calibrator-plan]", state.plan, "calibratorPlan");
  updateActive("[data-calibrator-level]", state.level, "calibratorLevel");
  updateActive("[data-calibrator-foundation]", state.foundation, "calibratorFoundation");
  render();
}

function initNavigationTrainingPage() {
  if (!$("#trainingSidebar") || !$("#trainingCurrentStep")) return;
  loadTrainingState();
  initGoalCalibratorModule();
  renderTrainingWorkflow();

  $("#jumpToTraining")?.addEventListener("click", () => {
    $("#training-camp")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#startTrainingFromBeginning")?.addEventListener("click", () => {
    trainingState.currentStepId = 1;
    isTrainingMapTaskSheetOpen = false;
    saveTrainingState();
    renderTrainingWorkflow();
    $("#training-camp")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#resetTraining")?.addEventListener("click", resetTrainingState);
  $("#generateTrainingReport")?.addEventListener("click", generateTrainingReport);
  $("#copyTrainingReport")?.addEventListener("click", () => copyText(trainingState.trainingReport || generateTrainingReport()));
  $("#downloadTrainingReport")?.addEventListener("click", () =>
    downloadMarkdown("pharmacopilot-new-teacher-training-report.md", trainingState.trainingReport || generateTrainingReport()),
  );
  $("#saveTrainingReportToAssets")?.addEventListener("click", saveTrainingReportToAssets);
  document.addEventListener("click", (event) => {
    if (document.body.dataset.page !== "navigation") return;
    if (event.target.closest("[data-close-training-map-sheet]")) closeTrainingMapTaskSheet();
  });
  document.addEventListener("keydown", (event) => {
    if (document.body.dataset.page !== "navigation") return;
    if (event.key === "Escape") closeTrainingMapTaskSheet();
  });
}

function renderTrainingWorkflow() {
  renderTrainingSidebar();
  renderGameTrainingMap();
  renderTrainingCurrentStep();
  renderTrainingReportDraft();
  renderTrainingFinalReport();
}

function renderTrainingSidebar() {
  const container = $("#trainingSidebar");
  if (!container) return;
  const workflowConfig = getContextualTrainingWorkflowConfig();
  container.innerHTML = workflowConfig
    .map(
      (stage) => `
        <section class="workflow-stage">
          <h3 class="workflow-stage-title">${escapeHtml(stage.stageTitle)}</h3>
          ${stage.steps
            .map((step) => {
              const [label, status] = getTrainingStepStatus(step.id);
              const scoreMeta = getTrainingSidebarScoreMeta(step.id);
              return `
                <button class="workflow-step ${status} ${step.id === trainingState.currentStepId ? "active" : ""}" data-training-step="${step.id}" ${status === "locked" ? "disabled" : ""} type="button">
                  <span class="workflow-step-number">${String(step.id).padStart(2, "0")}</span>
                  <span class="workflow-step-title">${escapeHtml(step.title)}</span>
                  <span class="status-pill status-${status}">${label}</span>
                  <span class="sidebar-score-badge">${escapeHtml(scoreMeta.label)}</span>
                  ${scoreMeta.needsReview ? `<span class="sidebar-review-flag">建议复查</span>` : ""}
                </button>
              `;
            })
            .join("")}
        </section>
      `,
    )
    .join("");

  $$("[data-training-step]", container).forEach((button) => {
    button.addEventListener("click", () => {
      trainingState.currentStepId = Number(button.dataset.trainingStep);
      saveTrainingState();
      renderTrainingWorkflow();
    });
  });
}

const GAME_TRAINING_MAP_STAGE_META = [
  {
    label: "阶段一",
    terrain: "green",
    badge: "课前设计",
    route: "课前教学设计与准备",
  },
  {
    label: "阶段二",
    terrain: "orange",
    badge: "课堂实施",
    route: "课中教学实施与调控",
  },
  {
    label: "阶段三",
    terrain: "teal",
    badge: "评价改进",
    route: "课后评价反馈与持续改进",
  },
  {
    label: "阶段三",
    terrain: "violet",
    badge: "资源沉淀",
    route: "课后评价反馈与持续改进",
  },
];

let isTrainingMapTaskSheetOpen = false;

function renderGameTrainingMap() {
  const map = $("#trainingLearningMap");
  if (!map || !trainingState) return;
  const context = getTrainingCourseContext();
  const workflowConfig = getContextualTrainingWorkflowConfig(context);
  const orderedSteps = workflowConfig.flatMap((stage) => stage.steps);
  const completedCount = trainingState.completedStepIds.length;
  const totalCount = orderedSteps.length || trainingSteps.length;
  const currentStep = getContextualTrainingStep(getTrainingStep(trainingState.currentStepId), context);
  const currentScoreMeta = getTrainingSidebarScoreMeta(currentStep.id);
  const completedTarget = $("#trainingMapCompleted");
  const scoreTarget = $("#trainingMapScore");
  const reviewTarget = $("#trainingMapReview");
  const titleTarget = $("#trainingMapCurrentTitle");
  const copyTarget = $("#trainingMapCurrentCopy");
  const progressBar = $("#trainingMapProgressBar");
  const progress = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  if (titleTarget) titleTarget.textContent = `${String(currentStep.id).padStart(2, "0")}｜${currentStep.title}`;
  if (copyTarget) copyTarget.textContent = currentStep.coreQuestion;
  if (completedTarget) completedTarget.textContent = `${completedCount} / ${totalCount}`;
  if (scoreTarget) scoreTarget.textContent = currentScoreMeta.label;
  if (reviewTarget) reviewTarget.textContent = String(trainingState.needsReviewStepIds.length);
  if (progressBar) progressBar.style.width = `${progress}%`;

  map.innerHTML = workflowConfig.map((stage, index) => renderGameMapIsland(stage, index)).join("");
  renderGameMapStepDetail();

  $$("[data-map-step]", map).forEach((node) => {
    node.addEventListener("click", () => {
      const stepId = Number(node.dataset.mapStep);
      const [, status] = getTrainingStepStatus(stepId);
      if (status === "locked") {
        showToast("请先完成前序关卡，再解锁该环节");
        return;
      }
      trainingState.currentStepId = stepId;
      isTrainingMapTaskSheetOpen = true;
      saveTrainingState();
      renderTrainingWorkflow();
      requestAnimationFrame(() => $("#trainingMapDetailPanel")?.focus({ preventScroll: true }));
    });
  });
}

function renderTrainingProgressMap() {
  renderGameTrainingMap();
}

function renderGameMapIsland(stage, index) {
  const meta = GAME_TRAINING_MAP_STAGE_META[index] || GAME_TRAINING_MAP_STAGE_META[0];
  const stageNumber = index + 1;
  const steps = index % 2 === 0 ? stage.steps : [...stage.steps].reverse();
  const stageStepIds = stage.steps.map((step) => Number(step.id));
  const completedInStage = stageStepIds.filter((stepId) => trainingState.completedStepIds.includes(stepId)).length;
  const stageRatio = stageStepIds.length ? completedInStage / stageStepIds.length : 0;
  const densityClass = stageRatio >= 0.6 ? "is-high-progress" : stageRatio > 0 ? "is-mid-progress" : "is-low-progress";
  const isActiveStage = stageStepIds.includes(Number(trainingState.currentStepId));
  return `
    <section class="game-map-island landscape-stage map-stage-${stageNumber} game-island-${meta.terrain} ${densityClass} ${isActiveStage ? "is-active-stage" : ""}" aria-label="${escapeHtml(stage.stageTitle)}">
      <div class="game-island-cliff" aria-hidden="true"></div>
      <div class="game-island-scenery" aria-hidden="true">
        ${renderGameIslandScenery(stageNumber)}
      </div>
      <div class="game-island-road road-a" aria-hidden="true"></div>
      <div class="game-island-road road-b" aria-hidden="true"></div>
      <div class="landscape-stage-label">
        <span>${escapeHtml(meta.label)} · ${escapeHtml(meta.badge)}</span>
        <strong>${escapeHtml(stage.stageTitle.replace(/^阶段[一二三四五六七八九十]+：/, ""))}</strong>
      </div>
      <span class="game-island-progress">${completedInStage}/${stageStepIds.length}</span>
      <div class="landscape-stage-nodes">
        ${steps.map((step) => renderGameMapNode(step)).join("")}
      </div>
    </section>
  `;
}

function renderGameIslandScenery(stageNumber) {
  const scenery = {
    1: ["tower-1", "tower-2", "tree-1", "tree-2", "tree-3", "tree-4", "ruin-1", "flag-1"],
    2: ["ruin-1", "ruin-2", "tower-1", "rock-1", "rock-2", "tree-1", "tree-2", "flag-1"],
    3: ["tower-1", "dock-1", "tree-1", "tree-2", "rock-1", "rock-2", "flag-1", "ruin-1"],
    4: ["tower-1", "ruin-1", "rock-1", "rock-2", "rock-3", "tree-1", "flag-1", "dock-1"],
  }[stageNumber] || [];
  return scenery.map((name) => `<span class="scene-prop prop-${name}"></span>`).join("");
}

function renderGameMapNode(step) {
  const [statusLabel, status] = getTrainingStepStatus(step.id);
  const scoreMeta = getTrainingSidebarScoreMeta(step.id);
  const isCurrent = step.id === trainingState.currentStepId;
  const classes = [
    "map-node",
    "game-map-node",
    `map-node-${status}`,
    `map-node-step-${step.id}`,
    isCurrent ? "is-current" : "",
    scoreMeta.needsReview ? "has-review" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `
    <button class="${classes}" type="button" data-map-step="${step.id}" data-map-status="${escapeHtml(status)}" title="${String(step.id).padStart(2, "0")} ${escapeHtml(step.title)}" aria-label="${String(step.id).padStart(2, "0")} ${escapeHtml(step.title)}：${escapeHtml(statusLabel)}">
      <span class="map-node-orb">${String(step.id).padStart(2, "0")}</span>
      <span class="map-node-text">
        <strong>${escapeHtml(step.title)}</strong>
        <em>${escapeHtml(statusLabel)}</em>
      </span>
      <span class="map-node-score">${escapeHtml(scoreMeta.label)}</span>
    </button>
  `;
}

function renderGameMapAssets() {
  const container = $("#trainingMapAssets");
  if (!container) return;
  const completedCount = trainingState.completedStepIds.length;
  const assets = [
    {
      title: "SWOT 任务模板",
      copy: "用于课程情境与任务分析",
      unlocked: completedCount >= 1,
    },
    {
      title: "课堂评价量规",
      copy: "形成性与总结性评价量规",
      unlocked: trainingState.completedStepIds.includes(18) || completedCount >= 12,
    },
    {
      title: "训练报告",
      copy: "个人能力画像与改进建议",
      unlocked: Boolean(trainingState.trainingReport) || completedCount >= trainingSteps.length,
    },
  ];
  container.innerHTML = assets
    .map(
      (asset) => `
        <a class="map-asset-item ${asset.unlocked ? "is-unlocked" : "is-locked"}" href="./assets.html">
          <span>${asset.unlocked ? "✓" : "⌁"}</span>
          <div>
            <strong>${escapeHtml(asset.title)}</strong>
            <small>${escapeHtml(asset.copy)}</small>
          </div>
          <b>›</b>
        </a>
      `,
    )
    .join("");
}

function renderGameMapStepDetail() {
  const container = $("#trainingMapStepDetail");
  if (!container) return;
  const panel = $("#trainingMapDetailPanel");
  if (!isTrainingMapTaskSheetOpen) {
    if (panel) {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
    }
    container.innerHTML = "";
    return;
  }
  const context = getTrainingCourseContext();
  const step = getContextualTrainingStep(getTrainingStep(trainingState.currentStepId), context);
  const routeNode = getRouteNode(step.id);
  const choice = getChoice(step.id);
  const selectedOptionId = trainingState.currentSelections?.[String(step.id)] || choice.primary || "";
  const preview = selectedOptionId ? createStepPreview(step.id, selectedOptionId, "training") : null;
  const [statusLabel, status] = getTrainingStepStatus(step.id);
  const scoreMeta = getTrainingSidebarScoreMeta(step.id);
  const selectedTitle = preview?.selectedOption?.title || (selectedOptionId ? step.options?.[selectedOptionId] : "");
  const advice = preview?.score?.improvementAdvice || preview?.analysis?.suggestions?.[0] || "选择一个方案后，系统会生成该环节的评价提示和改进建议。";
  if (panel) {
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
  }
  const optionsMarkup = Object.entries(step.options || {})
    .map(([id, label]) => {
      const isSelected = selectedOptionId === id;
      return `
        <button class="game-map-choice ${isSelected ? "is-selected" : ""}" type="button" data-map-detail-primary="${id}">
          <span>${escapeHtml(id)}</span>
          <strong>${escapeHtml(label)}</strong>
        </button>
      `;
    })
    .join("");

  container.innerHTML = `
    <article class="game-map-step-card" data-detail-status="${escapeHtml(status)}">
      <div class="game-map-step-kicker">
        <span>${String(step.id).padStart(2, "0")} · ${escapeHtml(statusLabel)}</span>
        <strong>${escapeHtml(scoreMeta.label)}</strong>
      </div>
      <h4>${escapeHtml(step.title)}</h4>
      <p class="game-map-step-question">${escapeHtml(step.coreQuestion)}</p>
      <div class="game-map-step-meta">
        <span>${escapeHtml(step.stageTitle)}</span>
        <span>${escapeHtml(context.topic)} · ${escapeHtml(context.scenario)}</span>
      </div>
      <dl class="game-map-task-list">
        <div><dt>教师任务</dt><dd>${escapeHtml(routeNode.task)}</dd></div>
        <div><dt>需要提交的产出物</dt><dd>${escapeHtml(routeNode.output)}</dd></div>
        <div><dt>评价维度</dt><dd>${escapeHtml(routeNode.rubric)}</dd></div>
      </dl>
      <div class="game-map-choice-block">
        <div class="game-map-choice-head">
          <span>选择方案</span>
          <strong>${selectedOptionId ? `${escapeHtml(selectedOptionId)} · ${escapeHtml(selectedTitle)}` : "待选择"}</strong>
        </div>
        <div class="game-map-choice-grid">
          ${optionsMarkup}
        </div>
      </div>
      <div class="game-map-advice-box">
        <span>系统提示</span>
        <p>${escapeHtml(advice)}</p>
      </div>
      <div class="game-map-detail-actions">
        <button class="home-login-primary" id="confirmGameMapStep" type="button" ${selectedOptionId ? "" : "disabled"}>确认本关卡</button>
        <button class="home-login-secondary" id="openFullTrainingStep" type="button">进入完整训练工作台</button>
      </div>
    </article>
  `;

  if (panel) $("[data-close-training-map-sheet]", panel)?.addEventListener("click", closeTrainingMapTaskSheet);
  $$("[data-map-detail-primary]", container).forEach((button) =>
    button.addEventListener("click", () => selectGameMapPrimaryOption(button.dataset.mapDetailPrimary)),
  );
  $("#confirmGameMapStep")?.addEventListener("click", confirmGameMapStep);
  $("#openFullTrainingStep")?.addEventListener("click", () => {
    isTrainingMapTaskSheetOpen = false;
    renderGameMapStepDetail();
    renderTrainingCurrentStep();
    $("#training-camp")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function closeTrainingMapTaskSheet() {
  isTrainingMapTaskSheetOpen = false;
  renderGameMapStepDetail();
}

function selectGameMapPrimaryOption(optionId) {
  const step = getTrainingStep();
  if (!optionId || !step.options?.[optionId]) return;
  const choice = getChoice(step.id);
  choice.primary = optionId;
  choice.secondary = choice.secondary.filter((id) => id !== optionId);
  trainingState.currentSelections[String(step.id)] = optionId;
  trainingState.currentPreview = createStepPreview(step.id, optionId, "training");
  buildTrainingStepArtifacts(step);
  isTrainingMapTaskSheetOpen = true;
  saveTrainingState();
  renderTrainingWorkflow();
  requestAnimationFrame(() => $("#trainingMapDetailPanel")?.focus({ preventScroll: true }));
}

function confirmGameMapStep() {
  const step = getTrainingStep();
  const choice = getChoice(step.id);
  if (!choice.primary) {
    showToast("请先选择一个主方案");
    return;
  }
  isTrainingMapTaskSheetOpen = false;
  confirmTrainingStep();
}

const routeTrainingNodes = [
  {
    id: 1,
    title: "教学情境与课程任务分析",
    stage: 1,
    status: "completed",
    x: 9,
    y: 78,
    goal: "明确课程性质、专业培养要求和本节课的教学任务。",
    task: "说明 SWOT 分析在药事管理人才培养和管理决策训练中的位置。",
    output: "教学情境与课程任务说明。",
    rubric: "是否清楚说明课程任务、专业情境和学生能力发展之间的关系。",
    theory: "OBE 成果导向教育 / 课程分析。",
  },
  {
    id: 2,
    title: "学情分析与学习起点诊断",
    stage: 1,
    status: "completed",
    x: 18,
    y: 66,
    goal: "识别学生先备知识、经验基础、常见误区和学习支持需要。",
    task: "基于预习、作业或课堂观察，诊断学生学习 SWOT 分析的起点与障碍。",
    output: "学情分析与学习起点诊断表。",
    rubric: "是否覆盖先备知识、认知难点、能力差异和支架需求。",
    theory: "学情分析 / 最近发展区。",
  },
  {
    id: 3,
    title: "教学目标与预期学习成果设计",
    stage: 1,
    status: "completed",
    x: 28,
    y: 74,
    goal: "把课程任务转化为可观察、可评价的学习成果。",
    task: "写出知识、能力、价值目标，并对应学生可提交的学习成果证据。",
    output: "教学目标与预期学习成果表。",
    rubric: "目标是否具体、可观察、可评价，并能体现药学管理课程特色。",
    theory: "Bloom 认知目标分类 / Constructive Alignment。",
  },
  {
    id: 4,
    title: "教学内容重构与核心概念提炼",
    stage: 1,
    status: "completed",
    x: 35,
    y: 58,
    goal: "围绕学习成果重构教学内容，提炼关键概念和重点难点。",
    task: "区分 SWOT 的内部条件、外部环境、机会威胁和管理决策边界。",
    output: "核心概念与重点难点清单。",
    rubric: "内容结构是否服务目标，概念边界是否清楚，难点判断是否基于学情。",
    theory: "教学内容分析 / 概念教学。",
  },
  {
    id: 5,
    title: "学习资源与案例材料开发",
    stage: 1,
    status: "completed",
    x: 47,
    y: 64,
    goal: "开发与课程目标匹配、可支撑证据分析的学习资源。",
    task: "准备药品政策、医药企业、医院药学或公共卫生管理场景中的案例材料。",
    output: "案例材料包与学习资源清单。",
    rubric: "资源是否真实、适度复杂，并能支持学生开展证据判断。",
    theory: "案例教学 / 真实性学习。",
  },
  {
    id: 6,
    title: "课前学习支架与预习任务设计",
    stage: 1,
    status: "current",
    x: 56,
    y: 48,
    goal: "通过预习任务和支架材料帮助学生形成初步问题意识。",
    task: "设计课前阅读、案例初判和学习困难提交任务。",
    output: "课前预习任务单与学习支架。",
    rubric: "任务是否目标明确、负荷适当，并能暴露学生学习起点。",
    theory: "支架式教学 / 翻转课堂。",
  },
  {
    id: 7,
    title: "诊断性评价与学习问题收集",
    stage: 1,
    status: "available",
    x: 66,
    y: 55,
    goal: "在课前或课初识别学生对概念、案例和方法的主要困难。",
    task: "设计一组诊断题或问题收集表，聚焦 SWOT 边界混淆和证据使用问题。",
    output: "诊断性评价题组与问题清单。",
    rubric: "诊断点是否对应目标和难点，是否能转化为课堂调控依据。",
    theory: "诊断性评价 / 学习分析。",
  },
  {
    id: 8,
    title: "教学过程、活动序列与评价量规设计",
    stage: 1,
    status: "available",
    x: 74,
    y: 42,
    goal: "形成目标、活动、资源、评价和时间安排一致的课堂方案。",
    task: "设计活动序列、学生任务、评价量规与学习证据清单。",
    output: "教学过程设计表与评价量规草案。",
    rubric: "教学活动、学习产出和评价证据是否一致，课堂节奏是否可执行。",
    theory: "教学设计 / 逆向设计。",
  },
  {
    id: 9,
    title: "问题情境创设与学习动机激发",
    stage: 2,
    status: "available",
    x: 85,
    y: 50,
    goal: "用真实药事管理问题激发学生进入学习任务。",
    task: "设计课堂导入问题和教师引导语，让学生看到 SWOT 分析的决策价值。",
    output: "问题情境与导入脚本。",
    rubric: "情境是否真实，问题是否能引出管理判断而非背景复述。",
    theory: "问题导向学习 / 情境学习。",
  },
  {
    id: 10,
    title: "先行组织与已有经验激活",
    stage: 2,
    status: "available",
    x: 78,
    y: 29,
    goal: "帮助学生把已有管理学知识、行业经验和本节任务建立联系。",
    task: "设计概念回顾、经验提取或案例预判活动。",
    output: "先行组织图与经验激活问题。",
    rubric: "是否有效连接先备知识、案例材料和本节课核心任务。",
    theory: "先行组织者 / 建构主义学习。",
  },
  {
    id: 11,
    title: "核心概念讲解与认知支架提供",
    stage: 2,
    status: "available",
    x: 64,
    y: 27,
    goal: "讲清 SWOT 核心概念和学生容易混淆的判断边界。",
    task: "设计概念区分表、教师示范样例和常见误区提示。",
    output: "核心概念讲解稿与认知支架。",
    rubric: "概念是否准确，支架是否能降低认知负荷并支持后续分析。",
    theory: "认知支架 / 概念转变。",
  },
  {
    id: 12,
    title: "案例探究与证据分析活动",
    stage: 2,
    status: "available",
    x: 53,
    y: 35,
    goal: "让学生基于证据完成案例分析，而不是凭主观印象分类。",
    task: "组织学生从政策、市场、机构或管理情境材料中提取证据并完成 SWOT 判断。",
    output: "案例证据分析记录表。",
    rubric: "证据提取是否准确，分析是否能从信息整理走向解释和判断。",
    theory: "探究式学习 / 证据导向教学。",
  },
  {
    id: 13,
    title: "协作学习与角色任务推进",
    stage: 2,
    status: "locked",
    x: 42,
    y: 25,
    goal: "通过角色分工和协作任务促进学生共同完成高质量分析。",
    task: "设计小组角色、任务分工、讨论规则和阶段性产出要求。",
    output: "协作学习任务单。",
    rubric: "分工是否清楚，协作是否促进观点比较、证据共享和共同决策。",
    theory: "合作学习 / 同伴互助。",
  },
  {
    id: 14,
    title: "学习成果展示、课堂对话与追问",
    stage: 2,
    status: "locked",
    x: 30,
    y: 34,
    goal: "让学生展示分析结果，并通过课堂对话深化理解。",
    task: "设计展示规则、同伴提问和教师追问清单。",
    output: "展示规则与追问清单。",
    rubric: "展示是否聚焦学习成果，追问是否推动解释、评价和迁移。",
    theory: "课堂对话 / 苏格拉底式提问。",
  },
  {
    id: 15,
    title: "形成性评价与即时反馈调节",
    stage: 2,
    status: "locked",
    x: 19,
    y: 27,
    goal: "在课堂过程中及时判断学习达成情况并调整教学。",
    task: "设计课堂观察点、即时测验、同伴互评或教师反馈话术。",
    output: "形成性评价与即时反馈方案。",
    rubric: "评价是否嵌入活动过程，反馈是否具体、及时并能促进改进。",
    theory: "形成性评价 / 课堂调控。",
  },
  {
    id: 16,
    title: "课堂总结、迁移提升与课后任务衔接",
    stage: 2,
    status: "locked",
    x: 13,
    y: 43,
    goal: "帮助学生归纳关键经验，并把课堂学习延伸到课后任务。",
    task: "设计课堂总结、迁移问题和课后作业要求。",
    output: "课堂总结脚本与课后任务单。",
    rubric: "总结是否突出核心概念和方法迁移，课后任务是否承接学习成果。",
    theory: "迁移学习 / 教学闭环。",
  },
  {
    id: 17,
    title: "学习成果收集与表现性评价",
    stage: 3,
    status: "locked",
    x: 25,
    y: 52,
    goal: "收集学生作品、课堂表现和任务成果，开展表现性评价。",
    task: "依据评价量规评价 SWOT 矩阵、决策建议和学习反思。",
    output: "学习成果归档与评价记录。",
    rubric: "评价证据是否完整，评分依据是否清楚，结果是否能反馈学习目标达成。",
    theory: "表现性评价 / 评价量规应用。",
  },
  {
    id: 18,
    title: "学习数据分析与学习困难诊断",
    stage: 3,
    status: "locked",
    x: 40,
    y: 45,
    goal: "基于学习成果、课堂表现和反馈数据诊断学生共性困难。",
    task: "归纳学生在概念边界、证据使用、逻辑分析和决策表达中的问题。",
    output: "学习数据分析与困难诊断报告。",
    rubric: "诊断是否基于数据证据，是否能区分共性问题和个别差异。",
    theory: "学习分析 / 教学诊断。",
  },
  {
    id: 19,
    title: "差异化反馈、补救教学与拓展支持",
    stage: 3,
    status: "locked",
    x: 55,
    y: 20,
    goal: "针对不同学生的学习困难提供具体反馈和后续支持。",
    task: "设计基础补救、能力提升和拓展迁移三类反馈建议。",
    output: "差异化反馈与补救教学方案。",
    rubric: "反馈是否具体可执行，补救和拓展是否对应真实学习困难。",
    theory: "差异化教学 / 补救教学。",
  },
  {
    id: 20,
    title: "教学反思、资源沉淀与持续改进",
    stage: 3,
    status: "locked",
    x: 88,
    y: 18,
    goal: "形成可复用的教学资产和下一轮课程改进方案。",
    task: "基于目标、活动、评价和学习数据完成教学反思，沉淀资源并提出改进措施。",
    output: "教学反思报告与资源沉淀清单。",
    rubric: "反思是否基于证据，资源是否可复用，改进措施是否具体可追踪。",
    theory: "反思性教学 / 持续改进闭环。",
  },
];

const routeStageDefinitions = [
  {
    id: 1,
    title: "课前教学设计与准备",
    copy: "完成教学情境分析、学情诊断、目标设计、内容重构、资源开发和课前诊断。",
  },
  {
    id: 2,
    title: "课中教学实施与调控",
    copy: "围绕问题情境、概念支架、案例探究、协作学习、课堂对话和形成性评价推进课堂实施。",
  },
  {
    id: 3,
    title: "课后评价反馈与持续改进",
    copy: "基于学习成果和学习数据开展表现性评价、困难诊断、差异化反馈和资源沉淀。",
  },
];

const routeStatusLabels = {
  completed: "已完成",
  current: "进行中",
  available: "可进入",
  locked: "待解锁",
};

const routeStatusTone = {
  completed: "route-stat-completed",
  current: "route-stat-current",
  available: "route-stat-available",
  locked: "route-stat-locked",
};

let selectedRouteNodeId = 6;
let routeRubricExpanded = false;
let routeNodeCardOpen = false;
let routeNodeCardMode = "explain";
let routeNodeRecommendationMessage = "";

function getRouteNode(nodeId = selectedRouteNodeId) {
  return routeTrainingNodes.find((node) => node.id === Number(nodeId)) || routeTrainingNodes.find((node) => node.status === "current") || routeTrainingNodes[0];
}

function getRouteNodeInputRequirements(node) {
  if (Number(node?.stage) === 2) {
    return ["课前诊断结果与学生疑问", "案例材料、课堂时间与分组约束", "课堂组织方式、评价任务与教师观察点"];
  }
  if (Number(node?.stage) === 3) {
    return ["学生作品、作业与课堂产出", "泛雅模拟数据、课堂观察与评价记录", "教师反思、学生反馈与可复用资源"];
  }
  return ["课程大纲与本次课章节定位", "学情资料与学习起点诊断", "课程材料、案例资料与平台数据边界"];
}

function getRouteNodeRubricDimensionLabels(stepId) {
  const rubric = getTrainingStepRubric(stepId);
  return (rubric?.dimensions || [])
    .map((dimension) => dimension.label || dimension.shortLabel)
    .filter(Boolean)
    .slice(0, 4);
}

function renderRouteNodeInputList(node) {
  return `
    <ul class="route-node-input-list">
      ${getRouteNodeInputRequirements(node)
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("")}
    </ul>
  `;
}

function renderRouteNodeQualification(node, stepId) {
  const dimensions = getRouteNodeRubricDimensionLabels(stepId);
  return `
    <p>${escapeHtml(node.rubric)}</p>
    ${
      dimensions.length
        ? `<div class="route-node-dimension-tags">${dimensions.map((dimension) => `<span>${escapeHtml(dimension)}</span>`).join("")}</div>`
        : ""
    }
  `;
}

function initTeachingNavigationPage() {
  if (!$("#teachingRouteMapNodes") || !$("#teachingNodeDetail")) return;
  loadTrainingState();
  selectedRouteNodeId = Number(trainingState.currentStepId || 1);
  renderTeachingNavigationPage();
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-training-modal]")) closeTrainingRouteModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeTrainingRouteModal();
      closeRouteNodeCard();
    }
  });
}

function renderTeachingNavigationPage() {
  renderTeachingHeroStatus();
  renderStageOverview();
  renderNewTeacherMap();
  renderNodeDetailPanel();
  renderProgressSummary();
}

function renderTeachingHeroStatus() {
  if (!trainingState) loadTrainingState();
  const completed = trainingState.completedStepIds.length;
  const currentStepId = clamp(Number(trainingState.currentStepId || 1), 1, trainingSteps.length);
  const current = getRouteNode(currentStepId);
  const progress = $("#teachingRouteProgress");
  const stage = $("#teachingRouteStage");
  const task = $("#teachingRouteNextTask");
  if (progress) progress.textContent = `${Math.min(Math.max(currentStepId, completed), routeTrainingNodes.length)} / ${routeTrainingNodes.length}`;
  if (stage) stage.textContent = getRouteCurrentPhaseLabel(current);
  if (task) task.textContent = current.task;
}

function getRouteStageTitle(stageId) {
  return routeStageDefinitions.find((stage) => stage.id === Number(stageId))?.title || "教学训练";
}

function getRouteCurrentPhaseLabel(node) {
  if (!node) return "高校教学全流程训练";
  if (node.id <= 8) return "课前教学设计与准备";
  if (node.id <= 16) return "课中教学实施与调控";
  return "课后评价反馈与持续改进";
}

function getRouteStageStatus(nodes) {
  const statuses = nodes.map((node) => getRouteNodeStatus(node.id));
  if (statuses.every((status) => status === "completed")) return "已完成";
  if (statuses.some((status) => status === "current")) return "进行中";
  if (statuses.some((status) => status === "available")) return "可进入";
  return "待解锁";
}

function hasRouteStepId(list, stepId) {
  return (list || []).map(Number).includes(Number(stepId));
}

function getRouteNodeStatus(stepId) {
  if (!trainingState) loadTrainingState();
  const currentStepId = Number(trainingState.currentStepId || 1);
  if (hasRouteStepId(trainingState.completedStepIds, stepId)) return "completed";
  if (Number(stepId) === currentStepId) return "current";
  if (Number(stepId) <= currentStepId + 2) return "available";
  return "locked";
}

function getRouteSegmentPath(startNode, endNode) {
  const dx = endNode.x - startNode.x;
  const c1x = startNode.x + dx * 0.35;
  const c2x = startNode.x + dx * 0.65;
  const wave = startNode.id % 2 === 0 ? -8 : 8;
  return `M ${startNode.x} ${startNode.y} C ${c1x} ${startNode.y + wave}, ${c2x} ${endNode.y - wave}, ${endNode.x} ${endNode.y}`;
}

function renderRouteMapPaths() {
  const svg = $("#teachingRouteMapSvg");
  if (!svg) return;
  const pairs = routeTrainingNodes.slice(0, -1).map((node, index) => [node, routeTrainingNodes[index + 1]]);
  svg.innerHTML = `
    <defs>
      <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#85a66f" />
        <stop offset="48%" stop-color="#e6ae56" />
        <stop offset="100%" stop-color="#8fb0d4" />
      </linearGradient>
      <filter id="routePathGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="0.75" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    ${pairs
      .map(
        ([startNode, endNode]) => `
          <path
            class="route-path route-path-base"
            d="${getRouteSegmentPath(startNode, endNode)}"
            pathLength="100"
          ></path>
        `,
      )
      .join("")}
    ${pairs
      .map(([startNode, endNode]) => {
        const startStatus = getRouteNodeStatus(startNode.id);
        const endStatus = getRouteNodeStatus(endNode.id);
        const active = startStatus === "completed" || endStatus === "current";
        return `
          <path
            class="route-path ${active ? "route-path-segment-completed" : "route-path-segment-upcoming"}"
            d="${getRouteSegmentPath(startNode, endNode)}"
            pathLength="100"
          ></path>
        `;
      })
      .join("")}
  `;
}

function renderStageOverview() {
  const container = $("#teachingStageOverview");
  if (!container) return;
  container.innerHTML = routeStageDefinitions
    .map((stage) => {
      const nodes = routeTrainingNodes.filter((node) => node.stage === stage.id);
      const completed = nodes.filter((node) => getRouteNodeStatus(node.id) === "completed").length;
      const status = getRouteStageStatus(nodes);
      return `
        <button
          class="teaching-stage-card route-stage-pill stage-status-${status === "已完成" ? "complete" : status === "进行中" ? "current" : status === "可进入" ? "available" : "locked"}"
          type="button"
          data-route-stage-pill="${stage.id}"
          aria-label="查看${escapeHtml(stage.title)}"
        >
          <span class="teaching-stage-index">阶段 ${stage.id}</span>
          <h3>${escapeHtml(stage.title)}</h3>
          <p>${escapeHtml(stage.copy)}</p>
          <div class="teaching-stage-meta">
            <span>${completed} / ${nodes.length} 节点</span>
            <strong>${status}</strong>
          </div>
        </button>
      `;
    })
    .join("");
  $$("[data-route-stage-pill]", container).forEach((button) => {
    button.addEventListener("click", () => selectRouteStagePill(button.dataset.routeStagePill));
  });
}

function selectRouteStagePill(stageId) {
  const firstNode = routeTrainingNodes.find((node) => Number(node.stage) === Number(stageId));
  if (!firstNode) return;
  selectedRouteNodeId = firstNode.id;
  routeRubricExpanded = false;
  routeNodeCardOpen = true;
  routeNodeCardMode = "explain";
  routeNodeRecommendationMessage = "";
  renderTeachingNavigationPage();
  requestAnimationFrame(() => {
    $("#teachingRouteMapNodes")?.scrollIntoView?.({ block: "center", behavior: "smooth" });
    $("#teachingNodeDetail")?.focus?.({ preventScroll: true });
  });
}

function renderNewTeacherMap() {
  const container = $("#teachingRouteMapNodes");
  const statsContainer = $("#teachingRouteMapStats");
  if (!container) return;
  renderRouteMapPaths();
  container.innerHTML = routeTrainingNodes.map((node) => renderMapNode(node)).join("");
  if (statsContainer) {
    const statusOrder = ["completed", "current", "available", "locked"];
    statsContainer.innerHTML = statusOrder
      .map((status) => {
        const count = routeTrainingNodes.filter((node) => getRouteNodeStatus(node.id) === status).length;
        return `
          <div class="route-map-stat ${routeStatusTone[status]}">
            <span>${escapeHtml(routeStatusLabels[status])}</span>
            <strong>${count}</strong>
          </div>
        `;
      })
      .join("");
  }
  $$("[data-route-node]", container).forEach((button) => {
    button.addEventListener("click", () => {
      selectedRouteNodeId = Number(button.dataset.routeNode);
      routeRubricExpanded = false;
      routeNodeCardOpen = true;
      routeNodeCardMode = "explain";
      routeNodeRecommendationMessage = "";
      renderTeachingNavigationPage();
      requestAnimationFrame(() => $("#teachingNodeDetail")?.focus?.({ preventScroll: true }));
    });
  });
}

function renderMapNode(node) {
  const selected = node.id === selectedRouteNodeId;
  const status = getRouteNodeStatus(node.id);
  const statusLabel = routeStatusLabels[status] || status;
  const icon = status === "completed" ? "✓" : status === "locked" ? "锁" : String(node.id);
  return `
    <button
      class="route-node route-node-${status} ${selected ? "is-selected" : ""}"
      type="button"
      style="left:${node.x}%; top:${node.y}%"
      data-route-node="${node.id}"
      data-route-status="${status}"
      aria-label="${String(node.id).padStart(2, "0")} ${escapeHtml(node.title)}：${escapeHtml(statusLabel)}"
    >
      <span class="route-node-orb">${icon}</span>
      <span class="route-node-title">${String(node.id).padStart(2, "0")} ${escapeHtml(node.title)}</span>
      <span class="route-node-tooltip" role="tooltip">
        <strong>${String(node.id).padStart(2, "0")} ${escapeHtml(node.title)}</strong>
        <em>${escapeHtml(statusLabel)}</em>
      </span>
    </button>
  `;
}

function renderNodeDetailPanel() {
  const container = $("#teachingNodeDetail");
  if (!container) return;
  const panel = container.closest(".route-detail-card");
  if (!routeNodeCardOpen) {
    container.innerHTML = "";
    panel?.classList.remove("is-open", "is-expanded", "is-explain-mode", "is-training-mode", "is-locked-node");
    panel?.setAttribute("aria-hidden", "true");
    return;
  }

  if (!trainingState) loadTrainingState();
  const stepId = Number(selectedRouteNodeId);
  const node = getRouteNode(stepId);
  const step = getContextualTrainingStep(getTrainingStep(stepId));
  const choice = getChoice(stepId);
  const selectedOptionId = trainingState.currentSelections?.[String(stepId)] || choice.primary || "";
  const preview = selectedOptionId
    ? createStepPreview(stepId, selectedOptionId, "training")
    : createStepPreview(stepId, "", "training");
  const score = preview.score || createPendingStepRubricScore(step);
  const analysis = preview.analysis;
  const status = getRouteNodeStatus(stepId);
  const statusLabel = routeStatusLabels[status] || status;
  const scoreMeta = getTrainingSidebarScoreMeta(stepId);
  const isConfirmed = Boolean(trainingState.stepResults?.[String(stepId)]);
  const isLocked = status === "locked";
  const isTrainingMode = routeNodeCardMode === "training" && !isLocked;
  if (isLocked && routeNodeCardMode === "training") routeNodeCardMode = "explain";
  container.setAttribute("tabindex", "-1");
  panel?.classList.add("is-open");
  panel?.classList.toggle("is-expanded", isTrainingMode);
  panel?.classList.toggle("is-explain-mode", !isTrainingMode);
  panel?.classList.toggle("is-training-mode", isTrainingMode);
  panel?.classList.toggle("is-locked-node", isLocked);
  panel?.setAttribute("aria-hidden", "false");

  const commonHeader = `
      <div class="route-detail-kicker">
        <span>节点 ${String(stepId).padStart(2, "0")}</span>
        <div class="route-popover-title-actions">
          <strong class="route-detail-status status-${status}">${escapeHtml(statusLabel)}</strong>
          <button class="route-popover-close" data-route-action="close-card" type="button" aria-label="关闭节点任务卡">×</button>
        </div>
      </div>
      <header class="route-workbench-head">
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(getRouteStageTitle(node.stage))}</p>
        <div class="route-core-question">
          <span>核心问题</span>
          <strong>${escapeHtml(step.coreQuestion)}</strong>
        </div>
        <div class="route-workbench-meta">
          <span>地图任务：${escapeHtml(node.title)}</span>
          <span>当前评分：${escapeHtml(scoreMeta.label)}</span>
          ${isConfirmed ? `<span>已确认结果</span>` : `<span>尚未确认</span>`}
        </div>
      </header>`;

  if (!isTrainingMode) {
    container.innerHTML = `
      <article class="route-node-detail-card route-workbench-card route-node-summary-card route-node-explain-card" data-route-workbench-step="${stepId}">
        ${commonHeader}
        ${
          routeNodeRecommendationMessage
            ? `<div class="route-next-recommendation" role="status">${escapeHtml(routeNodeRecommendationMessage)}</div>`
            : ""
        }
        <section class="route-workbench-block route-explain-workbench" aria-labelledby="route-explain-title-${stepId}">
          <div class="route-block-head">
            <div>
              <p class="eyebrow">Before training</p>
              <h4 id="route-explain-title-${stepId}">开始前先理解这个环节</h4>
            </div>
          </div>
          <div class="route-explain-grid">
            <article>
              <span>为什么存在</span>
              <p>${escapeHtml(node.goal)}</p>
            </article>
            <article>
              <span>需要输入什么</span>
              ${renderRouteNodeInputList(node)}
            </article>
            <article>
              <span>生成什么</span>
              <p>${escapeHtml(node.output)}</p>
            </article>
            <article>
              <span>如何合格</span>
              ${renderRouteNodeQualification(node, stepId)}
            </article>
          </div>
          <div class="route-detail-actions route-popover-summary-actions">
            <button class="primary-action" data-route-action="start-training" type="button" ${isLocked ? "disabled aria-disabled=\"true\"" : ""}>
              ${isLocked ? "完成前序节点后开始训练" : "开始本环节训练"}
            </button>
          </div>
          ${
            isLocked
              ? `<p class="route-locked-hint">该节点仍可预览说明，但需要先完成前序关卡，才能进入本环节训练流程。</p>`
              : ""
          }
        </section>
      </article>
    `;
    $("[data-route-action='close-card']", container)?.addEventListener("click", closeRouteNodeCard);
    $("[data-route-action='start-training']", container)?.addEventListener("click", startRouteNodeTraining);
    return;
  }

  container.innerHTML = `
    <article class="route-node-detail-card route-workbench-card route-node-expanded-card" data-route-workbench-step="${stepId}">
      ${commonHeader}

      <section class="route-workbench-block route-option-workbench" aria-labelledby="route-option-title-${stepId}">
        <div class="route-block-head">
          <div>
            <p class="eyebrow">A-F option set</p>
            <h4 id="route-option-title-${stepId}">方案选择区</h4>
          </div>
          <span>${selectedOptionId ? `主方案 ${escapeHtml(selectedOptionId)}` : "请选择主方案"}</span>
        </div>
        ${renderTrainingOptionCards(step, choice)}
      </section>

      <section class="route-workbench-block route-generated-workbench" aria-labelledby="route-generated-title-${stepId}">
        <div class="route-block-head">
          <div>
            <p class="eyebrow">AI draft</p>
            <h4 id="route-generated-title-${stepId}">智能生成草稿</h4>
          </div>
          <span>${selectedOptionId ? "已生成" : "待选择主方案"}</span>
        </div>
        ${
          selectedOptionId
            ? `<pre class="route-generated-draft">${escapeHtml(preview.fragment || "当前方案暂未生成草稿。")}</pre>`
            : `<p class="route-generated-placeholder">选择一个主方案后，系统会生成本环节可复制、可审校的训练草稿。</p>`
        }
      </section>

      <section class="route-workbench-block route-insight-workbench" aria-label="即时测评区">
        ${renderSelectionInsightPanel(score, analysis, "training")}
      </section>

      <section class="route-workbench-block route-task-workbench" aria-labelledby="route-task-title-${stepId}">
        <div class="route-block-head">
          <div>
            <p class="eyebrow">Node task</p>
            <h4 id="route-task-title-${stepId}">本节点任务区</h4>
          </div>
        </div>
        <div class="route-task-grid">
          <div><span>教师任务</span><p>${escapeHtml(node.task)}</p></div>
          <div><span>产出物</span><p>${escapeHtml(node.output)}</p></div>
        </div>
        <div class="route-detail-actions">
          <button class="primary-action" data-route-action="confirm" type="button" ${selectedOptionId ? "" : "disabled aria-disabled=\"true\""}>确认本环节</button>
          <button class="secondary-action" data-route-action="collapse-card" type="button">返回环节说明</button>
        </div>
      </section>
    </article>
  `;
  $("[data-route-action='close-card']", container)?.addEventListener("click", closeRouteNodeCard);
  $("[data-route-action='collapse-card']", container)?.addEventListener("click", collapseRouteNodeCard);
  $("[data-route-action='confirm']", container)?.addEventListener("click", confirmRouteStep);
  $$("[data-primary-option]", container).forEach((button) =>
    button.addEventListener("click", () => selectRoutePrimaryOption(button.dataset.primaryOption)),
  );
  $$("[data-secondary-option]", container).forEach((button) =>
    button.addEventListener("click", () => toggleRouteSecondaryOption(button.dataset.secondaryOption)),
  );
  $$("[data-training-option-card]", container).forEach((card) =>
    card.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("button")) return;
      selectRoutePrimaryOption(card.dataset.trainingOptionCard);
    }),
  );
}

function closeRouteNodeCard() {
  routeNodeCardOpen = false;
  routeNodeCardMode = "explain";
  routeNodeRecommendationMessage = "";
  renderNodeDetailPanel();
}

function startRouteNodeTraining() {
  const status = getRouteNodeStatus(selectedRouteNodeId);
  if (status === "locked") {
    showToast("请先完成前序关卡，再开始本环节训练");
    return;
  }
  routeNodeCardOpen = true;
  routeNodeCardMode = "training";
  routeNodeRecommendationMessage = "";
  renderNodeDetailPanel();
  requestAnimationFrame(() => $("#teachingNodeDetail")?.focus?.({ preventScroll: true }));
}

function collapseRouteNodeCard() {
  routeNodeCardOpen = true;
  routeNodeCardMode = "explain";
  renderNodeDetailPanel();
  requestAnimationFrame(() => $("#teachingNodeDetail")?.focus?.({ preventScroll: true }));
}

function selectRoutePrimaryOption(optionId) {
  const stepId = Number(selectedRouteNodeId);
  const step = getTrainingStep(stepId);
  const choice = getChoice(stepId);
  routeNodeCardOpen = true;
  routeNodeCardMode = "training";
  routeNodeRecommendationMessage = "";
  choice.primary = optionId;
  choice.secondary = choice.secondary.filter((id) => id !== optionId);
  trainingState.currentSelections[String(stepId)] = optionId;
  trainingState.currentPreview = createStepPreview(stepId, optionId, "training");
  buildTrainingStepArtifacts(step);
  saveTrainingState();
  renderNodeDetailPanel();
  renderTeachingHeroStatus();
  renderNewTeacherMap();
  renderStageOverview();
  renderProgressSummary();
}

function toggleRouteSecondaryOption(optionId) {
  const stepId = Number(selectedRouteNodeId);
  const step = getTrainingStep(stepId);
  const choice = getChoice(stepId);
  routeNodeCardOpen = true;
  routeNodeCardMode = "training";
  routeNodeRecommendationMessage = "";

  if (choice.primary === optionId) {
    showToast("主方案不能同时作为辅助方案");
    return;
  }

  choice.secondary = choice.secondary.includes(optionId)
    ? choice.secondary.filter((id) => id !== optionId)
    : [...choice.secondary, optionId];

  if (choice.primary) buildTrainingStepArtifacts(step);
  saveTrainingState();
  renderNodeDetailPanel();
}

function confirmRouteStep() {
  const stepId = Number(selectedRouteNodeId);
  const selectedOptionId =
    trainingState.currentSelections?.[String(stepId)] ||
    trainingState.choices?.[String(stepId)]?.primary;

  if (!selectedOptionId) {
    showToast("请先选择一个主方案");
    return;
  }

  const result = createConfirmedTrainingStepResult(stepId, selectedOptionId);
  if (!result) {
    showToast("当前节点还不能确认");
    return;
  }

  trainingState.stepResults[String(stepId)] = result;
  trainingState.currentPreview = createStepPreview(stepId, selectedOptionId, "training");
  trainingState.scores[String(stepId)] = trainingState.currentPreview.score;
  trainingState.analyses[String(stepId)] = trainingState.currentPreview.analysis;
  trainingState.generatedFragments[String(stepId)] = result.fragment;
  if (!hasRouteStepId(trainingState.completedStepIds, stepId)) {
    trainingState.completedStepIds.push(stepId);
  }

  if (result.needsReview && !hasRouteStepId(trainingState.needsReviewStepIds, stepId)) {
    trainingState.needsReviewStepIds.push(stepId);
  } else if (!result.needsReview) {
    trainingState.needsReviewStepIds = trainingState.needsReviewStepIds.filter((id) => Number(id) !== stepId);
  }

  const nextStep = Math.min(stepId + 1, trainingSteps.length);
  const nextNode = getRouteNode(nextStep);
  selectedRouteNodeId = nextStep;
  routeNodeCardOpen = true;
  routeNodeCardMode = "explain";
  routeNodeRecommendationMessage =
    nextStep > stepId
      ? `已确认节点 ${String(stepId).padStart(2, "0")}，推荐下一步进入节点 ${String(nextStep).padStart(2, "0")}：${nextNode.title}。`
      : "已确认全部节点，可进入下方复盘区查看整体完成情况。";
  trainingState.currentStepId = nextStep;
  trainingState.isTrainingCompleted = trainingState.completedStepIds.length >= trainingSteps.length;

  saveTrainingState();
  renderTeachingNavigationPage();
  showToast("已确认本节点，路线已更新");
}

function renderProgressSummary() {
  const container = $("#teachingProgressSummary");
  if (!container) return;
  const current = getRouteNode(trainingState?.currentStepId || selectedRouteNodeId);
  const completed = routeTrainingNodes.filter((node) => getRouteNodeStatus(node.id) === "completed").length;
  const stageTwoNodes = routeTrainingNodes.filter((node) => node.stage === 2);
  const stageTwoReady = stageTwoNodes.filter((node) => {
    const status = getRouteNodeStatus(node.id);
    return status === "completed" || status === "current";
  }).length;
  const reviewReady = routeTrainingNodes.filter((node) => node.stage === 3 && getRouteNodeStatus(node.id) !== "locked").length;
  const summaries = [
    { label: "课前设计完成度", value: `${Math.round((completed / routeTrainingNodes.length) * 100)}%`, copy: "重点检查教学情境、学情诊断、预期学习成果、内容重构和课前支架是否一致。" },
    { label: "课堂实施准备度", value: `${Math.round((stageTwoReady / stageTwoNodes.length) * 100)}%`, copy: "当前需要把问题情境、概念支架、案例探究、协作任务和形成性评价串成可执行课堂流程。" },
    { label: "评价改进闭环完整度", value: `${Math.round((reviewReady / 4) * 100)}%`, copy: "课后还需要完成学习成果评价、数据诊断、差异化反馈和教学反思沉淀。" },
  ];
  container.innerHTML = `
    ${summaries
      .map(
        (item) => `
          <article class="route-progress-card">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.value)}</strong>
            <p>${escapeHtml(item.copy)}</p>
          </article>
        `,
      )
      .join("")}
    <article class="route-progress-card route-next-advice">
      <span>下一步建议</span>
      <strong>${String(current.id).padStart(2, "0")} ${escapeHtml(current.title)}</strong>
      <p>建议继续完善“${escapeHtml(current.title)}”，检查该环节是否同时回应教学目标、学情起点、学习证据和药学管理真实情境。</p>
    </article>
  `;
}

function openTrainingRouteModal(node) {
  const modal = $("#trainingModal");
  const panel = $(".training-route-modal-panel", modal);
  const title = $("#trainingModalTitle");
  const body = $("#trainingModalBody");
  if (!modal || !body || !title) return;
  title.textContent = `${String(node.id).padStart(2, "0")} ${node.title}`;
  body.innerHTML = `
    <dl class="training-route-modal-list">
      <div><dt>当前任务</dt><dd>${escapeHtml(node.task)}</dd></div>
      <div><dt>需要提交的产出物</dt><dd>${escapeHtml(node.output)}</dd></div>
      <div><dt>评价维度</dt><dd>${escapeHtml(node.rubric)}</dd></div>
    </dl>
    <div class="training-route-modal-actions">
      <button class="primary-action" type="button" data-route-modal-start>开始填写任务单</button>
      <button class="secondary-action" type="button" data-close-training-modal>先返回地图</button>
    </div>
  `;
  $("[data-route-modal-start]", body)?.addEventListener("click", () => {
    showToast("当前版本先展示任务要求，后续将接入任务单填写与材料生成。");
  });
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => panel?.focus());
}

function closeTrainingRouteModal() {
  const modal = $("#trainingModal");
  if (!modal?.classList.contains("is-open")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function renderTrainingMapAssets() {
  renderGameMapAssets();
}

function getTrainingSidebarScoreMeta(stepId) {
  const result = trainingState.stepResults?.[String(stepId)];
  const hasReview = trainingState.needsReviewStepIds.includes(Number(stepId));
  if (!result) return { label: "未确认", needsReview: hasReview };
  const dimensionReview = (result.dimensions || []).some((dimension) => Number(dimension.score) < 2.5);
  const total = normalizeAcademicScore(result.stepScore ?? result.score);
  return {
    label: `${formatAcademicScore(total)} · ${getScoreLevel(total)}`,
    needsReview: hasReview || dimensionReview || total < 2.5,
  };
}

function getTrainingStepStatus(stepId) {
  if (stepId === trainingState.currentStepId) return ["当前训练", "current"];
  if (trainingState.needsReviewStepIds.includes(stepId)) return ["需复查", "review"];
  if (trainingState.completedStepIds.includes(stepId)) return ["已完成", "complete"];
  if (stepId > trainingState.currentStepId + 2) return ["已锁定", "locked"];
  return ["待开始", "pending"];
}

function renderTrainingCurrentStep() {
  const container = $("#trainingCurrentStep");
  if (!container) return;
  const step = getContextualTrainingStep(getTrainingStep());
  const choice = getChoice(step.id);
  const selectedOptionId = trainingState.currentSelections?.[String(step.id)] || choice.primary || "";
  const preview = selectedOptionId
    ? createStepPreview(step.id, selectedOptionId, "training")
    : createStepPreview(step.id, "", "training");
  trainingState.currentPreview = preview;
  if (selectedOptionId) {
    trainingState.templates[String(step.id)] = preview.template;
    trainingState.scores[String(step.id)] = preview.score;
    trainingState.analyses[String(step.id)] = preview.analysis;
    trainingState.generatedFragments[String(step.id)] = preview.fragment;
  }
  const displayScore = preview.score || createPendingStepRubricScore(step);
  const displayAnalysis = preview.analysis;
  const fragment = preview.fragment;

  container.innerHTML = `
    <div class="decision-header">
      <span class="stage-tag">${escapeHtml(step.stageTitle)}</span>
      <h2>${String(step.id).padStart(2, "0")}｜${escapeHtml(step.title)}</h2>
      <p class="core-question"><strong>核心问题：</strong>${escapeHtml(step.coreQuestion)}</p>
    </div>
    ${renderTrainingOptionCards(step, choice)}
    ${renderSelectionInsightPanel(displayScore, displayAnalysis, "training")}
    ${
      choice.primary
        ? `
          <div class="decision-actions">
            <button class="primary-action" id="confirmTrainingStep" type="button">确认本环节</button>
            <button class="secondary-action" id="copyTrainingStepDraft" type="button">复制写入文本</button>
          </div>
        `
        : `<p class="muted">请选择一个主方案。点击方案后，将显示本环节专属评价量规、成熟度评分、诊断理由和改进建议。</p>`
    }
  `;

  $$("[data-primary-option]", container).forEach((button) =>
    button.addEventListener("click", () => selectTrainingPrimaryOption(button.dataset.primaryOption)),
  );
  $$("[data-secondary-option]", container).forEach((button) =>
    button.addEventListener("click", () => toggleTrainingSecondaryOption(button.dataset.secondaryOption)),
  );
  $$("[data-training-option-card]", container).forEach((card) =>
    card.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("button")) return;
      selectTrainingPrimaryOption(card.dataset.trainingOptionCard);
    }),
  );
  $("#confirmTrainingStep")?.addEventListener("click", confirmTrainingStep);
  $("#copyTrainingStepDraft")?.addEventListener("click", () => copyText(fragment || ""));
}

function renderTrainingOptionCards(step, choice) {
  return `
    <div class="option-grid">
      ${Object.entries(step.options)
        .map(([id, label]) => {
          const isPrimary = choice.primary === id;
          const isSecondary = choice.secondary.includes(id);
          const isSelected = isPrimary || isSecondary;
          return `
            <article class="option-card ${isPrimary ? "primary-selected selected" : ""} ${isSecondary ? "secondary-selected auxiliary" : ""}" data-training-option-card="${id}">
              <div class="option-topline">
                <span class="option-id">${id}</span>
                <span class="option-score">${escapeHtml(label)}</span>
              </div>
              <h3>${escapeHtml(label)}</h3>
              ${
                isSelected
                  ? `<div class="option-detail"><strong>方案提示</strong><p>${escapeHtml(optionDescription(step, id, label))}</p></div>`
                  : ""
              }
              <div class="option-actions">
                <button class="${isPrimary ? "active" : ""}" data-primary-option="${id}" type="button">设为主方案</button>
                <button class="${isSecondary ? "active" : ""}" data-secondary-option="${id}" ${isPrimary ? "disabled" : ""} type="button">辅助方案</button>
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function optionDescription(step, optionId, label) {
  if (step.practiceContext) {
    const lesson = getPracticeLessonTitle(step.practiceContext);
    const className = step.practiceContext.className || "当前班级";
    if (step.id === 5 && optionId === "B") return `以“${lesson}”中的真实案例组织课堂，帮助${className}把课程概念转化为有证据的情境判断。`;
    if (step.id === 5 && optionId === "C") return `用项目成果推动学生围绕“${lesson}”形成可提交、可评价、可复盘的学习产出。`;
    return `将“${label}”用于“${lesson}”，要求学生结合课程资源、班级学情和平台过程数据形成可观察、可评价的课堂证据。`;
  }
  const context = getTrainingCourseContext();
  const evidence = getTrainingEvidenceText(context);
  if (step.id === 5 && optionId === "B") return `以“${context.scenario}”中的真实案例引入“${context.topic}”，帮助学生把课程概念转化为有证据的情境判断。`;
  if (step.id === 5 && optionId === "C") return `用项目成果推动学生形成一份${getTrainingOutputLabel(context)}和一条优先建议。`;
  return `将“${label}”用于“${context.scenario}”，要求学生围绕${evidence}形成可观察、可评价的课堂证据。`;
}

function selectTrainingPrimaryOption(optionId) {
  const step = getTrainingStep();
  const choice = getChoice(step.id);
  choice.primary = optionId;
  choice.secondary = choice.secondary.filter((id) => id !== optionId);
  trainingState.currentSelections[String(step.id)] = optionId;
  trainingState.currentPreview = createStepPreview(step.id, optionId, "training");
  buildTrainingStepArtifacts(step);
  saveTrainingState();
  renderTrainingWorkflow();
  scrollToSelectionInsight();
}

function toggleTrainingSecondaryOption(optionId) {
  const step = getTrainingStep();
  const choice = getChoice(step.id);
  if (choice.primary === optionId) {
    showToast("主方案不能同时作为辅助方案");
    return;
  }
  choice.secondary = choice.secondary.includes(optionId)
    ? choice.secondary.filter((id) => id !== optionId)
    : [...choice.secondary, optionId];
  if (choice.primary) buildTrainingStepArtifacts(step);
  saveTrainingState();
  renderTrainingWorkflow();
  if (choice.primary) scrollToSelectionInsight();
}

function buildTrainingStepArtifacts(step) {
  if (!trainingState) return;
  const choice = getChoice(step.id);
  if (!choice.primary) return;
  trainingState.currentSelections[String(step.id)] = choice.primary;
  const preview = createStepPreview(step.id, choice.primary, "training");
  trainingState.currentPreview = preview;
  trainingState.templates[String(step.id)] = preview.template;
  trainingState.scores[String(step.id)] = preview.score;
  trainingState.analyses[String(step.id)] = preview.analysis;
  trainingState.generatedFragments[String(step.id)] = preview.fragment;
}

function generateExcellentTemplate(step, primaryLabel, secondaryLabels = []) {
  const context = getTrainingCourseContext();
  const evidence = getTrainingEvidenceText(context);
  const outputLabel = getTrainingOutputLabel(context);
  const isTeachingMethodCaseProject =
    isDefaultTrainingContext(context) && step.id === 5 && primaryLabel === "案例教学" && secondaryLabels.includes("项目式学习");
  if (isTeachingMethodCaseProject) {
    return {
      title: "案例教学 + 项目式学习优秀模板",
      positioning:
        "该模板适用于药事管理本科生学习 SWOT 分析时，将抽象管理工具转化为真实药事管理判断。案例教学用于引入药事管理本科课堂案例，项目式学习用于推动学生形成一页 SWOT 矩阵和一条有证据支撑的管理建议。",
      structure: [
        "呈现药事管理本科课堂案例，包括课程案例事实、政策材料、组织资源、利益相关者和风险边界。",
        "明确 SWOT 四类要素的判断边界，尤其区分内部条件与外部环境。",
        "组织学生小组完成 S、W、O、T 归类，并要求每条判断对应具体证据。",
        "引导学生从 SWOT 矩阵中提出一条优先决策建议。",
        "教师围绕分类错误、证据不足、合规风险和患者安全进行追问。",
        "使用成果评价、过程评价和个人贡献评价组合评分。",
      ],
      example:
        "以“药事管理本科课堂中的 SWOT 分析案例”为例。学生小组需要分析课程案例事实、政策约束、组织资源、利益相关者诉求和监管边界，完成一页 SWOT 矩阵，并提出一条有证据支撑、与情境匹配的管理建议。",
      checklist: [
        "案例是否具有真实药事管理情境？",
        "学生是否能区分内部条件与外部环境？",
        "每条 SWOT 判断是否有证据支撑？",
        "决策建议是否能从 SWOT 矩阵中推导出来？",
        "是否考虑患者安全、合规边界、药师工作量和门店可持续运营？",
        "是否有明确评价量规？",
      ],
      mistakes: [
        "只讲 SWOT 定义，没有药事管理情境。",
        "把“机会”写成主观愿望。",
        "把“药师能力不足”误判为外部威胁。",
        "只让学生展示结论，不检查证据来源。",
        "只评价最终矩阵，不评价分析过程。",
      ],
      copyText:
        "本课建议采用案例教学作为主导方法，并以项目式学习作为辅助方法。教师以“药事管理本科课堂中的 SWOT 分析案例”为主线，组织药事管理本科生围绕课程案例事实、政策材料、组织资源、利益相关者和合规风险进行 SWOT 归类与证据判断。学生最终形成一页 SWOT 矩阵和一条管理建议，教师在关键节点通过追问帮助学生区分内部条件与外部环境，并强化证据意识与合规边界。",
    };
  }

  const secondaryText = secondaryLabels.length ? `，并用${secondaryLabels.join("、")}补强` : "";
  return {
    title: `${primaryLabel}${secondaryLabels.length ? ` + ${secondaryLabels.join(" + ")}` : ""}优秀模板`,
    positioning: `该模板用于“${step.title}”环节，帮助${context.userPersona}把${context.topic}转化为面向${context.teachingObject}的真实课程训练。`,
    structure: [
      `先说明“${step.title}”在一节课设计中的作用。`,
      `围绕${context.scenario}列出学生需要处理的关键证据。`,
      `采用${primaryLabel}${secondaryText}，形成可执行的课堂活动或学习产出。`,
      "明确教师追问、学生提交物、评价证据和时间边界。",
    ],
    example: `在${context.lessonTitle}中，教师采用“${primaryLabel}”处理“${step.title}”问题，引导学生把${evidence}写入学习证据。`,
    checklist: [
      `是否明确授课对象是${context.teachingObject}？`,
      `是否把选择与“${context.scenario}”绑定？`,
      "是否形成学生可提交、教师可评价的产出？",
      `是否控制在 ${context.lessonLength} 内可执行？`,
      "是否保留任务边界和方案可行性？",
    ],
    mistakes: [
      `把${context.userPersona}误写成授课对象。`,
      "只写教学动作，没有写学生产出。",
      `案例情境与“${context.topic}”证据脱节。`,
      "评价标准太笼统，无法支持反馈。",
    ],
    copyText: `本环节建议采用“${primaryLabel}”作为主方案${secondaryLabels.length ? `，辅以“${secondaryLabels.join("、")}”` : ""}。教师围绕${context.scenario}，组织${context.teachingObject}完成与${step.title}相关的证据判断和课堂产出，最终形成${outputLabel}。`,
  };
}

function generateDecisionScore(step, primaryLabel, secondaryLabels = []) {
  return createStepRubricScore(step, primaryLabel, secondaryLabels);
}

function getTrainingStepRubric(stepId) {
  return TRAINING_STEP_RUBRICS.find((rubric) => rubric.stepId === Number(stepId)) || TRAINING_STEP_RUBRICS[0];
}

function buildStepRubricDimensionScores(step, primaryLabel, secondaryLabels = []) {
  const rubric = getTrainingStepRubric(step.id);
  const labels = [primaryLabel, ...secondaryLabels].join("、");
  const context = `${rubric.title}、${rubric.assessmentTitle}、${rubric.assessmentFocus}、${labels}`;
  const has = (patterns) => patterns.some((pattern) => context.includes(pattern));
  const secondaryBoost = Math.min(secondaryLabels.length * 0.08, 0.18);
  const optionQuality = (() => {
    if (has(["职业", "案例", "项目", "问题", "探究", "应用", "评价", "证据", "过程", "反馈", "优化", "SWOT 矩阵"])) return 0.3;
    if (has(["讨论", "小组", "展示", "协作", "反思", "混合"])) return 0.18;
    if (has(["讲授", "测验", "课件", "注意力", "记忆"])) return -0.18;
    return 0.08;
  })();
  return Object.fromEntries(
    rubric.dimensions.map((dimension, index) => {
      const text = `${dimension.label}、${dimension.description}、${dimension.evidenceQuestion}`;
      let value = 2.65 + secondaryBoost + optionQuality + (index % 2 === 0 ? 0.04 : -0.02);
      if (has(["案例", "药学", "慢病", "医保", "合规", "监管", "情境"]) && /情境|案例|药学|真实|证据|主题|专业|问题/.test(text)) value += 0.22;
      if (has(["项目", "任务", "成果", "SWOT 矩阵", "产出"]) && /产出|任务|成果|可收集|目标|展开|证据/.test(text)) value += 0.2;
      if (has(["分层", "支持", "学习者", "过程指导", "反馈"]) && /学生|学习者|差异|支架|支持|误区|先备/.test(text)) value += 0.22;
      if (has(["评价", "量规", "评价量规", "证据", "反馈"]) && /评价|反馈|评价量规|证据|指标|等级/.test(text)) value += 0.24;
      if (has(["讲授", "记忆", "知识传授"]) && /高阶|决策|协作|真实|证据|评价|复盘/.test(text)) value -= 0.22;
      if (step.id === 1) {
        const preset = [3.1, 3.2, 3.2, 3.3][index] || 3.2;
        value = preset + (has(["职业", "问题", "能力"]) ? 0.04 : 0);
      }
      return [dimension.key, normalizeAcademicScore(value)];
    }),
  );
}

function generateTrainingAnalysis(step, primaryLabel, secondaryLabels = []) {
  const context = getTrainingCourseContext();
  const score = trainingState.scores[String(step.id)];
  const lowNames = score?.dimensions.filter((item) => item.score < 2.5).map((item) => item.name) || [];
  const next = trainingSteps.find((item) => item.id === step.id + 1);
  return {
    strengths: [
      `当前选择能把“${step.title}”放回${context.scenario}，避免只讲抽象概念。`,
      `主方案“${primaryLabel}”有助于形成学生可提交、教师可评价的课堂证据。`,
      secondaryLabels.length ? `辅助方案“${secondaryLabels.join("、")}”可以补强活动、资源或评价维度。` : "方案保持简洁，适合新教师第一次模拟训练。",
    ],
    risks: [
      "如果案例材料缺少具体证据，学生可能只能泛泛讨论。",
      "如果教师不强调内部条件与外部环境的边界，SWOT 分类容易混淆。",
      lowNames.length ? `当前低分维度集中在：${lowNames.join("、")}。` : "当前没有明显高风险维度，但仍需教师在真实课程中核验。",
    ],
    suggestions: lowNames.length
      ? lowNames.map((name) => `针对“${name}”，补充可观察产出、真实药学证据和教师追问。`)
      : ["保留当前选择，并在下一环节继续检查目标、活动和评价证据是否一致。"],
    nextReminder: next ? `下一环节是“${next.title}”，请继续检查本环节决策如何影响后续设计。` : "已经到达最后一个环节，请生成训练报告并保存到教学资产。",
    retainAdvice: score && score.total >= 2.5 ? "建议保留当前选择。" : "建议保留方向，但先按低分维度补强后再进入下一环节。",
  };
}

function generateTrainingFragment(step, primaryLabel, secondaryLabels = []) {
  const context = getTrainingCourseContext();
  return `在“${step.title}”环节，训练选择“${primaryLabel}”作为主方案${
    secondaryLabels.length ? `，并以“${secondaryLabels.join("、")}”作为辅助方案` : ""
  }。该设计面向${context.teachingObject}，由${context.userPersona}围绕${context.scenario}组织学生处理${getTrainingEvidenceText(context)}等证据，形成可评价的学习产出，并为后续评价量规、课堂反馈和课程复盘提供依据。`;
}

function normalizeAcademicScore(value) {
  return Number(clamp(Number(value) || 0, 0, 4).toFixed(1));
}

function hasNumericScore(value) {
  return Number.isFinite(Number(value));
}

function formatAcademicScore(value) {
  return normalizeAcademicScore(value).toFixed(1);
}

function getAcademicLevel(value) {
  return getScoreLevel(value);
}

function getScoreLevel(value) {
  const score = normalizeAcademicScore(value);
  if (score < 1.5) return "待建构";
  if (score < 2.5) return "基本成形";
  if (score < 3.5) return "良好";
  return "优秀";
}

function getScoreColor(value) {
  const score = normalizeAcademicScore(value);
  if (score < 1.5) return "#D8A080";
  if (score < 2.5) return "#E8CF98";
  if (score < 3.5) return "#C9915D";
  return "#8C5B45";
}

function calculateStepScore(dimensions) {
  if (!dimensions || !dimensions.length) return 0;
  const scored = dimensions.filter((item) => hasNumericScore(item.score));
  if (!scored.length) return 0;
  return normalizeAcademicScore(scored.reduce((sum, item) => sum + Number(item.score), 0) / scored.length);
}

function getLowestDimension(dimensions) {
  const scored = (dimensions || []).filter((item) => hasNumericScore(item.score));
  if (!scored.length) return null;
  return [...scored].sort((a, b) => Number(a.score) - Number(b.score))[0];
}

function getHighestDimension(dimensions) {
  const scored = (dimensions || []).filter((item) => hasNumericScore(item.score));
  if (!scored.length) return null;
  return [...scored].sort((a, b) => Number(b.score) - Number(a.score))[0];
}

function getAcademicDimensionByKey(key) {
  return ACADEMIC_SCORE_DIMENSIONS.find((dimension) => dimension.key === key);
}

function getStepDimensionDiagnosisReason(dimension, scoreValue, rubric, step, primaryLabel, secondaryLabels = []) {
  const secondaryText = secondaryLabels.length ? `，并辅以“${secondaryLabels.join("、")}”` : "";
  return `本环节选择“${primaryLabel}”${secondaryText}。从“${dimension.label}”看，${dimension.evidenceQuestion} 当前设计已能回应“${dimension.description}”，成熟度为${getScoreLevel(scoreValue)}。`;
}

function createStepRubricScore(step, primaryLabel, secondaryLabels = []) {
  const rubric = getTrainingStepRubric(step.id);
  const scoreMap = buildStepRubricDimensionScores(step, primaryLabel, secondaryLabels);
  const dimensions = rubric.dimensions.map((dimension, index) => {
    const score = normalizeAcademicScore(scoreMap[dimension.key]);
    return {
      ...dimension,
      index: index + 1,
      score,
      scoreLabel: getScoreLevel(score),
      explanation: getStepDimensionDiagnosisReason(dimension, score, rubric, step, primaryLabel, secondaryLabels),
      improvement: dimension.improvementHint,
      shortLabel: dimension.shortLabel || dimension.label,
    };
  });
  const total = normalizeAcademicScore(dimensions.reduce((sum, dimension) => sum + dimension.score, 0) / dimensions.length);
  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const low = dimensions.filter((dimension) => dimension.score < 2.5);
  return {
    type: "step-rubric",
    stepId: step.id,
    title: rubric.title,
    phase: rubric.phase,
    assessmentTitle: rubric.assessmentTitle,
    assessmentFocus: rubric.assessmentFocus,
    metricLabel: "环节成熟度",
    total,
    grade: getScoreLevel(total),
    dimensions,
    finalDimensionMapping: rubric.finalDimensionMapping,
    highestDimension: sorted[0],
    lowestDimension: sorted[sorted.length - 1],
    improvements: low.length
      ? low.map((dimension) => `补强“${dimension.label}”：${dimension.improvementHint}`)
      : [`优先复查“${sorted[sorted.length - 1].label}”：${sorted[sorted.length - 1].improvementHint}`],
    needsReview: low.length > 0,
  };
}

function createPendingStepRubricScore(step) {
  const rubric = getTrainingStepRubric(step.id);
  const dimensions = buildScoredDimensions(rubric, null);
  return {
    type: "step-rubric",
    pending: true,
    stepId: step.id,
    title: rubric.title,
    phase: rubric.phase,
    assessmentTitle: rubric.assessmentTitle,
    assessmentFocus: rubric.assessmentFocus,
    metricLabel: "环节成熟度",
    total: 0,
    grade: "待评分",
    dimensions,
    finalDimensionMapping: rubric.finalDimensionMapping,
    highestDimension: null,
    lowestDimension: null,
    improvements: [`请选择一个主方案后，系统会生成低分维度诊断和改进建议。`],
    needsReview: false,
  };
}

function getDimensionDiagnosisReason(definition, scoreValue, step, primaryLabel, secondaryLabels = [], importedContext = null) {
  const secondaryText = secondaryLabels.length ? `，并辅以“${secondaryLabels.join("、")}”` : "";
  const contextText = importedContext
    ? `结合${importedContext.className}的课程资源、作业薄弱点和学习过程数据`
    : `结合${defaultTrainingCourse.scenario}和${defaultTrainingCourse.teachingObject}`;
  const prefix = `“${step.title}”选择“${primaryLabel}”${secondaryText}，${contextText}`;
  const reasons = {
    alignment: `${prefix}，可以检查目标、活动、成果和评价证据是否围绕同一学习表现展开。`,
    authenticity: `${prefix}，重点判断本课主题是否被放入真实药事管理问题，而不是停留在概念说明。`,
    learner: `${prefix}，关注学生已有基础、常见误区和完成任务时需要的结构化支架。`,
    engagement: `${prefix}，观察学生是否需要分析证据、比较方案、提出判断并表达决策理由。`,
    assessment: `${prefix}，检查课堂产出、评价量规、过程记录和反馈证据是否足以判断学习质量。`,
    reflection: `${prefix}，关注本环节是否能留下可复查数据，并支持课后改进下一轮教学设计。`,
  };
  return `${reasons[definition.key]}当前为${getAcademicLevel(scoreValue)}。`;
}

function getDimensionImprovement(definition, scoreValue) {
  if (scoreValue >= 3.4) return `保持“${definition.shortLabel}”优势，并把判断依据写入训练报告，作为后续泛雅实践的核验标准。`;
  const improvements = {
    alignment: "补写学生最终产出、课堂活动步骤和评价证据之间的对应关系。",
    authenticity: "加入更具体的药事服务、医保支付、门店流程或监管边界证据。",
    learner: "说明学生常见困难，并增加分层材料、过程提示或教师追问支架。",
    engagement: "把听讲或讨论转化为分析、论证、协作产出和决策表达任务。",
    assessment: "明确评价量规指标、过程证据和反馈方式，避免只评价最终结论。",
    reflection: "预留低分维度、学生反馈、课堂观察和作业结果的复盘入口。",
  };
  return improvements[definition.key];
}

function createAcademicScore(step, primaryLabel, secondaryLabels, scoreMap, importedContext = null) {
  const scoreDefinitions = ACADEMIC_SCORE_DIMENSIONS;
  const dimensions = scoreDefinitions.map((definition) => {
    const scoreValue = normalizeAcademicScore(scoreMap[definition.key]);
    return {
      ...definition,
      name: definition.label,
      score: scoreValue,
      scoreLabel: getAcademicLevel(scoreValue),
      explanation: getDimensionDiagnosisReason(definition, scoreValue, step, primaryLabel, secondaryLabels, importedContext),
      improvement: getDimensionImprovement(definition, scoreValue),
    };
  });
  const total = normalizeAcademicScore(dimensions.reduce((sum, item) => sum + item.score * item.weight, 0));
  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const low = dimensions.filter((item) => item.score < 2.5);
  return {
    total,
    grade: getAcademicLevel(total),
    metricLabel: "教学设计质量",
    chartTitle: "质量诊断图",
    evaluationObject: "",
    conclusion: "",
    dimensions,
    highestDimension: sorted[0],
    lowestDimension: sorted[sorted.length - 1],
    improvements: low.length
      ? low.map((item) => `补强“${item.name}”：${item.improvement}`)
      : [`当前没有待建构维度，建议重点复查“${sorted[sorted.length - 1].name}”：${sorted[sorted.length - 1].improvement}`],
  };
}

function getScoreDimensionShortName(nameOrKey) {
  const dimension = ACADEMIC_SCORE_DIMENSIONS.find(
    (item) => item.name === nameOrKey || item.key === nameOrKey,
  );
  return dimension?.shortLabel || nameOrKey;
}

function renderHorizontalBarChart(container, dimensions = []) {
  if (!container) return "";
  const markup = renderHorizontalBarChartMarkup(dimensions);
  container.innerHTML = markup;
  return markup;
}

function renderHorizontalBarChartMarkup(dimensions = []) {
  const items = (dimensions || []).filter((dimension) => dimension && hasNumericScore(dimension.score));
  if (!items.length) return `<p class="chart-empty-state">暂无条形诊断数据。</p>`;
  return items
    .map((dimension) => {
      const score = normalizeAcademicScore(dimension.score);
      const percent = clamp((score / 4) * 100, 0, 100);
      const label = dimension.label || dimension.name || dimension.shortLabel || dimension.key;
      const anchor = buildTheoryAnchor(dimension, score);
      const tooltip = `${label}：${formatAcademicScore(score)} / 4.0，${getScoreLevel(score)}。理论锚点：${anchor.theory}。${dimension.improvementHint || dimension.improvement || ""}`;
      return `
        <div class="bar-chart-row" title="${escapeHtml(tooltip)}" data-tooltip="${escapeHtml(tooltip)}">
          <div class="bar-chart-label">
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml(anchor.theory)}</span>
          </div>
          <div class="bar-chart-track" aria-hidden="true">
            <span class="bar-chart-fill" style="width: ${percent.toFixed(1)}%; background: ${getScoreColor(score)};"></span>
          </div>
          <span class="bar-chart-value">${formatAcademicScore(score)}</span>
        </div>
      `;
    })
    .join("");
}

function getStepShortName(stepId) {
  const names = {
    1: "教学情境",
    2: "学情诊断",
    3: "目标成果",
    4: "内容重构",
    5: "资源案例",
    6: "课前支架",
    7: "诊断评价",
    8: "活动量规",
    9: "问题情境",
    10: "先行组织",
    11: "概念支架",
    12: "案例证据",
    13: "协作任务",
    14: "展示追问",
    15: "形成反馈",
    16: "总结迁移",
    17: "成果评价",
    18: "数据诊断",
    19: "差异支持",
    20: "反思沉淀",
  };
  return names[Number(stepId)] || getTrainingStep(stepId)?.title || `环节 ${stepId}`;
}

function renderStepHeatmap(container, stepResults = []) {
  if (!container) return "";
  const markup = renderStepHeatmapMarkup(stepResults);
  container.innerHTML = markup;
  return markup;
}

function renderStepHeatmapMarkup(stepResults = []) {
  const rows = (stepResults || []).filter(Boolean);
  if (!rows.length) return `<p class="chart-empty-state">暂无 20 环节成熟度数据。</p>`;
  return `
    <div class="heatmap-table" role="table" aria-label="20 环节成熟度热力矩阵">
      ${rows
        .map((result) => {
          const dimensions = result.dimensions || [];
          return `
            <div class="heatmap-row" role="row">
              <div class="heatmap-label" role="rowheader">
                <span>${String(result.stepId).padStart(2, "0")}</span>
                <strong>${escapeHtml(getStepShortName(result.stepId))}</strong>
              </div>
              <div class="heatmap-cells">
                ${dimensions
                  .map((dimension) => {
                    const hasScore = result.completed && hasNumericScore(dimension.score);
                    const score = hasScore ? normalizeAcademicScore(dimension.score) : 0;
                    const alpha = hasScore ? 0.14 + (score / 4) * 0.66 : 0.06;
                    const tooltip = hasScore
                      ? `${result.title || result.workflowTitle}｜${dimension.label || dimension.name}：${formatAcademicScore(score)} / 4.0，${getScoreLevel(score)}。${dimension.improvementHint || dimension.improvement || ""}`
                      : `${result.title || result.workflowTitle}｜${dimension.label || dimension.name}：尚未确认。`;
                    return `
                      <span
                        class="heatmap-cell ${hasScore && score < 2.5 ? "is-low" : ""} ${!hasScore ? "is-empty" : ""}"
                        role="cell"
                        title="${escapeHtml(tooltip)}"
                        data-tooltip="${escapeHtml(tooltip)}"
                        style="background-color: rgba(140, 91, 69, ${alpha.toFixed(2)});"
                      >
                        <b>${escapeHtml(dimension.shortLabel || dimension.label || "")}</b>
                        <em>${hasScore ? formatAcademicScore(score) : "—"}</em>
                      </span>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderStepHeatmapSection(stepResults = []) {
  return `
    <section class="step-heatmap-section">
      <div class="section-head mini">
        <p class="eyebrow">20-step maturity overview</p>
        <h3>20 环节成熟度总览</h3>
        <p>用热力矩阵快速识别低分环节、薄弱维度和优先复查位置。</p>
      </div>
      <div id="trainingHeatmap" class="step-heatmap">
        ${renderStepHeatmapMarkup(stepResults)}
      </div>
      <div class="heatmap-legend" aria-label="热力矩阵图例">
        <span>低</span>
        <i></i>
        <span>高</span>
      </div>
    </section>
  `;
}

function renderBulletChart(container, finalDiagnostic = [], options = {}) {
  if (!container) return "";
  const dimensions = Array.isArray(finalDiagnostic) ? finalDiagnostic : finalDiagnostic.dimensions || [];
  const detailContainer = options.detailContainer || null;
  const scored = dimensions.filter((dimension) => hasNumericScore(dimension.score) && (dimension.sourceCount || dimension.sampleSize || Number(dimension.score) > 0));
  const priority = getLowestDimension(scored.length ? scored : dimensions);
  const selectedKey = options.selectedKey || container.dataset.selectedDimensionKey || priority?.key || dimensions[0]?.key || "";
  container.dataset.selectedDimensionKey = selectedKey;
  container.innerHTML = renderBulletChartMarkup(dimensions, selectedKey);
  const renderDetail = (key) => {
    const selected = dimensions.find((dimension) => dimension.key === key) || priority || dimensions[0];
    if (!selected || !detailContainer) return;
    container.dataset.selectedDimensionKey = selected.key;
    detailContainer.innerHTML = renderFinalDimensionDetail(selected);
    $$(".bullet-row", container).forEach((row) => {
      row.classList.toggle("is-selected", row.dataset.dimensionKey === selected.key);
    });
  };
  $$(".bullet-row, .bullet-detail-button", container).forEach((element) => {
    element.addEventListener("click", (event) => {
      const row = event.target.closest(".bullet-row");
      if (!row) return;
      renderDetail(row.dataset.dimensionKey);
    });
  });
  $$(".bullet-row", container).forEach((row) => {
    row.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      renderDetail(row.dataset.dimensionKey);
    });
  });
  renderDetail(selectedKey);
  return container.innerHTML;
}

function renderBulletChartMarkup(finalDiagnostic = [], selectedKey = "") {
  const dimensions = Array.isArray(finalDiagnostic) ? finalDiagnostic : finalDiagnostic.dimensions || [];
  if (!dimensions.length) return `<p class="chart-empty-state">暂无六维综合诊断数据。</p>`;
  const scored = dimensions.filter((dimension) => hasNumericScore(dimension.score) && (dimension.sourceCount || dimension.sampleSize || Number(dimension.score) > 0));
  const lowest = getLowestDimension(scored.length ? scored : dimensions);
  return dimensions
    .map((dimension) => {
      const score = normalizeAcademicScore(dimension.score);
      const valuePercent = clamp((score / 4) * 100, 0, 100);
      const targetPercent = 87.5;
      const theory = dimension.theory || dimension.theorySources?.[0]?.theory || "理论锚点待补";
      const hasComputedSource = Object.prototype.hasOwnProperty.call(dimension, "sourceCount") || Object.prototype.hasOwnProperty.call(dimension, "sampleSize");
      const sourceCount = dimension.contributingSteps?.length || dimension.sourceCount || dimension.sampleSize || 0;
      const hasValue = !hasComputedSource || sourceCount > 0;
      const level = dimension.level || getScoreLevel(score);
      const advice = dimension.improvementHint || dimension.improvement || "继续完成相关环节，系统会生成更完整的改进建议。";
      const tooltip = [
        dimension.label || dimension.shortLabel || dimension.key,
        `得分：${hasValue ? formatAcademicScore(score) : "待生成"} / 4.0`,
        `等级：${level}`,
        `理论锚点：${theory}`,
        `贡献环节数量：${sourceCount}`,
        `改进建议：${advice}`,
      ].join("\n");
      const isPriority = lowest && dimension.key === lowest.key && sourceCount;
      const isSelected = selectedKey === dimension.key;
      return `
        <div class="bullet-row ${isPriority ? "is-priority" : ""} ${isSelected ? "is-selected" : ""}" data-dimension-key="${escapeHtml(dimension.key)}" data-tooltip="${escapeHtml(tooltip)}" tabindex="0" role="button">
          <div class="bullet-label">
            <strong>${escapeHtml(dimension.label || dimension.shortLabel || dimension.key)}</strong>
            <span>${escapeHtml(theory)}</span>
          </div>
          <div class="bullet-scale" aria-hidden="true">
            <div class="bullet-band low"></div>
            <div class="bullet-band medium"></div>
            <div class="bullet-band good"></div>
            <div class="bullet-band excellent"></div>
            <div class="bullet-value" style="width: ${hasValue ? valuePercent.toFixed(1) : 0}%;"></div>
            <div class="bullet-target" style="left: ${targetPercent}%;"></div>
          </div>
          <div class="bullet-score">
            <strong>${hasValue ? formatAcademicScore(score) : "—"}</strong>
            <span>/ 4.0</span>
          </div>
          <button class="bullet-detail-button" type="button">查看</button>
        </div>
      `;
    })
    .join("");
}

function renderFinalDimensionDetail(dimension) {
  if (!dimension) return `<p class="chart-empty-state">请选择一个维度查看详情。</p>`;
  const score = normalizeAcademicScore(dimension.score);
  const hasComputedSource = Object.prototype.hasOwnProperty.call(dimension, "sourceCount") || Object.prototype.hasOwnProperty.call(dimension, "sampleSize");
  const hasSource = !hasComputedSource || dimension.contributingSteps?.length || dimension.sourceCount || dimension.sampleSize;
  const theoryTags = getTheoryTagsForDimension(dimension);
  const steps = dimension.contributingSteps || [];
  return `
    <article class="dimension-detail-card">
      <div class="dimension-detail-head">
        <div>
          <p class="eyebrow">Selected dimension</p>
          <h3>${escapeHtml(dimension.label || dimension.shortLabel || dimension.key)}</h3>
        </div>
        <span class="dimension-score-badge">${hasSource ? formatAcademicScore(score) : "—"} / 4.0 · ${escapeHtml(dimension.level || "待生成")}</span>
      </div>
      <div class="theory-anchor-strip">
        ${theoryTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("") || `<span>理论锚点待补</span>`}
      </div>
      <p class="dimension-diagnosis">${escapeHtml(dimension.explanation || dimension.description || "确认更多训练环节后，系统会生成该维度的诊断解释。")}</p>
      <div class="contribution-steps">
        <h4>贡献环节</h4>
        <div class="contribution-step-list">
          ${
            steps.length
              ? steps
                  .map(
                    (step) => `
                      <div class="contribution-step">
                        <span>${String(step.stepId).padStart(2, "0")} ${escapeHtml(step.title || "未命名环节")}${step.lowestDimension ? ` · 短板：${escapeHtml(step.lowestDimension)}` : ""}</span>
                        <strong>${formatAcademicScore(step.score)}</strong>
                      </div>
                    `,
                  )
                  .join("")
              : `<p class="chart-empty-state">尚无已确认环节贡献到该维度。</p>`
          }
        </div>
      </div>
      <div class="dimension-action-box">
        <h4>下一步改进</h4>
        <p>${escapeHtml(dimension.improvementHint || dimension.improvement || "继续完成映射到该维度的训练环节，并回看最低贡献环节的改进建议。")}</p>
      </div>
    </article>
  `;
}

function getTheoryTagsForDimension(dimension) {
  const raw = dimension.theorySources?.length
    ? dimension.theorySources.map((item) => item.theory || item.work || item)
    : String(dimension.theory || "")
        .split("/")
        .map((item) => item.trim())
        .filter(Boolean);
  return raw.length ? raw.slice(0, 4) : [dimension.theory || "理论锚点待补"];
}

function renderTheoryAnchorPanel(dimensions = []) {
  const items = (dimensions || []).filter(Boolean);
  if (!items.length) return "";
  return `
    <details class="theory-anchor-panel">
      <summary>展开理论来源与评分锚点</summary>
      <div class="anchor-detail-grid">
        ${items
          .map((dimension) => {
            const anchor = buildTheoryAnchor(dimension, dimension.score);
            return `
              <article class="anchor-detail-card">
                <h4>${escapeHtml(dimension.label || dimension.name || "评价维度")}</h4>
                <div>
                  <small>代表来源</small>
                  <span>${escapeHtml(anchor.work || "来源待补")}</span>
                </div>
                <div>
                  <small>提炼原则</small>
                  <span>${escapeHtml(anchor.principle || "原则待补")}</span>
                </div>
                <div>
                  <small>当前评分锚点</small>
                  <span>${escapeHtml(anchor.currentAnchor || "选择方案后生成当前评分锚点。")}</span>
                </div>
                <div>
                  <small>改进依据</small>
                  <span>${escapeHtml(anchor.improvementHint || "围绕该维度补充可观察证据和可执行教学安排。")}</span>
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    </details>
  `;
}

function renderStepDiagnosticPanel(score, analysis) {
  if (!score || score.type !== "step-rubric") return "";
  const finalMappings = (score.finalDimensionMapping || [])
    .map((key) => getAcademicDimensionByKey(key)?.label || key)
    .filter(Boolean);
  const hasReview = !score.pending && score.dimensions.some((dimension) => Number(dimension.score) < 2.5);
  const lowest = score.lowestDimension || getLowestDimension(score.dimensions);
  return `
    <section class="step-diagnostic-panel" id="selectionInsightPanel" aria-live="polite">
      <div class="step-diagnostic-header">
        <p class="eyebrow">环节专属评价量规</p>
        <h3>${escapeHtml(score.assessmentTitle)}</h3>
        <p>${escapeHtml(score.assessmentFocus)}</p>
      </div>
      <div class="step-bar-dashboard">
        <article class="step-bar-card">
          <div class="step-chart-head">
            <div>
              <h4>本环节成熟度条形诊断</h4>
              <p>仅反映当前环节内部 4 个评价维度，不代表整节课最终质量诊断。</p>
            </div>
            <div class="step-score-chip">
              <span>当前环节平均分</span>
              <strong>${score.pending ? "待评分" : formatAcademicScore(score.total)}</strong>
              <small>${score.pending ? "请选择主方案" : `/ 4.0 · ${escapeHtml(score.grade)}`}</small>
            </div>
          </div>
          <div id="stepBarChart" class="horizontal-bar-chart">
            ${score.pending ? `<p class="chart-empty-state">请选择一个方案后生成本环节 4 维条形诊断。</p>` : renderHorizontalBarChartMarkup(score.dimensions)}
          </div>
          <div class="score-scale-legend" aria-label="评分区间">
            <span><i class="level-low"></i>较低 0–1.5</span>
            <span><i class="level-mid"></i>一般 1.5–2.5</span>
            <span><i class="level-good"></i>良好 2.5–3.5</span>
            <span><i class="level-excellent"></i>优秀 3.5–4.0</span>
          </div>
        </article>
        <article class="step-priority-card">
          <p class="card-kicker">Priority improvement</p>
          <h4>${escapeHtml(lowest ? `优先改进维度：${lowest.label}` : "优先改进维度：待评分")}</h4>
          <p>${escapeHtml(
            score.pending
              ? "当前为评价量规预览态。选择主方案后，系统会刷新 4 维成熟度条形诊断、低分维度诊断和改进建议。"
              : lowest
              ? lowest.improvementHint || lowest.improvement
              : analysis?.retainAdvice || "当前选择可保留。",
          )}</p>
        </article>
      </div>
      <div class="step-rubric-grid">
        ${score.dimensions
          .map((dimension) => {
            const anchor = buildTheoryAnchor(dimension, dimension.score);
            return `
              <article class="step-rubric-card ${!score.pending && Number(dimension.score) < 2.5 ? "needs-review" : ""}">
                <div class="rubric-head">
                  <h4>${escapeHtml(dimension.label)}</h4>
                  <span class="score-pill">${score.pending ? "待评分" : formatAcademicScore(dimension.score)}</span>
                </div>
                <div class="theory-line">
                  <span class="theory-anchor-tag">${escapeHtml(anchor.theory)}</span>
                  <button class="source-toggle" type="button" data-theory-anchor-toggle>查看来源</button>
                </div>
                <p class="score-rationale">${escapeHtml(
                  score.pending
                    ? "请选择一个主方案后生成当前维度诊断。"
                    : dimension.rationale || dimension.explanation || "当前方案已生成该维度诊断。",
                )}</p>
                <p class="improvement-hint">${escapeHtml(
                  score.pending
                    ? "建议先选择 A-F 方案，再查看该维度的理论锚点和评分依据。"
                    : dimension.improvementHint || dimension.improvement || "围绕该维度补充可观察证据和可执行安排。",
                )}</p>
              </article>
            `;
          })
          .join("")}
      </div>
      ${renderTheoryAnchorPanel(score.dimensions)}
      <div class="step-diagnostic-footer">
        <span>本环节结果将计入最终维度：${escapeHtml(finalMappings.join("、") || "待配置")}</span>
        ${hasReview ? `<strong>建议复查：存在低于 2.5 的评价量规维度。</strong>` : `<strong>${escapeHtml(analysis?.retainAdvice || "当前选择可保留。")}</strong>`}
      </div>
    </section>
  `;
}

function renderSelectionInsightPanel(score, analysis, mode = "training") {
  if (!score || !analysis) return "";
  if (score.type === "step-rubric") return renderStepDiagnosticPanel(score, analysis);
  const title = mode === "practice" ? "真实课程方案评估" : "训练方案即时评估";
  const highest = score.highestDimension || [...(score.dimensions || [])].sort((a, b) => b.score - a.score)[0];
  const lowest = score.lowestDimension || [...(score.dimensions || [])].sort((a, b) => a.score - b.score)[0];
  return `
    <section class="selection-insight-panel" id="selectionInsightPanel" aria-live="polite">
      <div class="selection-insight-head">
        <div>
          <p class="eyebrow">Decision insight</p>
          <h3>${title}</h3>
        </div>
        <div class="selection-score-badge">
          <strong>${formatAcademicScore(score.total)}</strong>
          <span>${escapeHtml(score.grade)}</span>
        </div>
      </div>
      <div class="diagnostic-dashboard">
        <div class="diagnostic-visual-row">
          <article class="visual-card diagnostic-bullet-card">
            <div class="step-chart-head compact">
              <div>
                <p class="eyebrow">Decision chart</p>
                <h4>${escapeHtml(score.chartTitle || "质量条形诊断")}</h4>
              </div>
            </div>
            <div class="horizontal-bar-chart">
              ${renderHorizontalBarChartMarkup(score.dimensions || [])}
            </div>
          </article>
          <article class="diagnostic-summary-card">
            <p class="eyebrow">Quality diagnosis</p>
            <h4>${escapeHtml(score.metricLabel || "教学设计质量")}：${formatAcademicScore(score.total)} / 4 · ${escapeHtml(score.grade)}</h4>
            <dl>
              <div><dt>最高维度</dt><dd>${escapeHtml(highest?.shortLabel || "")} · ${formatAcademicScore(highest?.score || 0)}</dd></div>
              <div><dt>最低维度</dt><dd>${escapeHtml(lowest?.shortLabel || "")} · ${formatAcademicScore(lowest?.score || 0)}</dd></div>
            </dl>
            ${score.evaluationObject ? `<p class="diagnostic-object"><strong>本环节评价对象</strong>${escapeHtml(score.evaluationObject)}</p>` : ""}
            <div class="diagnostic-procon">
              <div>
                <strong>选择优势</strong>
                <ul>${analysis.strengths.slice(0, 2).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
              </div>
              <div>
                <strong>主要风险</strong>
                <ul>${analysis.risks.slice(0, 2).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
              </div>
            </div>
            <p>${escapeHtml(score.conclusion || `${analysis.retainAdvice} ${analysis.nextReminder}`)}</p>
          </article>
        </div>
        <div class="dimension-diagnosis-section">
          <div class="dimension-diagnosis-head">
            <strong>维度诊断</strong>
            <span>点击每个维度查看原因和下一步改进建议</span>
          </div>
          <div class="dimension-diagnosis-list" aria-label="评分维度解释">
            ${score.dimensions
              .map(
                (dimension) => `
                  <details class="dimension-diagnosis-item" name="dimension-diagnosis-${mode}">
                    <summary>
                      <span class="dimension-summary-main">
                        <strong>${escapeHtml(dimension.shortLabel)}</strong>
                        <small>${escapeHtml(dimension.name)}</small>
                      </span>
                      <b>${formatAcademicScore(dimension.score)} / 4 · ${escapeHtml(dimension.scoreLabel)}</b>
                    </summary>
                    <div class="dimension-diagnosis-popout">
                      <p>${escapeHtml(dimension.explanation)}</p>
                      <em>${escapeHtml(dimension.improvement)}</em>
                    </div>
                  </details>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function scrollToSelectionInsight() {
  requestAnimationFrame(() => {
    $("#selectionInsightPanel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function confirmTrainingStep() {
  const step = getTrainingStep();
  const choice = getChoice(step.id);
  if (!choice.primary) {
    showToast("请先选择一个主方案");
    return;
  }
  const selectedOptionId = trainingState.currentSelections?.[String(step.id)] || choice.primary;
  const result = createConfirmedTrainingStepResult(step.id, selectedOptionId);
  if (!result) {
    showToast("请先选择一个有效方案");
    return;
  }
  trainingState.stepResults[String(step.id)] = result;
  trainingState.currentPreview = createStepPreview(step.id, selectedOptionId, "training");
  trainingState.scores[String(step.id)] = trainingState.currentPreview.score;
  trainingState.analyses[String(step.id)] = trainingState.currentPreview.analysis;
  trainingState.generatedFragments[String(step.id)] = result.fragment;
  if (!trainingState.completedStepIds.includes(step.id)) trainingState.completedStepIds.push(step.id);
  const needsReview = result.needsReview;
  trainingState.needsReviewStepIds = needsReview
    ? Array.from(new Set([...trainingState.needsReviewStepIds, step.id]))
    : trainingState.needsReviewStepIds.filter((id) => id !== step.id);
  trainingState.isTrainingCompleted = trainingState.completedStepIds.length >= trainingSteps.length;
  if (step.id < trainingSteps.length) trainingState.currentStepId = step.id + 1;
  saveTrainingState();
  renderTrainingWorkflow();
  showToast("已确认本环节，训练报告内容已更新");
}

function renderTrainingReportDraft() {
  const container = $("#trainingReportDraft");
  if (!container) return;
  const context = getTrainingCourseContext();
  const confirmed = trainingSteps.filter((step) => trainingState.completedStepIds.includes(step.id));
  const currentPreview = trainingState.currentPreview?.stepId === trainingState.currentStepId
    ? trainingState.currentPreview
    : null;
  const currentResult = trainingState.stepResults?.[String(trainingState.currentStepId)];
  container.innerHTML = `
    <div class="summary-list">
      <div class="summary-item"><strong>训练课程</strong><p>${escapeHtml(context.lessonTitle)}</p></div>
      <div class="summary-item"><strong>授课对象</strong><p>${escapeHtml(context.teachingObject)}</p></div>
      <div class="summary-item"><strong>使用者</strong><p>${escapeHtml(context.userPersona)}</p></div>
      <div class="summary-item"><strong>已确认环节</strong><p>${confirmed.length} / ${trainingSteps.length}</p></div>
      <div class="summary-item"><strong>当前评分</strong><p>${
        currentPreview?.selectedOption
          ? `${formatAcademicScore(currentPreview.stepScore)} 分 · ${currentPreview.level}`
          : currentResult
          ? `${formatAcademicScore(currentResult.stepScore)} 分 · ${currentResult.level}`
          : "选择主方案后生成"
      }</p></div>
      <div class="summary-item"><strong>需复查</strong><p>${trainingState.needsReviewStepIds.length ? trainingState.needsReviewStepIds.map((id) => `${id}. ${getTrainingStep(id).title}`).join("；") : "暂无"}</p></div>
      <button class="primary-action" type="button" id="draftGenerateTrainingReport">生成训练报告</button>
    </div>
    <div class="draft-fragments">
      ${confirmed
        .map((step) => `<article><strong>${step.id}. ${escapeHtml(step.title)}</strong><p>${escapeHtml(trainingState.stepResults?.[String(step.id)]?.fragment || trainingState.generatedFragments[String(step.id)] || "尚未生成文本。")}</p></article>`)
        .join("")}
    </div>
  `;
  $("#draftGenerateTrainingReport")?.addEventListener("click", generateTrainingReport);
}

function generateTrainingReport() {
  if (!trainingState) loadTrainingState();
  const stepResults = getTrainingStepResults();
  const finalDiagnostic = calculateFinalDiagnostic(stepResults);
  const priorityReviewList = getPriorityReviewList(stepResults, 3);
  const markdown = buildTrainingReportMarkdown(stepResults, finalDiagnostic, priorityReviewList);
  const reportViewModel = buildTrainingReportViewModel(stepResults, finalDiagnostic, priorityReviewList, markdown);
  trainingState.stepDiagnostics = stepResults;
  trainingState.finalDiagnostic = finalDiagnostic;
  trainingState.priorityReviewList = priorityReviewList;
  trainingState.trainingReport = markdown;
  trainingState.reportViewModel = reportViewModel;
  trainingState.isTrainingCompleted = trainingState.completedStepIds.length >= trainingSteps.length;
  saveToLocalStorage(TRAINING_REPORT_EXPORT_KEY, trainingState.trainingReport);
  saveToLocalStorage(STEP_DIAGNOSTICS_KEY, stepResults);
  saveToLocalStorage(FINAL_DIAGNOSTIC_KEY, finalDiagnostic);
  saveTrainingState();
  renderTrainingFinalReport();
  showToast("训练报告已生成");
  return trainingState.trainingReport;
}

function courseInfoText() {
  const context = getTrainingCourseContext();
  return [
    `- 课程：${context.courseName}`,
    `- 主题：${context.topic}`,
    `- 场景：${context.scenario}`,
    `- 授课对象：${context.teachingObject}`,
    `- 使用者：${context.userPersona}`,
    `- 课时：${context.lessonLength}`,
    `- 核心任务：${context.coreTask}`,
  ].join("\n");
}

function trainingStepText(stepId) {
  const step = getContextualTrainingStep(getTrainingStep(stepId));
  const result = trainingState.stepResults?.[String(stepId)];
  const fragment = result?.fragment || trainingState.generatedFragments[String(stepId)];
  const score = result ? stepResultToScoreObject(result) : null;
  if (!fragment) {
    return `本环节“${step.title}”尚未确认。建议继续围绕${getTrainingCourseContext().scenario}选择主方案、辅助方案，并生成评价证据后再进入真实课程。`;
  }
  return `${fragment}\n\n${scoreDiagnosisReportText(score)}`;
}

function stepResultToScoreObject(result) {
  if (!result) return null;
  return {
    type: "step-rubric",
    total: result.stepScore ?? result.score,
    grade: result.level,
    metricLabel: "环节成熟度",
    dimensions: result.dimensions || [],
    highestDimension: result.highestDimension,
    lowestDimension: result.lowestDimension,
    diagnosis: result.diagnosis,
    improvementAdvice: result.improvementAdvice,
  };
}

function scoreDiagnosisReportText(score) {
  if (!score) return "教学设计质量诊断：未生成。";
  const highest = score.highestDimension || [...(score.dimensions || [])].sort((a, b) => b.score - a.score)[0];
  const lowest = score.lowestDimension || [...(score.dimensions || [])].sort((a, b) => a.score - b.score)[0];
  const dimensionLines = (score.dimensions || []).flatMap((dimension) => [
    `- ${dimension.name || dimension.label}（${dimension.shortLabel || dimension.label || dimension.name}）：${formatAcademicScore(dimension.score)} / 4，${dimension.scoreLabel}。`,
    `  - 诊断原因：${dimension.explanation}`,
    `  - 下一步改进：${dimension.improvement}`,
  ]);
  return [
    `${score.metricLabel || "教学设计质量"}：${formatAcademicScore(score.total)} / 4，等级：${score.grade}。`,
    ...(score.evaluationObject ? [`本环节评价对象：${score.evaluationObject}`] : []),
    ...(score.conclusion ? [`诊断结论：${score.conclusion}`] : []),
    `最高维度：${highest ? `${highest.name}（${formatAcademicScore(highest.score)} / 4）` : "暂无"}。`,
    `最低维度：${lowest ? `${lowest.name}（${formatAcademicScore(lowest.score)} / 4）` : "暂无"}。`,
    "维度诊断：",
    ...dimensionLines,
  ].join("\n");
}

function getTrainingStepResults() {
  return trainingSteps.map((step) => {
    const rubric = getTrainingStepRubric(step.id);
    const result = trainingState.stepResults?.[String(step.id)];
    const completed = Boolean(result) || trainingState.completedStepIds.includes(step.id);
    const dimensions = result?.dimensions || rubric.dimensions.map((dimension) => ({
      ...dimension,
      score: null,
      scoreLabel: "待评分",
      explanation: "尚未选择并确认本环节方案。",
      rationale: "尚未选择并确认本环节方案。",
      improvement: dimension.improvementHint,
    }));
    const total = result ? normalizeAcademicScore(result.stepScore ?? result.score) : 0;
    const sorted = dimensions.filter((dimension) => hasNumericScore(dimension.score)).sort((a, b) => Number(b.score) - Number(a.score));
    const low = dimensions.filter((dimension) => hasNumericScore(dimension.score) && Number(dimension.score) < 2.5);
    return {
      stepId: step.id,
      title: rubric.title,
      workflowTitle: step.title,
      phase: rubric.phase,
      assessmentTitle: rubric.assessmentTitle,
      assessmentFocus: rubric.assessmentFocus,
      completed: Boolean(result),
      selectedOptionId: result?.selectedOptionId || "",
      selectedOptionTitle: result?.selectedOptionTitle || "",
      optionTitle: result?.optionTitle || "",
      score: total,
      stepScore: total,
      level: result ? getScoreLevel(total) : "待评分",
      dimensions,
      highestDimension: result?.highestDimension || sorted[0],
      lowestDimension: result?.lowestDimension || sorted[sorted.length - 1],
      diagnosis: result?.diagnosis || "",
      improvementAdvice: result?.improvementAdvice || "",
      keyImprovement: result?.improvementAdvice || low[0]?.improvementHint || sorted[sorted.length - 1]?.improvementHint || "继续保持当前设计，并在真实课程中复核可执行性。",
      finalDimensionMapping: rubric.finalDimensionMapping,
      needsReview: Boolean(result) && (low.length > 0 || total < 2.5),
    };
  });
}

function calculateFinalDiagnostic(stepResults) {
  const results = Array.isArray(stepResults) ? stepResults : Object.values(stepResults || {});
  const bucket = Object.fromEntries(FINAL_DIAGNOSTIC_DIMENSIONS.map((dimension) => [dimension.key, []]));
  results
    .filter((result) => result?.completed && hasNumericScore(result.stepScore ?? result.score))
    .forEach((result) => {
      const rubric = getTrainingStepRubric(result.stepId);
      const stepScore = normalizeAcademicScore(result.stepScore ?? result.score);
      (rubric.finalDimensionMapping || result.finalDimensionMapping || []).forEach((dimensionKey) => {
        if (!bucket[dimensionKey]) return;
        bucket[dimensionKey].push({
          stepId: result.stepId,
          title: rubric.title || result.title,
          score: stepScore,
          level: getScoreLevel(stepScore),
          lowestDimension: result.lowestDimension?.label || result.lowestDimension?.name || "",
          improvementAdvice: result.improvementAdvice || result.keyImprovement || result.lowestDimension?.improvementHint || "",
        });
      });
    });
  const dimensions = FINAL_DIAGNOSTIC_DIMENSIONS.map((dimension) => {
    const contributingSteps = bucket[dimension.key] || [];
    const scores = contributingSteps.map((item) => Number(item.score)).filter((value) => Number.isFinite(value));
    const score = scores.length
      ? normalizeAcademicScore(scores.reduce((sum, value) => sum + value, 0) / scores.length)
      : 0;
    const weakestContributingStep = contributingSteps.length
      ? [...contributingSteps].sort((a, b) => Number(a.score) - Number(b.score))[0]
      : null;
    const improvementHint = buildFinalDimensionAdvice(dimension, weakestContributingStep, score, scores.length);
    return {
      ...dimension,
      name: dimension.label,
      score,
      level: scores.length ? getScoreLevel(score) : "待评分",
      scoreLabel: scores.length ? getScoreLevel(score) : "待评分",
      explanation: getFinalDimensionExplanation(dimension, score, scores.length, weakestContributingStep),
      improvement: improvementHint,
      improvementHint,
      contributingSteps,
      weakestContributingStep,
      theorySources: getFinalDimensionTheorySources(dimension),
      sourceCount: scores.length,
      sampleSize: scores.length,
    };
  });
  const weightedScore = normalizeAcademicScore(dimensions.reduce((sum, dimension) => sum + dimension.score * dimension.weight, 0));
  const scoredDimensions = dimensions.filter((dimension) => dimension.sourceCount > 0);
  const sorted = [...(scoredDimensions.length ? scoredDimensions : dimensions)].sort((a, b) => b.score - a.score);
  return {
    weightedScore,
    level: scoredDimensions.length ? getScoreLevel(weightedScore) : "待评分",
    dimensions,
    highestDimension: sorted[0],
    lowestDimension: sorted[sorted.length - 1],
  };
}

function getFinalDimensionExplanation(dimension, score, sourceCount, weakestContributingStep = null) {
  if (!sourceCount) return "尚无已确认环节映射到该维度，生成完整诊断前需要继续完成相关训练环节。";
  const weakestText = weakestContributingStep
    ? ` 当前最低贡献环节为“${String(weakestContributingStep.stepId).padStart(2, "0")}. ${weakestContributingStep.title}”，该环节会影响本维度的解释稳定性。`
    : "";
  return `${dimension.description} 当前由 ${sourceCount} 个已确认环节贡献成熟度，综合表现为${getScoreLevel(score)}。${weakestText}`;
}

function getFinalDimensionImprovement(dimension, score, sourceCount) {
  const context = getTrainingCourseContext();
  if (!sourceCount) return "继续完成映射到该维度的训练环节。";
  if (score >= 3.4) return "保留当前做法，并将优秀模板沉淀为后续真实课程实践的参考。";
  const suggestions = {
    alignment: "优先检查学习目标、课堂任务、学生产出和评价量规是否一一对应。",
    authenticity: `继续补充“${context.scenario}”中的真实角色、关键冲突和课程证据。`,
    learner: "补充学生先备知识、常见误区、分层支架和过程性支持。",
    engagement: "把低阶讲授任务改造成分析、比较、评价和决策表达任务。",
    assessment: "细化评价量规、形成性评价节点和可操作反馈语。",
    reflection: "明确课后要回看哪些平台数据、学生产出和低分维度，并形成修订清单。",
  };
  return suggestions[dimension.key];
}

function buildFinalDimensionAdvice(dimension, weakestContributingStep, score, sourceCount) {
  if (!sourceCount) return "继续完成映射到该维度的训练环节。";
  const base = getFinalDimensionImprovement(dimension, score, sourceCount);
  if (!weakestContributingStep?.improvementAdvice) return base;
  return `${base} 优先回看“${String(weakestContributingStep.stepId).padStart(2, "0")}. ${weakestContributingStep.title}”：${weakestContributingStep.improvementAdvice}`;
}

function getFinalDimensionTheorySources(dimension) {
  const source = THEORY_SOURCE_LIBRARY[dimension.key];
  if (!source) {
    return [{ theory: dimension.theory || "理论来源待补", work: "", author: "", extractedPrinciple: dimension.description || "" }];
  }
  return [{ ...source }];
}

function getPriorityReviewList(stepResults, limit = 3) {
  return [...stepResults]
    .filter((result) => result.completed)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
}

function buildTrainingReportMarkdown(stepResults, finalDiagnostic, priorityReviewList) {
  const context = getTrainingCourseContext();
  const completed = stepResults.filter((result) => result.completed);
  const average = completed.length
    ? normalizeAcademicScore(completed.reduce((sum, result) => sum + result.score, 0) / completed.length)
    : 0;
  const sorted = [...completed].sort((a, b) => b.score - a.score);
  return [
    "# 新教师教学设计训练报告",
    "",
    "## 一、训练概览",
    `- 课程：${context.courseName}`,
    `- 主题：${context.topic}`,
    `- 场景：${context.scenario}`,
    `- 课程主题：${context.lessonTitle}`,
    `- 授课对象：${context.teachingObject}`,
    `- 已完成环节：${completed.length} / ${trainingSteps.length}`,
    `- 报告性质：${completed.length < trainingSteps.length ? "基于当前已确认环节预览，未确认环节不参与六维计算。" : "基于 20 个已确认环节生成。"}`,
    `- 平均环节成熟度：${formatAcademicScore(average)} / 4.0`,
    `- 综合等级：${completed.length ? getScoreLevel(average) : "待评分"}`,
    `- 最高分环节：${sorted[0] ? `${String(sorted[0].stepId).padStart(2, "0")}. ${sorted[0].title}（${formatAcademicScore(sorted[0].score)}）` : "暂无"}`,
    `- 最低分环节：${sorted[sorted.length - 1] ? `${String(sorted[sorted.length - 1].stepId).padStart(2, "0")}. ${sorted[sorted.length - 1].title}（${formatAcademicScore(sorted[sorted.length - 1].score)}）` : "暂无"}`,
    `- 需要优先复查的环节：${priorityReviewList.length ? priorityReviewList.map((item) => `${String(item.stepId).padStart(2, "0")}. ${item.title}`).join("；") : "暂无"}`,
    "",
    "## 二、20 环节成熟度诊断",
    "",
    ...stepResults.flatMap((result) => stepResultMarkdown(result)),
    "## 三、六维教学设计质量综合诊断",
    "",
    ...finalDiagnostic.dimensions.flatMap((dimension, index) => finalDimensionMarkdown(dimension, index)),
    "## 四、优先复查清单",
    "",
    ...(priorityReviewList.length
      ? priorityReviewList.map((result) => `- ${String(result.stepId).padStart(2, "0")}. ${result.title}：${formatAcademicScore(result.score)} / 4.0，${result.keyImprovement}`)
      : ["- 暂无已确认环节需要优先复查。"]),
    "",
    "## 五、下一步教学实践建议",
    "",
    nextPracticeAdviceText(),
    "",
  ].join("\n");
}

function buildTrainingReportViewModel(stepResults, finalDiagnostic, priorityReviewList, markdown) {
  const context = getTrainingCourseContext();
  const completed = (stepResults || []).filter((result) => result.completed);
  const average = completed.length
    ? normalizeAcademicScore(completed.reduce((sum, result) => sum + result.score, 0) / completed.length)
    : 0;
  const sortedByScore = [...completed].sort((a, b) => b.score - a.score);
  const highestStep = sortedByScore[0] || null;
  const lowestStep = sortedByScore[sortedByScore.length - 1] || null;
  const priorityReview = priorityReviewList?.length ? priorityReviewList : getPriorityReviewList(stepResults, 3);
  const shortcoming = getReportShortcoming(completed, finalDiagnostic);
  const stepHighlights = selectReportStepHighlights(completed, priorityReview, highestStep);
  const actionPlan = renderableActionPlan(stepResults, finalDiagnostic, priorityReview);
  return {
    overview: {
      title: "新教师教学设计训练报告",
      course: context.courseName,
      lessonTitle: context.lessonTitle,
      topic: context.topic,
      audience: context.teachingObject,
      scenario: context.scenario,
      completedCount: completed.length,
      totalCount: trainingSteps.length,
      average,
      level: completed.length ? getScoreLevel(average) : "待评分",
      priorityCount: priorityReview.length,
      isPreview: completed.length < trainingSteps.length,
    },
    executiveSummary: {
      highestStep,
      lowestStep,
      priorityReview,
      shortcoming,
    },
    finalDiagnostic,
    heatmapData: stepResults,
    priorityReview,
    stepHighlights,
    actionPlan,
    markdown,
  };
}

function getReportShortcoming(completed, finalDiagnostic) {
  const lowestFinal = finalDiagnostic?.lowestDimension;
  if (lowestFinal?.sourceCount || lowestFinal?.sampleSize) {
    return {
      title: lowestFinal.label || lowestFinal.name,
      detail: lowestFinal.improvement || "建议优先复核该维度对应的训练环节。",
    };
  }
  const counts = new Map();
  completed.forEach((result) => {
    const label = result.lowestDimension?.label || result.lowestDimension?.name;
    if (!label) return;
    counts.set(label, (counts.get(label) || 0) + 1);
  });
  const frequent = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return {
    title: frequent?.[0] || "暂无明确短板",
    detail: frequent ? `该低分维度在已完成环节中出现 ${frequent[1]} 次。` : "确认更多环节后，系统会自动识别突出短板。",
  };
}

function selectReportStepHighlights(completed, priorityReview, highestStep) {
  const ordered = [];
  [...(priorityReview || []), highestStep, ...completed].forEach((result) => {
    if (!result || ordered.some((item) => item.stepId === result.stepId)) return;
    ordered.push(result);
  });
  return ordered.slice(0, 6);
}

function renderableActionPlan(stepResults, finalDiagnostic, priorityReview) {
  const completed = (stepResults || []).filter((result) => result.completed);
  const immediate = (priorityReview || [])
    .map((result) => result.keyImprovement || result.improvementAdvice)
    .filter(Boolean)
    .slice(0, 3);
  const lowestFinalKey = finalDiagnostic?.lowestDimension?.key;
  const nextRoundSteps = (stepResults || [])
    .filter((result) => !result.completed)
    .filter((result) => !lowestFinalKey || (result.finalDimensionMapping || []).includes(lowestFinalKey))
    .slice(0, 3);
  const nextRound = nextRoundSteps.length
    ? nextRoundSteps.map((result) => `优先完成 ${String(result.stepId).padStart(2, "0")}. ${result.title}，用于补足“${finalDiagnostic?.lowestDimension?.label || "当前低分维度"}”。`)
    : ["继续确认未完成环节，并关注低于 2.5 分的评价量规维度。"];
  const lowKeys = new Set((finalDiagnostic?.dimensions || []).filter((dimension) => dimension.score < 2.8 && dimension.sourceCount).map((dimension) => dimension.key));
  const practicePrep = [];
  if (lowKeys.has("assessment")) practicePrep.push("整理学生作业样例、评分标准和反馈语，进入教学实践后优先校准评价证据。");
  if (lowKeys.has("reflection")) practicePrep.push("准备课堂活动记录、测验数据和学生反馈，用于实践页的数据复盘。");
  if (lowKeys.has("learner")) practicePrep.push("补充班级学情、常见误区和分层支架材料，避免真实课程中只按平均水平设计。");
  if (!practicePrep.length) {
    practicePrep.push("进入教学实践前，准备学生作业、测验数据、讨论记录和教师上传材料。");
    practicePrep.push("把已确认环节的优秀模板转化为真实课程的教案、评价量规和课堂任务。");
  }
  return {
    immediate: immediate.length ? immediate : ["先确认至少一个训练环节，系统会基于最低分维度生成立即修改建议。"],
    nextRound,
    practicePrep: practicePrep.slice(0, 3),
    completedCount: completed.length,
  };
}

function stepResultMarkdown(result) {
  const finalMappings = result.finalDimensionMapping.map((key) => getAcademicDimensionByKey(key)?.label || key);
  const dimensionLines = (result.dimensions || []).flatMap((dimension) => {
    const scoreText = hasNumericScore(dimension.score) ? `${formatAcademicScore(dimension.score)} / 4.0，${getScoreLevel(dimension.score)}` : "待评分";
    const anchor = buildTheoryAnchor(dimension, dimension.score);
    return [
      `  - 维度名称：${dimension.label || dimension.name}`,
      `    - 分数：${scoreText}`,
      `    - 理论锚点：${anchor.theory}`,
      `    - 代表来源：${anchor.work || "来源待补"}`,
      `    - 提炼原则：${anchor.principle || "原则待补"}`,
      `    - 当前评分锚点：${anchor.currentAnchor || "尚未选择方案或暂无评分锚点。"}`,
      `    - 当前诊断理由：${dimension.rationale || dimension.explanation || "尚未确认。"}`,
      `    - 改进建议：${dimension.improvementHint || dimension.improvement || "待补充。"}`,
    ];
  });
  return [
    `### ${String(result.stepId).padStart(2, "0")}. ${result.title}`,
    `- 诊断标题：${result.assessmentTitle}`,
    `- 选择方案：${result.selectedOptionId ? `${result.selectedOptionId} ${result.selectedOptionTitle || result.optionTitle}` : "未确认"}`,
    `- 环节成熟度：${result.completed ? `${formatAcademicScore(result.score)} / 4.0` : "待评分"}`,
    `- 等级：${result.level}`,
    `- 主要优势：${result.highestDimension ? `${result.highestDimension.label || result.highestDimension.name}（${formatAcademicScore(result.highestDimension.score)}）` : "待评分"}`,
    `- 主要短板：${result.lowestDimension ? `${result.lowestDimension.label || result.lowestDimension.name}（${formatAcademicScore(result.lowestDimension.score)}）` : "待评分"}`,
    `- 总体诊断：${result.diagnosis || "尚未确认本环节方案。"}`,
    `- 改进建议：${result.keyImprovement}`,
    `- 计入最终维度：${finalMappings.join("、")}`,
    `- 4 个维度评分：`,
    ...dimensionLines,
    "",
  ];
}

function finalDimensionMarkdown(dimension, index) {
  const contributingSteps = dimension.contributingSteps || [];
  return [
    `### ${index + 1}. ${dimension.label}`,
    `- 理论依据：${dimension.theory}`,
    `- 分数：${formatAcademicScore(dimension.score)} / 4.0`,
    `- 等级：${dimension.level}`,
    `- 诊断解释：${dimension.explanation}`,
    `- 贡献环节：${contributingSteps.length ? contributingSteps.map((step) => `${String(step.stepId).padStart(2, "0")}. ${step.title}（${formatAcademicScore(step.score)}）`).join("；") : "暂无已确认贡献环节"}`,
    `- 最低贡献环节：${dimension.weakestContributingStep ? `${String(dimension.weakestContributingStep.stepId).padStart(2, "0")}. ${dimension.weakestContributingStep.title}（${formatAcademicScore(dimension.weakestContributingStep.score)}）` : "暂无"}`,
    `- 改进建议：${dimension.improvementHint || dimension.improvement}`,
    "",
  ];
}

function overallTrainingScoreText() {
  const stepResults = getTrainingStepResults();
  const finalDiagnostic = calculateFinalDiagnostic(stepResults);
  return finalDiagnostic.dimensions
    .map((dimension) => `- ${dimension.label}：${formatAcademicScore(dimension.score)} / 4.0，${dimension.level}。${dimension.improvement}`)
    .join("\n");
}

function nextPracticeAdviceText() {
  const context = getTrainingCourseContext();
  const outputLabel = getTrainingOutputLabel(context);
  return [
    `- 学生作业：优先读取${outputLabel}、案例分析报告和决策建议，核验评价证据效度。`,
    "- 课堂活动记录：用于判断参与覆盖面、互动深度和任务完成过程。",
    "- 测验数据：用于识别先备知识缺口、概念误区和低分知识点。",
    "- 讨论数据：用于分析学生是否能提出证据、比较方案和表达决策理由。",
    "- 学生反馈：用于复盘任务难度、材料可读性和课堂节奏。",
    "- 教师上传材料：用于补足案例证据、政策文件、评价量规和反馈语模板。",
  ].join("\n");
}

function renderFinalDiagnosticSection(finalDiagnostic, options = {}) {
  if (!finalDiagnostic) return "";
  const highest = finalDiagnostic.highestDimension;
  const lowest = finalDiagnostic.lowestDimension;
  const eyebrow = options.eyebrow || "Teaching Design Quality Diagnosis";
  const title = options.title || "六维教学设计质量综合诊断";
  const copy =
    options.copy ||
    "基于 20 环节成熟度结果，汇总目标一致性、情境真实性、学习者支持、高阶认知、评价效度和数据复盘能力。";
  return `
    <section class="final-diagnostic-section">
      <div class="section-head">
        <p class="eyebrow">${escapeHtml(eyebrow)}</p>
        <h2>${escapeHtml(title)}</h2>
        <p class="section-copy">${escapeHtml(copy)}</p>
      </div>
      <div class="final-diagnostic-dashboard">
        ${renderFinalBulletCard(finalDiagnostic, options)}
        <article class="final-score-card">
          <p>综合分</p>
          <strong>${formatAcademicScore(finalDiagnostic.weightedScore)}</strong>
          <span>/ 4.0 · ${escapeHtml(finalDiagnostic.level)}</span>
          <div class="final-insight-list">
            <p>优势维度：${escapeHtml(highest?.label || "暂无")}</p>
            <p>优先改进：${escapeHtml(lowest?.label || "暂无")}</p>
          </div>
        </article>
        <article class="final-dimension-list">
          ${finalDiagnostic.dimensions
            .map(
              (dimension) => `
                <div class="final-dimension-item">
                  <div>
                    <strong>${escapeHtml(dimension.label)}</strong>
                    <span class="diagnostic-theory-tag">${escapeHtml(dimension.theory)}</span>
                  </div>
                  <b>${formatAcademicScore(dimension.score)} / 4.0 · ${escapeHtml(dimension.level)}</b>
                  <p>${escapeHtml(dimension.explanation)}</p>
                  <em>${escapeHtml(dimension.improvement)}</em>
                </div>
              `,
            )
            .join("")}
        </article>
      </div>
    </section>
  `;
}

function renderFinalBulletCard(finalDiagnostic, options = {}) {
  const dimensions = finalDiagnostic.dimensions || [];
  if (!dimensions.length) return `<article class="final-bullet-card"><p class="chart-empty-state">暂无最终诊断数据。</p></article>`;
  const bulletId = options.bulletId || "trainingFinalBulletChart";
  const detailId = options.detailId || "finalDimensionDetail";
  const chartTitle = options.chartTitle || "六维 Bullet Chart";
  return `
    <article class="final-bullet-card visual-card">
      <div class="step-chart-head compact">
        <div>
          <p class="eyebrow">final diagnosis</p>
          <h4>${escapeHtml(chartTitle)}</h4>
        </div>
      </div>
      <div id="${escapeHtml(bulletId)}" class="bullet-chart" aria-label="${escapeHtml(chartTitle)}"></div>
      <div id="${escapeHtml(detailId)}" class="dimension-detail-panel"></div>
    </article>
  `;
}

function renderEvidenceFrameworkPanel() {
  return `
    <section class="evidence-framework-panel compact-framework-panel">
      <p class="eyebrow">Evidence anchors</p>
      <p>本系统将理论来源嵌入每个维度的评分锚点、诊断理由和报告追溯中。完整作者、代表来源、提炼原则和当前评分锚点，可在单环节“展开理论来源与评分锚点”中查看，也会写入导出的 Markdown 报告。</p>
    </section>
  `;
}

function renderTrainingReportDashboard(reportViewModel) {
  if (!reportViewModel) return `<p class="muted">尚未生成训练报告。</p>`;
  return `
    <div class="training-report-dashboard">
      ${renderReportHero(reportViewModel.overview)}
      ${renderExecutiveSummary(reportViewModel)}
      <section class="report-visuals">
        <article class="visual-card final-diagnostic-card">
          <div class="section-head mini">
            <p class="eyebrow">Final diagnostic</p>
            <h3>六维教学设计质量综合诊断</h3>
            <p>基于已确认环节的成熟度映射，展示当前得分、等级区间、优秀目标线与理论锚点。</p>
          </div>
          <div id="trainingFinalBulletChart" class="bullet-chart"></div>
          <div id="finalDimensionDetail" class="dimension-detail-panel"></div>
        </article>

        <article class="visual-card heatmap-card">
          <div class="section-head mini">
            <p class="eyebrow">20-step overview</p>
            <h3>20 环节成熟度总览</h3>
            <p>用热力矩阵快速识别低分环节、薄弱维度和优先复查位置。</p>
          </div>
          <div id="trainingHeatmap" class="step-heatmap"></div>
          <div class="heatmap-legend" aria-label="热力矩阵图例">
            <span>低</span>
            <i></i>
            <span>高</span>
          </div>
        </article>

        <article class="visual-card review-priority-card">
          <div class="section-head mini">
            <p class="eyebrow">Priority review</p>
            <h3>优先复查清单</h3>
            <p>从低分环节中提取最值得先修改的位置。</p>
          </div>
          <div id="priorityReviewList" class="priority-review-list">
            ${renderPriorityReviewList(reportViewModel.priorityReview)}
          </div>
        </article>
      </section>
      ${renderStepHighlights(reportViewModel.stepHighlights)}
      ${renderActionPlan(reportViewModel.actionPlan)}
      ${renderMarkdownPanel(reportViewModel.markdown)}
    </div>
  `;
}

function renderReportHero(overview = {}) {
  return `
    <section class="report-hero">
      <div class="report-hero-main">
        <p class="eyebrow">Training report</p>
        <h2>${escapeHtml(overview.title || "新教师教学设计训练报告")}</h2>
        <p class="report-course-meta">${escapeHtml(overview.lessonTitle || defaultTrainingCourse.lessonTitle)}</p>
        <p class="report-audience-meta">授课对象：${escapeHtml(overview.audience || defaultTrainingCourse.teachingObject)}</p>
        ${overview.isPreview ? `<span class="report-preview-tag">当前为已确认环节预览</span>` : `<span class="report-preview-tag is-complete">20 环节完整报告</span>`}
      </div>
      <div class="report-kpi-grid">
        <article class="report-kpi-card">
          <span>已完成环节</span>
          <strong>${Number(overview.completedCount || 0)} / ${Number(overview.totalCount || trainingSteps.length)}</strong>
        </article>
        <article class="report-kpi-card">
          <span>平均环节成熟度</span>
          <strong>${formatAcademicScore(overview.average || 0)} / 4.0</strong>
        </article>
        <article class="report-kpi-card">
          <span>综合等级</span>
          <strong>${escapeHtml(overview.level || "待评分")}</strong>
        </article>
        <article class="report-kpi-card">
          <span>优先复查数</span>
          <strong>${Number(overview.priorityCount || 0)}</strong>
        </article>
      </div>
    </section>
  `;
}

function renderExecutiveSummary(reportViewModel) {
  const summary = reportViewModel?.executiveSummary || {};
  const highest = summary.highestStep;
  const lowest = summary.lowestStep;
  const priority = summary.priorityReview || [];
  const shortcoming = summary.shortcoming || {};
  return `
    <section class="executive-summary">
      <article class="summary-card">
        <span>最高分环节</span>
        <strong>${highest ? `${String(highest.stepId).padStart(2, "0")}. ${escapeHtml(highest.title)}` : "暂无"}</strong>
        <p>${highest ? `${formatAcademicScore(highest.score)} / 4.0 · ${escapeHtml(highest.level)}` : "确认环节后自动生成。"}</p>
      </article>
      <article class="summary-card">
        <span>最低分环节</span>
        <strong>${lowest ? `${String(lowest.stepId).padStart(2, "0")}. ${escapeHtml(lowest.title)}` : "暂无"}</strong>
        <p>${lowest ? `${formatAcademicScore(lowest.score)} / 4.0 · ${escapeHtml(lowest.level)}` : "确认环节后自动生成。"}</p>
      </article>
      <article class="summary-card">
        <span>优先复查环节</span>
        <strong>${priority.length ? `${priority.length} 个环节` : "暂无"}</strong>
        <p>${priority.length ? priority.map((item) => `${String(item.stepId).padStart(2, "0")}. ${item.title}`).join("；") : "当前还没有可复查的确认结果。"}</p>
      </article>
      <article class="summary-card">
        <span>当前突出短板</span>
        <strong>${escapeHtml(shortcoming.title || "暂无")}</strong>
        <p>${escapeHtml(shortcoming.detail || "确认更多环节后自动识别。")}</p>
      </article>
    </section>
  `;
}

function renderPriorityReviewList(priorityReview = []) {
  if (!priorityReview.length) return `<p class="chart-empty-state">暂无优先复查环节。确认训练环节后，这里会显示最低分位置。</p>`;
  return priorityReview
    .map((result) => {
      const weakness = result.lowestDimension?.label || result.lowestDimension?.name || "待识别";
      const advice = result.keyImprovement || result.improvementAdvice || result.lowestDimension?.improvementHint || "建议复核该环节的低分维度。";
      return `
        <article class="priority-review-item">
          <div>
            <span>${String(result.stepId).padStart(2, "0")}</span>
            <strong>${escapeHtml(result.title)}</strong>
          </div>
          <b>${formatAcademicScore(result.score)} / 4.0</b>
          <p>主要短板：${escapeHtml(weakness)}</p>
          <em>${escapeHtml(advice)}</em>
        </article>
      `;
    })
    .join("");
}

function renderStepHighlights(stepHighlights = []) {
  return `
    <section class="report-step-highlights">
      <div class="section-head mini">
        <p class="eyebrow">Step highlights</p>
        <h3>重点环节诊断</h3>
        <p>优先展示低分环节和代表性高分环节，便于快速复盘。</p>
      </div>
      <div id="stepHighlightGrid" class="step-highlight-grid">
        ${
          stepHighlights.length
            ? stepHighlights.map((result) => renderStepHighlightCard(result)).join("")
            : `<p class="chart-empty-state">暂无重点环节。请先确认训练环节。</p>`
        }
      </div>
    </section>
  `;
}

function renderStepHighlightCard(result) {
  const highest = result.highestDimension;
  const lowest = result.lowestDimension;
  const theoryTags = (result.dimensions || [])
    .map((dimension) => dimension.theorySource?.theory)
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index)
    .slice(0, 2);
  return `
    <article class="step-highlight-card">
      <div class="step-highlight-head">
        <span>${String(result.stepId).padStart(2, "0")}</span>
        <div>
          <h4>${escapeHtml(result.title)}</h4>
          <p>${formatAcademicScore(result.score)} / 4.0 · ${escapeHtml(result.level)}</p>
        </div>
      </div>
      <div class="mini-insight-grid">
        <p><span>最高维度</span><strong>${escapeHtml(highest?.label || highest?.name || "暂无")}</strong></p>
        <p><span>最低维度</span><strong>${escapeHtml(lowest?.label || lowest?.name || "暂无")}</strong></p>
      </div>
      <div class="mini-bar-chart">${renderMiniBarChart(result.dimensions || [])}</div>
      <p class="step-highlight-advice">${escapeHtml(result.keyImprovement || result.improvementAdvice || "继续复核本环节的可执行性。")}</p>
      ${
        theoryTags.length
          ? `<div class="highlight-theory-tags">${theoryTags.map((tag) => `<span class="theory-anchor-tag">${escapeHtml(tag)}</span>`).join("")}</div>`
          : ""
      }
    </article>
  `;
}

function renderMiniBarChart(dimensions = []) {
  if (!dimensions.length) return `<p class="chart-empty-state">暂无维度数据。</p>`;
  return dimensions
    .map((dimension) => {
      const hasScore = hasNumericScore(dimension.score);
      const score = hasScore ? normalizeAcademicScore(dimension.score) : 0;
      const percent = hasScore ? clamp((score / 4) * 100, 0, 100) : 0;
      return `
        <div class="mini-bar-row" title="${escapeHtml(dimension.label || dimension.name || "")}">
          <span>${escapeHtml(dimension.shortLabel || dimension.label || dimension.name || "")}</span>
          <i><b style="width: ${percent.toFixed(1)}%; background: ${hasScore ? getScoreColor(score) : "rgba(222, 211, 198, 0.6)"};"></b></i>
          <em>${hasScore ? formatAcademicScore(score) : "—"}</em>
        </div>
      `;
    })
    .join("");
}

function renderActionPlan(actionPlan = {}) {
  return `
    <section class="action-plan">
      <div class="section-head mini">
        <p class="eyebrow">Action plan</p>
        <h3>下一步行动建议</h3>
        <p>把诊断结果转化为可以立刻执行的备课动作。</p>
      </div>
      <div class="action-grid">
        ${renderActionCard("立即修改", actionPlan.immediate)}
        ${renderActionCard("下一轮训练重点", actionPlan.nextRound)}
        ${renderActionCard("教学实践前准备", actionPlan.practicePrep)}
      </div>
    </section>
  `;
}

function renderActionCard(title, items = []) {
  return `
    <article class="action-card">
      <h4>${escapeHtml(title)}</h4>
      <ul>
        ${(items && items.length ? items : ["暂无建议。"]).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </article>
  `;
}

function renderMarkdownPanel(markdown = "") {
  return `
    <details class="report-markdown-panel">
      <summary>查看原始 Markdown 报告</summary>
      <pre id="trainingFinalReportMarkdown">${escapeHtml(markdown || "尚未生成 Markdown 报告。")}</pre>
    </details>
  `;
}

function renderTrainingFinalReport() {
  const container = $("#trainingFinalReport");
  if (!container) return;
  if (!trainingState.trainingReport) {
    container.innerHTML = `<p class="muted">尚未生成训练报告。请先选择方案并确认环节，或点击“生成训练报告”预览当前训练结果。</p>`;
    return;
  }
  const finalDiagnostic = trainingState.finalDiagnostic || calculateFinalDiagnostic(getTrainingStepResults());
  const stepResults = trainingState.stepDiagnostics || getTrainingStepResults();
  const priorityReviewList = trainingState.priorityReviewList || getPriorityReviewList(stepResults, 3);
  const reportViewModel =
    trainingState.reportViewModel ||
    buildTrainingReportViewModel(stepResults, finalDiagnostic, priorityReviewList, trainingState.trainingReport);
  container.innerHTML = `
    ${renderTrainingReportDashboard(reportViewModel)}
  `;
  renderBulletChart($("#trainingFinalBulletChart", container), reportViewModel.finalDiagnostic.dimensions, {
    detailContainer: $("#finalDimensionDetail", container),
  });
  renderStepHeatmap($("#trainingHeatmap", container), reportViewModel.heatmapData);
}

function saveTrainingReportToAssets() {
  const context = getTrainingCourseContext();
  const report = trainingState.trainingReport || generateTrainingReport();
  const stepDiagnostics = trainingState.stepDiagnostics || getTrainingStepResults();
  const finalDiagnostic = trainingState.finalDiagnostic || calculateFinalDiagnostic(stepDiagnostics);
  const priorityReviewList = trainingState.priorityReviewList || getPriorityReviewList(stepDiagnostics, 3);
  const reportViewModel =
    trainingState.reportViewModel ||
    buildTrainingReportViewModel(stepDiagnostics, finalDiagnostic, priorityReviewList, report);
  const store = loadAssets();
  const item = {
    id: `training-report-${Date.now()}`,
    title: "《新教师教学设计训练报告》",
    type: "新教师训练报告",
    source: "教学导航",
    course: context.courseName,
    updatedAt: new Date().toISOString(),
    tags: ["教学导航", "20 环节训练", context.topic],
    boundary: "来源于教学导航页系统示例课的 20 环节训练，不包含真实泛雅课程数据。",
    summary: `面向新教师的${context.courseName}「${context.topic}」训练报告，包含模板、评分、诊断建议和进入实践建议。`,
    usage: "用于进入泛雅实践前校准教学设计思路。",
    reuse: "可作为下一次生成教案、评价量规、课堂活动和复盘建议的依据。",
    risk: "示例训练不等同于真实班级数据，进入教学实践后需结合授权课程上下文调整。",
    content: report,
    stepDiagnostics,
    finalDiagnostic,
    priorityReviewList,
    reportViewModel,
    rubrics: TRAINING_STEP_RUBRICS,
    relatedFiles: [],
  };
  store.trainingReports = [item, ...(store.trainingReports || [])];
  store.tags = Array.from(new Set([...(store.tags || []), ...item.tags]));
  saveAssets(store);
  showToast("训练报告已保存到教学资产");
}

function resetTrainingState() {
  trainingState = createDefaultTrainingState();
  isTrainingMapTaskSheetOpen = false;
  saveTrainingState();
  renderTrainingWorkflow();
  showToast("训练状态已重置为默认示例");
}

function makeEmptyFanyaAuthState() {
  return {
    isConnected: false,
    authMode: "mock",
    accountLabel: "",
    teacherName: "",
    platform: "泛雅",
    connectedAt: "",
    platformUrl: "",
    sessionId: "",
    tokenPreview: "",
    dataBoundary: "前端模拟课程数据，未调用真实泛雅接口。",
    availableCourses: [],
    selectedCourseId: "",
    currentPracticeTask: "",
  };
}

function makePracticeCourseData(teacherName = "示例教师") {
  const commonTeacher = {
    teacherName,
    teachingYears: "1 年",
    role: "新教师",
    preferredStyle: "偏好案例讨论和结构化模板",
  };
  return [
    {
      id: "pharmacy-management-2026",
      title: "管理学原理 · 2026 春",
      className: "药事管理本科 2024 级",
      currentTopic: "SWOT 分析",
      status: "可进入实践",
      teacherProfile: commonTeacher,
      courseProfile: {
        courseName: "管理学原理",
        semester: "2026 春",
        chapter: "战略分析工具应用",
        lessonTitle: "管理学原理中的 SWOT 分析：药事管理本科课堂案例",
        lessonLength: "1次课 / 2学时",
        syllabusKeywords: ["管理学原理", "SWOT 分析", "药事管理", "组织决策", "证据判断", "合规监管"],
        courseObjectives: [
          "理解 SWOT 分析在管理学组织决策中的应用边界。",
          "能够基于真实业务场景证据完成 SWOT 分类与解释。",
          "能够提出兼顾服务价值、合规要求和运营可行性的优先决策建议。",
        ],
      },
      learnerProfile: {
        studentCount: 48,
        major: "药事管理",
        grade: "2024 级本科生",
        priorKnowledgeLevel: "基础差异较大",
        motivationLevel: "中等，需要情境激发",
        classParticipation: "课堂参与中等",
        commonDifficulties: [
          "容易混淆内部条件与外部环境",
          "把机会写成主观愿望",
          "决策建议缺少证据支撑",
          "对医保支付和合规边界理解不足",
          "SWOT 分类边界不清",
        ],
      },
      resourceProfile: {
        pptCount: 3,
        documentCount: 5,
        videoCount: 1,
        caseCount: 2,
        questionBankCount: 18,
        uploadedMaterials: ["SWOT 分析导入课件", "药事管理课堂案例", "政策材料摘要"],
        missingResources: ["课堂案例证据表"],
      },
      assignmentProfile: {
        recentAssignments: ["管理工具概念测验", "门店经营案例短评"],
        submissionRate: 82,
        averageScore: 76,
        weakPoints: ["SWOT 分类边界不清", "药学证据引用不足", "决策建议可行性弱", "证据引用不足"],
        rubricHistory: ["案例分析评价量规", "课堂展示评价量规"],
      },
      learningAnalytics: {
        previewCompletionRate: 68,
        quizAccuracy: 72,
        discussionParticipation: 54,
        activeStudentsRatio: 61,
        atRiskStudentsRatio: 12,
        commonMisconceptions: [
          "把药师能力不足误判为外部威胁",
          "把政策支持简单写成优势",
          "只列现象，不说明证据来源",
        ],
      },
      dataScope: {
        useTeacherProfile: true,
        useCourseResources: true,
        useClassProfile: true,
        useAssignments: true,
        useLearningAnalytics: true,
        useDiscussionData: true,
        useQuestionBank: true,
      },
    },
    {
      id: "pharmacy-law-2026",
      title: "药事法规 · 2026 春",
      className: "药学 2024 级本科生",
      currentTopic: "药事法规案例讨论",
      status: "可进入实践",
      teacherProfile: commonTeacher,
      courseProfile: {
        courseName: "药事法规",
        semester: "2026 春",
        chapter: "处方流转与合规管理",
        lessonTitle: "处方流转场景中的合规风险识别",
        lessonLength: "1次课 / 2学时",
        syllabusKeywords: ["药事法规", "处方流转", "合规风险", "监管要求"],
        courseObjectives: ["识别药事法规案例中的合规风险。", "用法规证据解释处方流转中的责任边界。"],
      },
      learnerProfile: {
        studentCount: 52,
        major: "药学",
        grade: "2024 级本科生",
        priorKnowledgeLevel: "法规概念基础较弱",
        motivationLevel: "中等",
        classParticipation: "课堂参与偏低",
        commonDifficulties: ["法规条文与真实情境连接不足", "风险责任边界表达不清"],
      },
      resourceProfile: {
        pptCount: 4,
        documentCount: 8,
        videoCount: 0,
        caseCount: 1,
        questionBankCount: 32,
        uploadedMaterials: ["药品管理法节选", "处方流转案例"],
        missingResources: ["最新地方监管案例"],
      },
      assignmentProfile: {
        recentAssignments: ["法规条文测验"],
        submissionRate: 88,
        averageScore: 79,
        weakPoints: ["案例证据引用不足", "合规风险解释不完整"],
        rubricHistory: ["法规案例分析评价量规"],
      },
      learningAnalytics: {
        previewCompletionRate: 64,
        quizAccuracy: 70,
        discussionParticipation: 49,
        activeStudentsRatio: 55,
        atRiskStudentsRatio: 16,
        commonMisconceptions: ["把合规要求写成经验判断", "忽略责任主体差异"],
      },
      dataScope: {
        useTeacherProfile: true,
        useCourseResources: true,
        useClassProfile: true,
        useAssignments: true,
        useLearningAnalytics: true,
        useDiscussionData: true,
        useQuestionBank: true,
      },
    },
    {
      id: "drug-business-2026",
      title: "药品经营管理 · 2026 春",
      className: "药事管理本科 2023 级",
      currentTopic: "药品经营管理任务",
      status: "可进入实践",
      teacherProfile: {
        ...commonTeacher,
        teachingYears: "2 年",
        preferredStyle: "偏好项目产出和经营案例",
      },
      courseProfile: {
        courseName: "药品经营管理",
        semester: "2026 春",
        chapter: "门店运营与供应链管理",
        lessonTitle: "药事管理案例判断任务",
        lessonLength: "1次课 / 2学时",
        syllabusKeywords: ["药品经营", "门店运营", "供应链", "服务流程"],
        courseObjectives: ["分析门店经营问题。", "提出可执行的运营优化建议。"],
      },
      learnerProfile: {
        studentCount: 44,
        major: "药事管理",
        grade: "2023 级本科生",
        priorKnowledgeLevel: "基础较好，需要挑战任务",
        motivationLevel: "较高",
        classParticipation: "课堂参与较高",
        commonDifficulties: ["经营指标与患者服务价值平衡不足", "方案可持续性论证不够"],
      },
      resourceProfile: {
        pptCount: 2,
        documentCount: 4,
        videoCount: 2,
        caseCount: 3,
        questionBankCount: 24,
        uploadedMaterials: ["门店运营案例", "供应链流程图", "会员服务样例"],
        missingResources: [],
      },
      assignmentProfile: {
        recentAssignments: ["门店经营案例报告"],
        submissionRate: 91,
        averageScore: 83,
        weakPoints: ["数据解释深度不足", "风险预案较弱"],
        rubricHistory: ["项目报告评价量规"],
      },
      learningAnalytics: {
        previewCompletionRate: 76,
        quizAccuracy: 81,
        discussionParticipation: 68,
        activeStudentsRatio: 73,
        atRiskStudentsRatio: 8,
        commonMisconceptions: ["把短期销售目标等同于长期服务质量"],
      },
      dataScope: {
        useTeacherProfile: true,
        useCourseResources: true,
        useClassProfile: true,
        useAssignments: true,
        useLearningAnalytics: true,
        useDiscussionData: true,
        useQuestionBank: true,
      },
    },
  ];
}

function normalizeFanyaAuthState(state) {
  if (!state?.isConnected) return state;
  state.authMode ||= "mock";
  state.accountLabel ||= "测试账号";
  state.teacherName ||= "示例教师";
  state.dataBoundary ||= "前端模拟课程数据，未调用真实泛雅接口。";
  state.tokenPreview ||= "mock-fanya-token";
  const fullCourses = makePracticeCourseData(state.teacherName || "示例教师");
  const courseById = Object.fromEntries(fullCourses.map((course) => [course.id, course]));
  state.availableCourses = (state.availableCourses?.length ? state.availableCourses : fullCourses).map((course) => {
    const refreshedCourse = courseById[course.id];
    if (refreshedCourse) return { ...course, ...refreshedCourse };
    return {
      ...fullCourses[0],
      ...course,
      teacherProfile: course.teacherProfile || fullCourses[0].teacherProfile,
      courseProfile: course.courseProfile || fullCourses[0].courseProfile,
      learnerProfile: course.learnerProfile || fullCourses[0].learnerProfile,
      resourceProfile: course.resourceProfile || fullCourses[0].resourceProfile,
      assignmentProfile: course.assignmentProfile || fullCourses[0].assignmentProfile,
      learningAnalytics: course.learningAnalytics || fullCourses[0].learningAnalytics,
      dataScope: course.dataScope || fullCourses[0].dataScope,
    };
  });
  return state;
}

function initPracticePage() {
  if (!$("#fanyaAuthForm")) return;
  fanyaAuthState = {
    ...makeEmptyFanyaAuthState(),
    ...loadFromLocalStorage(FANYA_AUTH_KEY, makeEmptyFanyaAuthState()),
  };
  fanyaAuthState = normalizeFanyaAuthState(fanyaAuthState);
  if (fanyaAuthState.isConnected && fanyaAuthState.selectedCourseId) {
    loadPracticeWorkflowState();
    saveToLocalStorage(FANYA_AUTH_KEY, fanyaAuthState);
  }
  renderFanyaLogin();
  renderAuthorizedCourses();
  renderPracticeWorkspace();

  $("#fanyaAuthForm")?.addEventListener("submit", simulateFanyaAuth);
  $("#useMockFanyaAccount")?.addEventListener("click", useMockFanyaAccount);
  $("#showAuthGuide")?.addEventListener("click", () => {
    const guide = $("#authGuide");
    if (!guide) return;
    guide.hidden = !guide.hidden;
  });
  $("#practiceTaskForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    generatePracticeTask();
  });
  $("#generateFinalPracticePlan")?.addEventListener("click", generateFinalPracticePlan);
  $("#copyFinalPracticePlan")?.addEventListener("click", () => copyText(practiceWorkflowState?.finalPracticePlan || generateFinalPracticePlan()));
  $("#downloadFinalPracticePlan")?.addEventListener("click", () =>
    downloadMarkdown("pharmacopilot-real-course-practice-plan.md", practiceWorkflowState?.finalPracticePlan || generateFinalPracticePlan()),
  );
  $("#saveFinalPracticePlan")?.addEventListener("click", saveFinalPracticePlanToAssets);
  $("#copyFinalPlanToFanya")?.addEventListener("click", () => {
    const plan = practiceWorkflowState?.finalPracticePlan || generateFinalPracticePlan();
    copyText(plan);
    showToast("已生成可复制内容，请粘贴到泛雅课程对应位置。");
  });
  $("#copyToFanya")?.addEventListener("click", () => {
    if (!fanyaAuthState.currentPracticeTask) {
      showToast("请先生成课程任务");
      return;
    }
    copyText(fanyaAuthState.currentPracticeTask);
    showToast("已生成可复制内容，请粘贴到泛雅课程对应位置。");
  });
  $("#savePracticeTask")?.addEventListener("click", savePracticeTaskToAssets);
}

function renderFanyaLogin() {
  const status = $("#fanyaAuthStatus");
  if (!status) return;
  status.innerHTML = fanyaAuthState.isConnected
    ? `
      <article class="detail-card">
        <h3>模拟授权已开启</h3>
        <dl>
          <div><dt>教师</dt><dd>${escapeHtml(fanyaAuthState.teacherName || "示例教师")}</dd></div>
          <div><dt>账号</dt><dd>${escapeHtml(fanyaAuthState.accountLabel || "测试账号")}</dd></div>
          <div><dt>平台</dt><dd>${escapeHtml(fanyaAuthState.platform)}</dd></div>
          <div><dt>平台地址</dt><dd>${escapeHtml(fanyaAuthState.platformUrl || "https://fanya.chaoxing.com")}</dd></div>
          <div><dt>会话</dt><dd>${escapeHtml(fanyaAuthState.tokenPreview || "mock-fanya-token")}</dd></div>
          <div><dt>数据边界</dt><dd>${escapeHtml(fanyaAuthState.dataBoundary || "前端模拟课程数据，未调用真实泛雅接口。")}</dd></div>
          <div><dt>连接时间</dt><dd>${formatDate(fanyaAuthState.connectedAt)}</dd></div>
        </dl>
        <button class="secondary-action reset-auth-button" id="resetFanyaAuth" type="button">重置模拟授权</button>
      </article>
    `
    : `
      <article class="detail-card">
        <h3>尚未模拟授权</h3>
        <p>请填写左侧表单并点击“连接泛雅课程（模拟）”。授权前不会显示课程工作台。</p>
      </article>
    `;
  $("#resetFanyaAuth")?.addEventListener("click", resetFanyaAuth);
}

function useMockFanyaAccount() {
  const accountInput = $("#fanyaAccount");
  const tokenInput = $("#fanyaToken");
  const platformInput = $("#fanyaPlatformUrl");
  if (accountInput) accountInput.value = FANYA_MOCK_ACCOUNT.account;
  if (tokenInput) tokenInput.value = FANYA_MOCK_ACCOUNT.token;
  if (platformInput) platformInput.value = FANYA_MOCK_ACCOUNT.platformUrl;
  simulateFanyaAuth({ preventDefault() {} });
}

function simulateFanyaAuth(event) {
  event.preventDefault();
  const account = $("#fanyaAccount")?.value.trim() || FANYA_MOCK_ACCOUNT.account;
  const providedToken = $("#fanyaToken")?.value.trim() || FANYA_MOCK_ACCOUNT.token;
  const platformUrl = $("#fanyaPlatformUrl")?.value.trim() || "https://fanya.chaoxing.com";
  const teacherName = account === FANYA_MOCK_ACCOUNT.account ? FANYA_MOCK_ACCOUNT.teacherName : makeTeacherNameFromAccount(account);
  const mockSession = makeMockFanyaSession(account || providedToken);
  const availableCourses = makePracticeCourseData(teacherName);
  fanyaAuthState = {
    isConnected: true,
    authMode: "mock",
    accountLabel: maskFanyaAccount(account),
    teacherName,
    platform: "泛雅",
    platformUrl,
    connectedAt: new Date().toISOString(),
    sessionId: mockSession.id,
    tokenPreview: mockSession.tokenPreview,
    dataBoundary: "前端模拟课程数据，未调用真实泛雅接口；不会保存输入的授权码或真实密码。",
    selectedCourseId: "",
    currentPracticeTask: "",
    availableCourses,
  };
  saveToLocalStorage(FANYA_AUTH_KEY, fanyaAuthState);
  renderFanyaLogin();
  renderAuthorizedCourses();
  renderPracticeWorkspace();
  showToast("已开启泛雅模拟授权");
}

function renderAuthorizedCourses() {
  const container = $("#authorizedCourses");
  const section = $("#courseListSection");
  if (!container) return;
  if (!fanyaAuthState.isConnected) {
    if (section) section.hidden = true;
    container.innerHTML = `<article class="notice-card">请先完成上方泛雅模拟授权。未授权状态下不显示真实课程工作台。</article>`;
    return;
  }
  if (section) section.hidden = false;
  container.innerHTML = fanyaAuthState.availableCourses
    .map(
      (course) => `
        <article class="entry-card course-card ${course.id === fanyaAuthState.selectedCourseId ? "is-active" : ""}" data-course-id="${course.id}">
          <span class="entry-index">${course.id === fanyaAuthState.selectedCourseId ? "当前" : "课程"}</span>
          <h3>${escapeHtml(course.title)}</h3>
          <p>班级：${escapeHtml(course.className)}</p>
          ${course.currentTopic ? `<p>当前主题：${escapeHtml(course.currentTopic)}</p>` : ""}
          <p>状态：${escapeHtml(course.status)}</p>
          <button class="card-action" type="button">进入实践</button>
        </article>
      `,
    )
    .join("");
  $$("[data-course-id]", container).forEach((card) => {
    card.addEventListener("click", () => selectFanyaCourse(card.dataset.courseId));
  });
}

function selectFanyaCourse(courseId) {
  fanyaAuthState.selectedCourseId = courseId;
  fanyaAuthState.currentPracticeTask = "";
  saveToLocalStorage(FANYA_AUTH_KEY, fanyaAuthState);
  loadPracticeWorkflowState();
  renderAuthorizedCourses();
  renderPracticeWorkspace();
  $("#practiceWorkspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getSelectedFanyaCourse() {
  if (!fanyaAuthState?.selectedCourseId) return null;
  return fanyaAuthState.availableCourses.find((course) => course.id === fanyaAuthState.selectedCourseId) || null;
}

function renderPracticeWorkspace() {
  const workspace = $("#practiceWorkspace");
  if (!workspace) return;
  workspace.hidden = !fanyaAuthState.isConnected || !fanyaAuthState.selectedCourseId;
  if (!fanyaAuthState.isConnected || !fanyaAuthState.selectedCourseId) return;
  loadPracticeWorkflowState();
  const course = getSelectedFanyaCourse();
  renderImportedDataOverview();
  renderPracticeWorkflow();
  const output = $("#practiceTaskOutput");
  if (output) {
    output.innerHTML = fanyaAuthState.currentPracticeTask
      ? `<pre>${escapeHtml(fanyaAuthState.currentPracticeTask)}</pre>`
      : `<p class="muted">选择课程并生成任务后，这里显示可复制到泛雅课程对应位置的内容。</p>`;
  }
}

function buildPracticeTaskSuggestion(context) {
  const lesson = context.courseProfile.lessonTitle;
  const weakPoints = context.assignmentProfile.weakPoints.slice(0, 2).join("、") || "关键证据表达";
  const objective = context.courseProfile.courseObjectives[0] || "完成本课关键学习目标";
  return `请学生围绕“${lesson}”完成一份小组任务成果：先提取案例或资源中的关键事实，再用课程要求解释判断依据，最后提交一条可执行建议。成果需标注证据来源，并回应“${objective}”。教师重点提醒学生补强${weakPoints}。`;
}

function buildPracticeEvaluationItems(context) {
  const text = getPracticeCourseText(context);
  if (/法规|合规|处方|监管/.test(text)) {
    return [
      "- 合规风险识别准确性：30%",
      "- 法规证据引用质量：30%",
      "- 责任边界与处置建议：25%",
      "- 表达规范与患者安全意识：15%",
    ];
  }
  if (/经营|运营|门店|供应链|服务流程/.test(text)) {
    return [
      "- 运营问题识别准确性：30%",
      "- 数据与案例证据质量：30%",
      "- 优化建议可执行性：25%",
      "- 服务质量与风险意识：15%",
    ];
  }
  return [
    "- 关键问题识别准确性：30%",
    "- 课程证据引用质量：30%",
    "- 学习成果完成质量：25%",
    "- 反思迁移与规范表达：15%",
  ];
}

function generatePracticeTask() {
  const course = getSelectedFanyaCourse();
  if (!course) {
    showToast("请先选择一门课程");
    return "";
  }
  const context = practiceWorkflowState?.importedContext || buildImportedContext(course);
  const type = $("#practiceTaskType")?.value || "课堂任务";
  const need = $("#practiceNeed")?.value.trim() || `请为本周“${context.courseProfile.lessonTitle}”生成小组任务、提交要求和评价标准。`;
  const task = [
    `# ${course.title}｜${type}`,
    "",
    "已生成可复制内容，请粘贴到泛雅课程对应位置。",
    "",
    `- 班级：${course.className}`,
    `- 当前主题：${course.currentTopic || defaultTrainingCourse.topic}`,
    `- 数据来源：泛雅模拟授权课程上下文，不含真实学生个人数据。`,
    `- 学情摘要：预习完成率 ${context.learningAnalytics.previewCompletionRate}%，讨论参与率 ${context.learningAnalytics.discussionParticipation}%，高风险学生比例 ${context.learningAnalytics.atRiskStudentsRatio}%。`,
    "",
    "## 教学任务生成",
    "",
    need,
    "",
    "## 建议发布内容",
    "",
    buildPracticeTaskSuggestion(context),
    "",
    "## 评价材料",
    "",
    ...buildPracticeEvaluationItems(context),
    "",
    "## 教师提醒",
    "",
    "第一版仅模拟生成，请教师根据真实课程安排、班级基础和学校教学规范二次确认。",
  ].join("\n");
  fanyaAuthState.currentPracticeTask = task;
  saveToLocalStorage(FANYA_AUTH_KEY, fanyaAuthState);
  renderPracticeWorkspace();
  showToast("真实课程任务已生成");
  return task;
}

function savePracticeTaskToAssets() {
  if (!fanyaAuthState?.currentPracticeTask) {
    showToast("请先生成课程任务");
    return;
  }
  const course = getSelectedFanyaCourse();
  if (!course) {
    showToast("请先选择一门课程");
    return;
  }
  const store = loadAssets();
  const item = {
    id: `practice-task-${Date.now()}`,
    title: `${course.title}｜泛雅课程任务`,
    type: "泛雅课程任务",
    source: "教学实践",
    course: course.title,
    updatedAt: new Date().toISOString(),
    tags: ["教学实践", "泛雅模拟", "课程任务"],
    boundary: "来源于教学实践页的泛雅模拟授权课程上下文；第一版未读取真实学生个人数据。",
    summary: "用于真实课程发布前复制到泛雅课程对应位置的教学任务、提交要求和评价材料。",
    usage: "可粘贴到泛雅课程任务、作业或课堂活动说明中。",
    reuse: "可作为下一次生成作业反馈模板、评价量规或课程复盘建议的基础。",
    risk: "第一版不会向泛雅写入内容，教师需要人工复制并核验。",
    content: fanyaAuthState.currentPracticeTask,
    relatedFiles: [],
  };
  store.practiceReports = [item, ...(store.practiceReports || [])];
  store.generatedTasks = [item, ...(store.generatedTasks || [])];
  store.tags = Array.from(new Set([...(store.tags || []), ...item.tags]));
  saveAssets(store);
  showToast("实践任务已保存到教学资产");
}

function resetFanyaAuth() {
  fanyaAuthState = makeEmptyFanyaAuthState();
  practiceWorkflowState = null;
  saveToLocalStorage(FANYA_AUTH_KEY, fanyaAuthState);
  renderFanyaLogin();
  renderAuthorizedCourses();
  renderPracticeWorkspace();
  showToast("已重置泛雅模拟授权");
}

function makeEmptyPracticeWorkflowState() {
  return {
    selectedCourseId: "",
    courseSnapshot: null,
    importedContext: null,
    currentStepId: 3,
    currentSelections: {},
    currentPreview: null,
    stepResults: {},
    choices: {},
    templates: {},
    scores: {},
    analyses: {},
    generatedFragments: {},
    completedStepIds: [],
    needsReviewStepIds: [],
    finalPracticePlan: "",
    updatedAt: "",
  };
}

function buildImportedContext(course) {
  return {
    teacherProfile: course.teacherProfile,
    courseProfile: course.courseProfile,
    learnerProfile: course.learnerProfile,
    resourceProfile: course.resourceProfile,
    assignmentProfile: course.assignmentProfile,
    learningAnalytics: course.learningAnalytics,
    dataScope: course.dataScope,
    courseTitle: course.title,
    className: course.className,
    currentTopic: course.currentTopic,
    status: course.status,
    simulatedNotice: "当前为前端模拟导入数据。真实接入后，将由教师授权泛雅账号后读取。",
  };
}

function createPracticeWorkflowStateFromCourse(course) {
  const state = {
    ...makeEmptyPracticeWorkflowState(),
    selectedCourseId: course.id,
    courseSnapshot: course,
    importedContext: buildImportedContext(course),
    currentStepId: 3,
    choices: {
      1: { primary: "E", secondary: [] },
      2: { primary: "C", secondary: ["B"] },
      3: { primary: "C", secondary: ["E"] },
    },
    currentSelections: {
      1: "E",
      2: "C",
      3: "C",
    },
    completedStepIds: [1, 2],
    updatedAt: new Date().toISOString(),
  };
  const previous = practiceWorkflowState;
  practiceWorkflowState = state;
  [1, 2].forEach((stepId) => {
    const result = createConfirmedPracticeStepResult(stepId, state.currentSelections[String(stepId)]);
    if (result) state.stepResults[String(stepId)] = result;
  });
  buildPracticeStepArtifacts(getTrainingStep(3));
  practiceWorkflowState = previous;
  return state;
}

function loadPracticeWorkflowState(forceNew = false) {
  const course = getSelectedFanyaCourse();
  if (!course) {
    practiceWorkflowState = makeEmptyPracticeWorkflowState();
    return practiceWorkflowState;
  }
  const raw = loadFromLocalStorage(PRACTICE_WORKFLOW_KEY, null);
  if (forceNew || !raw || raw.selectedCourseId !== course.id) {
    practiceWorkflowState = createPracticeWorkflowStateFromCourse(course);
    savePracticeWorkflowState();
    return practiceWorkflowState;
  }
  practiceWorkflowState = {
    ...makeEmptyPracticeWorkflowState(),
    ...raw,
    courseSnapshot: course,
    importedContext: buildImportedContext(course),
  };
  practiceWorkflowState.currentStepId = clamp(Number(practiceWorkflowState.currentStepId || 3), 1, trainingSteps.length);
  practiceWorkflowState.currentSelections ||= {};
  practiceWorkflowState.currentPreview ||= null;
  practiceWorkflowState.stepResults ||= {};
  practiceWorkflowState.choices ||= {};
  practiceWorkflowState.templates ||= {};
  practiceWorkflowState.scores ||= {};
  practiceWorkflowState.analyses ||= {};
  practiceWorkflowState.generatedFragments ||= {};
  practiceWorkflowState.completedStepIds ||= [];
  practiceWorkflowState.needsReviewStepIds ||= [];
  Object.entries(practiceWorkflowState.choices).forEach(([stepId, choice]) => {
    if (choice?.primary && !practiceWorkflowState.currentSelections[String(stepId)]) {
      practiceWorkflowState.currentSelections[String(stepId)] = choice.primary;
    }
  });
  Object.entries(practiceWorkflowState.currentSelections).forEach(([stepId, optionId]) => {
    practiceWorkflowState.choices[String(stepId)] ||= { primary: "", secondary: [] };
    practiceWorkflowState.choices[String(stepId)].primary ||= optionId;
    practiceWorkflowState.choices[String(stepId)].secondary ||= [];
  });
  if (migrateConfirmedPracticeResults()) savePracticeWorkflowState();
  return practiceWorkflowState;
}

function savePracticeWorkflowState() {
  if (!practiceWorkflowState) return;
  practiceWorkflowState.updatedAt = new Date().toISOString();
  saveToLocalStorage(PRACTICE_WORKFLOW_KEY, practiceWorkflowState);
}

function migrateConfirmedPracticeResults() {
  let changed = false;
  const context = practiceWorkflowState.importedContext || {};
  const shouldRefreshContextualText = !/SWOT/i.test(getPracticeCourseText(context));
  const currentLessonTitle = getPracticeLessonTitle(context);
  const currentCourseName = context.courseProfile?.courseName || "";
  practiceWorkflowState.completedStepIds.forEach((stepId) => {
    const id = String(stepId);
    const selectedOptionId = practiceWorkflowState.currentSelections?.[id] || practiceWorkflowState.choices?.[id]?.primary;
    if (!selectedOptionId) return;
    const existing = practiceWorkflowState.stepResults[id];
    const existingText = existing ? JSON.stringify(existing) : "";
    const needsContextRefresh =
      (shouldRefreshContextualText && existingText.includes("SWOT")) ||
      (currentLessonTitle && existingText.includes("药事管理中的 SWOT 分析") && !existingText.includes(currentLessonTitle)) ||
      (currentCourseName && existingText.includes("药事管理的泛雅模拟导入数据") && currentCourseName !== "药事管理");
    if (existing && !needsContextRefresh) return;
    const result = createConfirmedPracticeStepResult(stepId, selectedOptionId);
    if (result) {
      practiceWorkflowState.stepResults[id] = result;
      changed = true;
    }
  });
  practiceWorkflowState.needsReviewStepIds = Object.values(practiceWorkflowState.stepResults)
    .filter((result) => Number(result.stepScore) < 2.5 || (result.dimensions || []).some((dimension) => Number(dimension.score) < 2.5))
    .map((result) => Number(result.stepId));
  return changed;
}

function getPracticeChoice(stepId) {
  const id = String(stepId);
  practiceWorkflowState.choices[id] ||= { primary: "", secondary: [] };
  practiceWorkflowState.choices[id].secondary ||= [];
  return practiceWorkflowState.choices[id];
}

function renderImportedDataOverview() {
  const container = $("#practiceImportedDataOverview");
  if (!container || !practiceWorkflowState?.importedContext) return;
  const context = practiceWorkflowState.importedContext;
  const { teacherProfile, courseProfile, learnerProfile, resourceProfile, assignmentProfile, learningAnalytics } = context;
  container.innerHTML = `
    <div class="section-head">
      <p class="eyebrow">Imported context</p>
      <h2>已导入课程与学情数据</h2>
      <p class="section-copy">${escapeHtml(context.simulatedNotice)}</p>
    </div>
    <div class="imported-data-grid">
      <article class="stat-card imported-data-card">
        <span>01</span>
        <strong>教师信息</strong>
        <p>${escapeHtml(teacherProfile.teacherName)}；${escapeHtml(teacherProfile.role)}；${escapeHtml(teacherProfile.preferredStyle)}。</p>
      </article>
      <article class="stat-card imported-data-card">
        <span>02</span>
        <strong>课程信息</strong>
        <p>${escapeHtml(courseProfile.courseName)}；${escapeHtml(context.currentTopic)}；${escapeHtml(courseProfile.lessonLength)}；当前章节：${escapeHtml(courseProfile.chapter)}。</p>
      </article>
      <article class="stat-card imported-data-card">
        <span>03</span>
        <strong>班级学情</strong>
        <p>${escapeHtml(context.className)}；${learnerProfile.studentCount} 人；${escapeHtml(learnerProfile.priorKnowledgeLevel)}；${escapeHtml(learnerProfile.classParticipation)}。</p>
      </article>
      <article class="stat-card imported-data-card">
        <span>04</span>
        <strong>课程资源</strong>
        <p>PPT ${resourceProfile.pptCount} 份；案例 ${resourceProfile.caseCount} 份；题库 ${resourceProfile.questionBankCount} 题；缺少${resourceProfile.missingResources.length ? escapeHtml(resourceProfile.missingResources.join("、")) : "暂无关键资源"}。</p>
      </article>
      <article class="stat-card imported-data-card">
        <span>05</span>
        <strong>作业与评价</strong>
        <p>提交率 ${assignmentProfile.submissionRate}%；平均分 ${assignmentProfile.averageScore}；薄弱点为 ${escapeHtml(assignmentProfile.weakPoints.slice(0, 3).join("、"))}。</p>
      </article>
      <article class="stat-card imported-data-card">
        <span>06</span>
        <strong>学习过程数据</strong>
        <p>预习完成率 ${learningAnalytics.previewCompletionRate}%；讨论参与率 ${learningAnalytics.discussionParticipation}%；高风险学生比例 ${learningAnalytics.atRiskStudentsRatio}%。</p>
      </article>
    </div>
  `;
}

function renderPracticeWorkflow() {
  renderPracticeWorkflowSidebar();
  renderPracticeCurrentStep();
  renderFinalPracticePlanPreview();
}

function renderPracticeWorkflowSidebar() {
  const container = $("#practiceWorkflowSidebar");
  if (!container || !practiceWorkflowState) return;
  container.innerHTML = trainingWorkflowConfig
    .map(
      (stage) => `
        <section class="workflow-stage">
          <h3 class="workflow-stage-title">${escapeHtml(stage.stageTitle)}</h3>
          ${stage.steps
            .map((step) => {
              const [label, status] = getPracticeStepStatus(step.id);
              const result = practiceWorkflowState.stepResults?.[String(step.id)];
              const needsReview = result && Number(result.stepScore) < 2.5;
              return `
                <button class="workflow-step ${status} ${step.id === practiceWorkflowState.currentStepId ? "active" : ""}" data-practice-step="${step.id}" ${status === "locked" ? "disabled" : ""} type="button">
                  <span class="workflow-step-number">${String(step.id).padStart(2, "0")}</span>
                  <span class="workflow-step-title">${escapeHtml(step.title)}</span>
                  <span class="status-pill status-${status}">${label}</span>
                  <span class="sidebar-score-badge">${result ? `${formatAcademicScore(result.stepScore)} · ${escapeHtml(result.level)}` : "未确认"}</span>
                  ${needsReview ? `<span class="sidebar-review-flag">建议复查</span>` : ""}
                </button>
              `;
            })
            .join("")}
        </section>
      `,
    )
    .join("");
  $$("[data-practice-step]", container).forEach((button) => {
    button.addEventListener("click", () => {
      practiceWorkflowState.currentStepId = Number(button.dataset.practiceStep);
      savePracticeWorkflowState();
      renderPracticeWorkflow();
    });
  });
}

function getPracticeStepStatus(stepId) {
  if (stepId === practiceWorkflowState.currentStepId) return ["当前实践", "current"];
  if (practiceWorkflowState.needsReviewStepIds.includes(stepId)) return ["需复查", "review"];
  if (practiceWorkflowState.completedStepIds.includes(stepId)) return ["已完成", "complete"];
  if (stepId > practiceWorkflowState.currentStepId + 2) return ["已锁定", "locked"];
  return ["待开始", "pending"];
}

function renderPracticeCurrentStep() {
  const container = $("#practiceCurrentStep");
  if (!container || !practiceWorkflowState) return;
  const context = practiceWorkflowState.importedContext;
  const step = getPracticeStep(getTrainingStep(practiceWorkflowState.currentStepId), context);
  const choice = getPracticeChoice(step.id);
  const recommendations = calculatePracticeRecommendations(step, context, practiceWorkflowState.choices);
  if (!choice.primary) {
    const [topOptionId] = Object.entries(recommendations).sort((a, b) => b[1].score - a[1].score)[0] || ["A"];
    choice.primary = topOptionId;
    practiceWorkflowState.currentSelections[String(step.id)] = topOptionId;
    buildPracticeStepArtifacts(step);
    savePracticeWorkflowState();
  }
  const selectedOptionId = practiceWorkflowState.currentSelections?.[String(step.id)] || choice.primary || "";
  const preview = selectedOptionId
    ? createStepPreview(step.id, selectedOptionId, "practice", context)
    : createStepPreview(step.id, "", "practice", context);
  practiceWorkflowState.currentPreview = preview;
  if (selectedOptionId) {
    practiceWorkflowState.templates[String(step.id)] = preview.template;
    practiceWorkflowState.scores[String(step.id)] = preview.score;
    practiceWorkflowState.analyses[String(step.id)] = preview.analysis;
    practiceWorkflowState.generatedFragments[String(step.id)] = preview.fragment;
  }
  const score = preview.score;
  const analysis = preview.analysis;
  const fragment = preview.fragment;

  container.innerHTML = `
    <div class="decision-header">
      <span class="stage-tag">${escapeHtml(step.stageTitle)}</span>
      <h2>${String(step.id).padStart(2, "0")}｜${escapeHtml(step.title)}</h2>
      <p class="core-question"><strong>核心问题：</strong>${escapeHtml(step.coreQuestion)}</p>
    </div>
    ${renderPracticeDataHint(step, context)}
    ${renderPracticeRecommendationReason(step, choice, recommendations)}
    ${renderPracticeOptionCards(step, choice, recommendations)}
    ${
      choice.primary
        ? `
          ${renderSelectionInsightPanel(score, analysis, "practice")}
          <div class="decision-actions">
            <button class="primary-action" id="confirmPracticeStep" type="button">确认本环节并写入真实课程方案</button>
            <button class="secondary-action" id="copyPracticeStepDraft" type="button">复制写入文本</button>
          </div>
        `
        : `<p class="muted">请选择一个主方案。点击方案后，系统会结合泛雅模拟导入数据生成诊断图，并展示当前选择的优势与风险。</p>`
    }
  `;

  $$("[data-practice-primary]", container).forEach((button) =>
    button.addEventListener("click", () => selectPracticePrimaryOption(step.id, button.dataset.practicePrimary)),
  );
  $$("[data-practice-secondary]", container).forEach((button) =>
    button.addEventListener("click", () => togglePracticeSecondaryOption(step.id, button.dataset.practiceSecondary)),
  );
  $$("[data-practice-option-card]", container).forEach((card) =>
    card.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("button")) return;
      selectPracticePrimaryOption(step.id, card.dataset.practiceOptionCard);
    }),
  );
  $("#confirmPracticeStep")?.addEventListener("click", confirmPracticeStep);
  $("#copyPracticeStepDraft")?.addEventListener("click", () => copyText(fragment || ""));
}

function renderPracticeOptionCards(step, choice, recommendations) {
  return `
    <div class="option-grid">
      ${Object.entries(step.options)
        .map(([id, label]) => {
          const isPrimary = choice.primary === id;
          const isSecondary = choice.secondary.includes(id);
          const isSelected = isPrimary || isSecondary;
          const recommendation = recommendations[id] || { score: 50, reasons: [] };
          return `
            <article class="option-card ${isPrimary ? "primary-selected selected" : ""} ${isSecondary ? "secondary-selected auxiliary" : ""}" data-practice-option-card="${id}">
              <div class="option-topline">
                <span class="option-id">${id}</span>
                <span class="option-score">推荐 ${recommendation.score}</span>
              </div>
              <h3>${escapeHtml(label)}</h3>
              ${
                isSelected
                  ? `
                    <div class="option-detail">
                      <strong>方案提示</strong>
                      <p>${escapeHtml(optionDescription(step, id, label))}</p>
                      <p><strong>学情推荐：</strong>${escapeHtml(recommendation.reasons[0] || "作为备选方案保留，等待教师结合真实课堂判断。")}</p>
                    </div>
                  `
                  : ""
              }
              <div class="option-actions">
                <button class="${isPrimary ? "active" : ""}" data-practice-primary="${id}" type="button">设为主方案</button>
                <button class="${isSecondary ? "active" : ""}" data-practice-secondary="${id}" ${isPrimary ? "disabled" : ""} type="button">辅助方案</button>
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderPracticeDataHint(step, context) {
  const hints = getPracticeDataHints(step, context);
  return `
    <section class="practice-data-hint">
      <strong>泛雅数据提示</strong>
      <p>当前为前端模拟导入数据。真实接入后，将由教师授权泛雅账号后读取。</p>
      <ul>${hints.map((hint) => `<li>${escapeHtml(hint)}</li>`).join("")}</ul>
    </section>
  `;
}

function getPracticeDataHints(step, context) {
  const { learnerProfile, resourceProfile, assignmentProfile, learningAnalytics, courseProfile } = context;
  if (step.id === 3) {
    return [
      `班级人数：${learnerProfile.studentCount}`,
      `基础差异：${learnerProfile.priorKnowledgeLevel}`,
      `常见困难：${learnerProfile.commonDifficulties.slice(0, 3).join("、")}`,
      `预习完成率：${learningAnalytics.previewCompletionRate}%`,
      `讨论参与率：${learningAnalytics.discussionParticipation}%`,
    ];
  }
  if ([11, 12].includes(step.id)) {
    return [
      `课程资源：PPT ${resourceProfile.pptCount} 份、案例 ${resourceProfile.caseCount} 份、题库 ${resourceProfile.questionBankCount} 题`,
      `已上传材料：${resourceProfile.uploadedMaterials.join("、")}`,
      `缺少资源：${resourceProfile.missingResources.length ? resourceProfile.missingResources.join("、") : "暂无关键缺口"}`,
    ];
  }
  if ([13, 14, 15, 18].includes(step.id)) {
    return [
      `近期作业提交率：${assignmentProfile.submissionRate}%`,
      `近期平均分：${assignmentProfile.averageScore}`,
      `作业薄弱点：${assignmentProfile.weakPoints.slice(0, 3).join("、")}`,
      `已有评价量规：${assignmentProfile.rubricHistory.join("、")}`,
    ];
  }
  if ([17, 19, 20].includes(step.id)) {
    return [
      `讨论参与率：${learningAnalytics.discussionParticipation}%`,
      `高风险学生比例：${learningAnalytics.atRiskStudentsRatio}%`,
      `常见误区：${learningAnalytics.commonMisconceptions.join("、")}`,
    ];
  }
  return [
    `课程：${courseProfile.courseName}；章节：${courseProfile.chapter}`,
    `课题：${courseProfile.lessonTitle}`,
    `授课对象：${context.className}`,
    `课程目标：${courseProfile.courseObjectives[0] || "待教师确认"}`,
  ];
}

function renderPracticeRecommendationReason(step, choice, recommendations) {
  const top = Object.entries(recommendations)
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 2)
    .map(([id, item]) => `${id} ${step.options[id]}（${item.score}）：${item.reasons[0] || "与当前课程上下文匹配"}`);
  const primary = choice.primary ? recommendations[choice.primary] : null;
  return `
    <section class="practice-recommendation-box">
      <strong>基于学情的智能推荐理由</strong>
      <p>${
        primary
          ? escapeHtml(primary.reasons.join("；") || "当前选择可保留，建议继续结合真实课程数据确认。")
          : escapeHtml(`系统优先推荐：${top.join("；")}`)
      }</p>
    </section>
  `;
}

function selectPracticePrimaryOption(stepId, optionId) {
  const step = getTrainingStep(stepId);
  const choice = getPracticeChoice(step.id);
  choice.primary = optionId;
  choice.secondary = choice.secondary.filter((id) => id !== optionId);
  practiceWorkflowState.currentSelections[String(step.id)] = optionId;
  practiceWorkflowState.currentPreview = createStepPreview(step.id, optionId, "practice", practiceWorkflowState.importedContext);
  buildPracticeStepArtifacts(step);
  savePracticeWorkflowState();
  renderPracticeWorkflow();
  scrollToSelectionInsight();
}

function togglePracticeSecondaryOption(stepId, optionId) {
  const step = getTrainingStep(stepId);
  const choice = getPracticeChoice(step.id);
  if (choice.primary === optionId) {
    showToast("主方案不能同时作为辅助方案");
    return;
  }
  choice.secondary = choice.secondary.includes(optionId)
    ? choice.secondary.filter((id) => id !== optionId)
    : [...choice.secondary, optionId];
  if (choice.primary) buildPracticeStepArtifacts(step);
  savePracticeWorkflowState();
  renderPracticeWorkflow();
  if (choice.primary) scrollToSelectionInsight();
}

function calculatePracticeRecommendations(step, importedContext, previousChoices = {}) {
  const result = Object.fromEntries(
    Object.entries(step.options).map(([id, label]) => [id, { score: 50, label, reasons: [] }]),
  );
  const add = (labels, points, reason) => {
    Object.entries(result).forEach(([id, item]) => {
      if (labels.some((label) => item.label.includes(label) || label.includes(item.label))) {
        item.score = clamp(item.score + points, 0, 100);
        item.reasons.push(reason);
      }
    });
  };
  const learnerText = importedContext.learnerProfile.commonDifficulties.join("、");
  const weakText = importedContext.assignmentProfile.weakPoints.join("、");
  const misconceptionText = importedContext.learningAnalytics.commonMisconceptions.join("、");

  if (learnerText.includes("分类边界") || weakText.includes("分类边界")) {
    add(["案例教学", "案例分析框架", "过程指导", "任务成果评价", "知识准确性标准", "分析深度标准"], 18, "班级在概念分类和证据判断上存在明显困难，需要案例支架、过程指导和清晰评价标准。");
  }
  if (importedContext.learningAnalytics.previewCompletionRate < 70) {
    add(["课前学习 → 课堂应用 → 课后巩固", "视频与微课", "概念解释支持", "作业记录"], 14, "预习完成率低于 70%，需要补充课前支架、概念解释和作业过程记录。");
  }
  if (importedContext.learningAnalytics.discussionParticipation < 60) {
    add(["讨论秩序管理", "小组协作完成任务", "教师反馈机制", "即时口头反馈"], 14, "讨论参与率低于 60%，需要更明确的小组协作、课堂秩序和教师即时反馈。");
  }
  if (importedContext.resourceProfile.caseCount > 0) {
    add(["案例教学", "案例问题逻辑", "SWOT 课堂案例材料", "案例分析任务"], 16, "课程资源中已有案例材料，适合用案例驱动真实药事管理判断。");
  }
  if (weakText.includes("证据引用不足")) {
    add(["证据模板与记录表", "学习过程文档", "分析深度标准", "过程性评价"], 16, "既往作业显示证据引用不足，应强化过程文档、证据表和分析深度标准。");
  }
  if (importedContext.resourceProfile.missingResources.includes("课堂案例证据表") && step.id === 11) {
    Object.values(result).forEach((item) => {
      item.reasons.push("教学资源设计环节需补充课程案例事实、政策材料、组织资源和风险边界证据表。");
    });
  }
  if (misconceptionText.includes("证据来源") || importedContext.learningAnalytics.atRiskStudentsRatio >= 10) {
    add(["过程指导", "教师反馈机制", "风险预案", "即时口头反馈", "分层学习材料"], 10, "高风险学生比例和常见误区提示教师应增强过程反馈和风险控制。");
  }
  if (previousChoices["5"]?.primary === "B") {
    add(["案例问题逻辑", "案例分析任务", "SWOT 课堂案例材料"], 6, "前序教学方法选择了案例教学，后续内容、资源和任务应保持案例主线。");
  }
  Object.values(result).forEach((item) => {
    item.score = clamp(item.score, 40, 98);
  });
  return result;
}

function buildPracticeStepArtifacts(step) {
  if (!practiceWorkflowState) return;
  const choice = getPracticeChoice(step.id);
  if (!choice.primary) return;
  practiceWorkflowState.currentSelections[String(step.id)] = choice.primary;
  const preview = createStepPreview(step.id, choice.primary, "practice", practiceWorkflowState.importedContext);
  practiceWorkflowState.currentPreview = preview;
  practiceWorkflowState.templates[String(step.id)] = preview.template;
  practiceWorkflowState.scores[String(step.id)] = preview.score;
  practiceWorkflowState.analyses[String(step.id)] = preview.analysis;
  practiceWorkflowState.generatedFragments[String(step.id)] = preview.fragment;
}

function generatePracticeExcellentTemplate(step, primaryLabel, secondaryLabels = [], importedContext) {
  const { courseProfile, learnerProfile, assignmentProfile, learningAnalytics } = importedContext;
  return {
    title: `${primaryLabel}${secondaryLabels.length ? ` + ${secondaryLabels.join(" + ")}` : ""}真实课程模板`,
    positioning: `该模板基于泛雅模拟导入的${importedContext.className}学情数据，用于把“${step.title}”落到${courseProfile.lessonTitle}的真实课程设计中。`,
    structure: [
      `引用课程目标：${courseProfile.courseObjectives[0] || "由教师确认本课目标"}。`,
      `引用班级学情：${learnerProfile.studentCount} 人，${learnerProfile.priorKnowledgeLevel}，讨论参与率 ${learningAnalytics.discussionParticipation}%。`,
      `采用“${primaryLabel}”作为主方案${secondaryLabels.length ? `，辅以“${secondaryLabels.join("、")}”` : ""}。`,
      `针对薄弱点“${assignmentProfile.weakPoints.slice(0, 2).join("、")}”设计活动、证据和反馈。`,
    ],
    example: `在“${courseProfile.lessonTitle}”中，教师围绕${importedContext.currentTopic}组织学生处理真实药事管理证据，并把预习、讨论、作业和课堂表现数据纳入本环节判断。`,
    checklist: [
      "是否引用了教师授权范围内的课程与班级数据？",
      `是否明确授课对象是${importedContext.className}？`,
      "是否回应了作业薄弱点和学习过程数据？",
      "是否形成可复制到泛雅课程的文本？",
      "是否避免声称真实读取或分析学生隐私数据？",
    ],
    mistakes: [
      "只复用模拟训练模板，没有结合班级学情。",
      "忽略预习完成率、讨论参与率和作业薄弱点。",
      "只生成任务文本，没有写清评价证据。",
      "把模拟导入数据说成真实平台推送结果。",
    ],
    copyText: `本环节建议在泛雅模拟导入上下文下采用“${primaryLabel}”作为主方案${secondaryLabels.length ? `，辅以“${secondaryLabels.join("、")}”` : ""}。教师应结合${learnerProfile.studentCount}人的班级规模、${assignmentProfile.weakPoints.slice(0, 2).join("、")}等薄弱点，以及预习完成率 ${learningAnalytics.previewCompletionRate}%、讨论参与率 ${learningAnalytics.discussionParticipation}% 等学习过程数据，完成本环节真实课程设计。`,
  };
}

function generatePracticeDecisionScore(step, primaryLabel, secondaryLabels = [], importedContext) {
  const labels = [primaryLabel, ...secondaryLabels].join("、");
  const has = (patterns) => patterns.some((pattern) => labels.includes(pattern));
  const learnerText = importedContext.learnerProfile.commonDifficulties.join("、");
  const weakText = importedContext.assignmentProfile.weakPoints.join("、");
  const scores = {
    alignment: 2.8,
    authenticity: 2.7,
    learner: 2.5,
    engagement: 2.6,
    assessment: 2.5,
    reflection: 2.4,
  };

  if (importedContext.courseProfile.courseObjectives.length) scores.alignment += 0.25;
  if (has(["应用", "分析", "职业", "成果", "任务"])) {
    scores.alignment += 0.22;
    scores.engagement += 0.18;
  }

  if (importedContext.learnerProfile.priorKnowledgeLevel.includes("差异") || importedContext.learningAnalytics.previewCompletionRate < 70) {
    scores.learner += has(["分层", "案例分析框架", "过程指导", "概念解释", "视频", "课前学习"]) ? 0.55 : -0.18;
  }
  if (importedContext.learningAnalytics.discussionParticipation < 60) {
    scores.learner += has(["小组", "讨论", "教师反馈", "即时口头反馈"]) ? 0.22 : -0.08;
    scores.engagement += has(["小组", "讨论", "反馈"]) ? 0.35 : -0.14;
  }
  if (importedContext.resourceProfile.caseCount > 0) {
    scores.authenticity += has(["案例", "SWOT 课堂案例材料", "案例问题逻辑"]) ? 0.58 : 0.18;
  }
  if (weakText.includes("证据引用不足") || learnerText.includes("证据")) {
    scores.assessment += has(["证据", "过程性评价", "学习过程文档", "任务成果评价", "分析深度标准", "矩阵成果评价"]) ? 0.62 : -0.22;
  }
  if (importedContext.resourceProfile.missingResources.length) {
    scores.authenticity += has(["项目开发", "调研探究", "数据、平台或政策资源"]) ? -0.18 : 0.08;
  }
  if (importedContext.resourceProfile.uploadedMaterials.length && has(["案例", "模板", "课件", "讲义"])) {
    scores.authenticity += 0.22;
    scores.alignment += 0.1;
  }
  if (importedContext.learningAnalytics.atRiskStudentsRatio >= 10 || importedContext.learningAnalytics.commonMisconceptions.length >= 3) {
    scores.reflection += has(["过程指导", "教师反馈", "风险", "即时口头反馈", "分层", "课堂管理"]) ? 0.48 : -0.16;
    scores.learner += has(["过程指导", "教师反馈", "分层"]) ? 0.22 : 0;
  }

  return createAcademicScore(step, primaryLabel, secondaryLabels, scores, importedContext);
}

function generatePracticeAnalysis(step, primaryLabel, secondaryLabels = [], score, importedContext) {
  const lowNames = score.dimensions.filter((item) => item.score < 2.5).map((item) => item.name);
  const next = trainingSteps.find((item) => item.id === step.id + 1);
  return {
    strengths: [
      `已将“${step.title}”放入${importedContext.courseProfile.lessonTitle}的真实课程上下文中。`,
      `当前方案引用了班级人数、预习完成率、讨论参与率和作业薄弱点等模拟导入数据。`,
      secondaryLabels.length ? `辅助方案“${secondaryLabels.join("、")}”能补强主方案的数据适配度。` : "方案保持清晰，便于教师复制到泛雅课程中再调整。",
    ],
    risks: [
      importedContext.resourceProfile.missingResources.length
        ? `课程资源仍缺少：${importedContext.resourceProfile.missingResources.join("、")}。`
        : "当前课程资源较完整，但仍需教师核验材料有效性。",
      `常见误区包括：${importedContext.learningAnalytics.commonMisconceptions.slice(0, 2).join("、")}。`,
      lowNames.length ? `当前低分维度集中在：${lowNames.join("、")}。` : "当前没有明显高风险维度。",
    ],
    suggestions: lowNames.length
      ? lowNames.map((name) => `针对“${name}”，补充更明确的泛雅导入数据引用、课堂活动证据或评价记录。`)
      : ["保留当前方案，并在下一环节继续维持目标、活动和评价证据一致。"],
    nextReminder: next ? `下一环节是“${next.title}”，请继续检查本环节选择如何影响真实课程实施。` : "已经到达最后一个环节，请生成真实课程教学实践方案。",
    retainAdvice: score.total >= 2.5 ? "建议保留当前选择，并结合教师判断微调。" : "建议保留主线，但需要按低分维度补强后再用于真实课程。",
  };
}

function generatePracticeFragment(step, primaryLabel, secondaryLabels = [], importedContext) {
  const { learnerProfile, assignmentProfile, learningAnalytics, courseProfile } = importedContext;
  if (step.id === 3) {
    return `根据泛雅导入的班级学情数据，本班为${importedContext.className}，共 ${learnerProfile.studentCount} 人，预习完成率为 ${learningAnalytics.previewCompletionRate}%，讨论参与率为 ${learningAnalytics.discussionParticipation}%。既往作业显示学生主要困难集中在 ${assignmentProfile.weakPoints.slice(0, 3).join("、")}。因此，本课学情分析与学习起点诊断建议采用“${primaryLabel}”作为主方案${secondaryLabels.length ? `，并配套“${secondaryLabels.join("、")}”` : ""}，帮助教师为不同基础学生提供结构化支架和案例分析框架。`;
  }
  return `在“${step.title}”环节，教师基于泛雅模拟导入的${importedContext.className}课程上下文，选择“${primaryLabel}”作为主方案${secondaryLabels.length ? `，辅以“${secondaryLabels.join("、")}”` : ""}。该决策引用了课程资源、班级学情、作业薄弱点和学习过程数据：预习完成率 ${learningAnalytics.previewCompletionRate}%，讨论参与率 ${learningAnalytics.discussionParticipation}%，近期作业薄弱点为 ${assignmentProfile.weakPoints.slice(0, 3).join("、")}。本环节将服务于“${courseProfile.lessonTitle}”的真实课程实施，并为课堂任务、评价量规和复盘建议提供依据。`;
}

function confirmPracticeStep() {
  const step = getTrainingStep(practiceWorkflowState.currentStepId);
  const choice = getPracticeChoice(step.id);
  if (!choice.primary) {
    showToast("请先选择一个主方案");
    return;
  }
  const selectedOptionId = practiceWorkflowState.currentSelections?.[String(step.id)] || choice.primary;
  const result = createConfirmedPracticeStepResult(step.id, selectedOptionId);
  if (!result) {
    showToast("请先选择一个有效方案");
    return;
  }
  practiceWorkflowState.stepResults[String(step.id)] = result;
  practiceWorkflowState.currentPreview = createStepPreview(step.id, selectedOptionId, "practice", practiceWorkflowState.importedContext);
  practiceWorkflowState.scores[String(step.id)] = practiceWorkflowState.currentPreview.score;
  practiceWorkflowState.analyses[String(step.id)] = practiceWorkflowState.currentPreview.analysis;
  practiceWorkflowState.generatedFragments[String(step.id)] = result.fragment;
  if (!practiceWorkflowState.completedStepIds.includes(step.id)) practiceWorkflowState.completedStepIds.push(step.id);
  practiceWorkflowState.needsReviewStepIds = result.needsReview
    ? Array.from(new Set([...practiceWorkflowState.needsReviewStepIds, step.id]))
    : practiceWorkflowState.needsReviewStepIds.filter((id) => id !== step.id);
  if (step.id < trainingSteps.length) practiceWorkflowState.currentStepId = step.id + 1;
  savePracticeWorkflowState();
  renderPracticeWorkflow();
  showToast("已写入当前真实课程方案");
}

function renderPracticeCourseDraft() {
  const container = $("#practiceCourseDraft");
  if (!container || !practiceWorkflowState) return;
  const context = practiceWorkflowState.importedContext;
  const confirmed = trainingSteps.filter((step) => practiceWorkflowState.completedStepIds.includes(step.id));
  const currentPreview = practiceWorkflowState.currentPreview?.stepId === practiceWorkflowState.currentStepId
    ? practiceWorkflowState.currentPreview
    : null;
  const currentResult = practiceWorkflowState.stepResults?.[String(practiceWorkflowState.currentStepId)];
  container.innerHTML = `
    <div class="summary-list">
      <div class="summary-item"><strong>课程</strong><p>${escapeHtml(context.courseProfile.courseName)}｜${escapeHtml(context.courseProfile.lessonTitle)}</p></div>
      <div class="summary-item"><strong>班级</strong><p>${escapeHtml(context.className)}；${context.learnerProfile.studentCount} 人</p></div>
      <div class="summary-item"><strong>数据摘要</strong><p>预习 ${context.learningAnalytics.previewCompletionRate}%；讨论 ${context.learningAnalytics.discussionParticipation}%；高风险 ${context.learningAnalytics.atRiskStudentsRatio}%</p></div>
      <div class="summary-item"><strong>已确认环节</strong><p>${confirmed.length} / ${trainingSteps.length}</p></div>
      <div class="summary-item"><strong>当前评分</strong><p>${
        currentPreview?.selectedOption
          ? `${formatAcademicScore(currentPreview.stepScore)} 分 · ${currentPreview.level}`
          : currentResult
          ? `${formatAcademicScore(currentResult.stepScore)} 分 · ${currentResult.level}`
          : "选择主方案后生成"
      }</p></div>
      <div class="summary-item"><strong>需复查</strong><p>${practiceWorkflowState.needsReviewStepIds.length ? practiceWorkflowState.needsReviewStepIds.map((id) => `${id}. ${getTrainingStep(id).title}`).join("；") : "暂无"}</p></div>
      <button class="primary-action" type="button" id="draftGenerateFinalPracticePlan">生成完整实践方案</button>
    </div>
    <div class="draft-fragments">
      ${confirmed
        .map((step) => `<article><strong>${step.id}. ${escapeHtml(step.title)}</strong><p>${escapeHtml(practiceWorkflowState.stepResults?.[String(step.id)]?.fragment || practiceWorkflowState.generatedFragments[String(step.id)] || "尚未生成文本。")}</p></article>`)
        .join("")}
    </div>
  `;
  $("#draftGenerateFinalPracticePlan")?.addEventListener("click", generateFinalPracticePlan);
}

function generateFinalPracticePlan() {
  if (!practiceWorkflowState) loadPracticeWorkflowState();
  const context = practiceWorkflowState.importedContext;
  const finalDiagnostic = calculatePracticeFinalDiagnostic();
  const sections = [
    ["一、泛雅导入数据说明", dataImportText(context)],
    ["二、教师与课程信息", teacherCourseText(context)],
    ["三、班级学情分析", learnerAnalysisText(context)],
    ["四、教学情境与课程任务分析", practiceStepText(1)],
    ["五、学情分析与学习起点诊断", practiceStepText(2)],
    ["六、教学目标与预期学习成果设计", practiceStepText(3)],
    ["七、教学内容重构与核心概念提炼", practiceStepText(4)],
    ["八、学习资源与案例材料开发", practiceStepText(5)],
    ["九、课前学习支架与预习任务设计", practiceStepText(6)],
    ["十、诊断性评价与学习问题收集", practiceStepText(7)],
    ["十一、教学过程、活动序列与评价量规设计", practiceStepText(8)],
    ["十二、问题情境创设与学习动机激发", practiceStepText(9)],
    ["十三、先行组织与已有经验激活", practiceStepText(10)],
    ["十四、核心概念讲解与认知支架提供", practiceStepText(11)],
    ["十五、案例探究与证据分析活动", practiceStepText(12)],
    ["十六、协作学习与角色任务推进", practiceStepText(13)],
    ["十七、学习成果展示、课堂对话与追问", practiceStepText(14)],
    ["十八、形成性评价与即时反馈调节", practiceStepText(15)],
    ["十九、课堂总结、迁移提升与课后任务衔接", practiceStepText(16)],
    ["二十、学习成果收集与表现性评价", practiceStepText(17)],
    ["二十一、学习数据分析与学习困难诊断", practiceStepText(18)],
    ["二十二、差异化反馈、补救教学与拓展支持", practiceStepText(19)],
    ["二十三、教学反思、资源沉淀与持续改进", practiceStepText(20)],
    ["二十四、数据驱动一致性评分", overallPracticeScoreText()],
    ["二十五、复制到泛雅课程的操作建议", copyToFanyaAdviceText()],
  ];
  practiceWorkflowState.finalPracticePlan = [
    "# 《真实课程教学实践方案》",
    "",
    ...sections.flatMap(([title, body]) => [`## ${title}`, "", body, ""]),
  ].join("\n");
  practiceWorkflowState.finalDiagnostic = finalDiagnostic;
  savePracticeWorkflowState();
  renderFinalPracticePlanPreview();
  showToast("真实课程教学实践方案已生成");
  return practiceWorkflowState.finalPracticePlan;
}

function calculatePracticeFinalDiagnostic() {
  const results = Object.values(practiceWorkflowState?.stepResults || {}).filter((result) => result?.completed);
  const bucket = Object.fromEntries(FINAL_DIAGNOSTIC_DIMENSIONS.map((dimension) => [dimension.key, []]));
  results.forEach((result) => {
    const rubric = getTrainingStepRubric(result.stepId);
    const stepScore = normalizeAcademicScore(result.stepScore ?? result.score);
    (rubric.finalDimensionMapping || []).forEach((dimensionKey) => {
      if (!bucket[dimensionKey]) return;
      bucket[dimensionKey].push({
        stepId: result.stepId,
        title: rubric.title || result.title,
        score: stepScore,
        level: getScoreLevel(stepScore),
        lowestDimension: result.lowestDimension?.label || result.lowestDimension?.name || "",
        improvementAdvice: result.improvementAdvice || result.keyImprovement || result.lowestDimension?.improvementHint || "",
      });
    });
  });
  const dimensions = FINAL_DIAGNOSTIC_DIMENSIONS.map((dimension) => {
    const contributingSteps = bucket[dimension.key] || [];
    const values = contributingSteps.map((item) => Number(item.score)).filter((value) => Number.isFinite(value));
    const score = values.length
      ? normalizeAcademicScore(values.reduce((sum, value) => sum + Number(value), 0) / values.length)
      : 0;
    const weakestContributingStep = contributingSteps.length
      ? [...contributingSteps].sort((a, b) => Number(a.score) - Number(b.score))[0]
      : null;
    const improvementHint = buildFinalDimensionAdvice(dimension, weakestContributingStep, score, values.length);
    return {
      ...dimension,
      name: dimension.label,
      score,
      level: values.length ? getScoreLevel(score) : "待评分",
      scoreLabel: values.length ? getScoreLevel(score) : "待评分",
      explanation: values.length
        ? `${dimension.description} 当前结合 ${values.length} 个真实课程实践环节的数据增强评分形成诊断，综合表现为${getScoreLevel(score)}。${
            weakestContributingStep
              ? ` 当前最低贡献环节为“${String(weakestContributingStep.stepId).padStart(2, "0")}. ${weakestContributingStep.title}”。`
              : ""
          }`
        : "尚无实践环节评分映射到该维度。",
      improvement: improvementHint,
      improvementHint,
      contributingSteps,
      weakestContributingStep,
      theorySources: getFinalDimensionTheorySources(dimension),
      sourceCount: values.length,
      sampleSize: values.length,
    };
  });
  const weightedScore = normalizeAcademicScore(dimensions.reduce((sum, dimension) => sum + dimension.score * dimension.weight, 0));
  const scoredDimensions = dimensions.filter((dimension) => dimension.sourceCount > 0);
  const sorted = [...(scoredDimensions.length ? scoredDimensions : dimensions)].sort((a, b) => b.score - a.score);
  return {
    weightedScore,
    level: scoredDimensions.length ? getScoreLevel(weightedScore) : "待评分",
    dimensions,
    highestDimension: sorted[0],
    lowestDimension: sorted[sorted.length - 1],
  };
}

function dataImportText(context) {
  return [
    "当前为前端模拟导入数据。真实接入后，将由教师授权泛雅账号后读取。",
    `- 数据来源：${context.courseTitle} 的模拟教师信息、课程资源、班级学情、作业记录和学习过程数据。`,
    `- 使用边界：${Object.entries(context.dataScope)
      .filter(([, enabled]) => enabled)
      .map(([key]) => key)
      .join("、")}。`,
    "- 第一版未读取真实学生个人数据，未接入真实泛雅 API，也不会向泛雅写入内容。",
  ].join("\n");
}

function teacherCourseText(context) {
  return [
    `- 教师：${context.teacherProfile.teacherName}；${context.teacherProfile.role}；教龄 ${context.teacherProfile.teachingYears}`,
    `- 教学偏好：${context.teacherProfile.preferredStyle}`,
    `- 课程：${context.courseProfile.courseName}；${context.courseProfile.semester}`,
    `- 章节：${context.courseProfile.chapter}`,
    `- 课题：${context.courseProfile.lessonTitle}`,
    `- 课时：${context.courseProfile.lessonLength}`,
    `- 课程关键词：${context.courseProfile.syllabusKeywords.join("、")}`,
  ].join("\n");
}

function learnerAnalysisText(context) {
  return [
    `- 班级：${context.className}`,
    `- 学生规模：${context.learnerProfile.studentCount} 人`,
    `- 专业与年级：${context.learnerProfile.major} ${context.learnerProfile.grade}`,
    `- 先备基础：${context.learnerProfile.priorKnowledgeLevel}`,
    `- 课堂参与：${context.learnerProfile.classParticipation}`,
    `- 预习完成率：${context.learningAnalytics.previewCompletionRate}%`,
    `- 讨论参与率：${context.learningAnalytics.discussionParticipation}%`,
    `- 作业薄弱点：${context.assignmentProfile.weakPoints.join("、")}`,
    `- 常见误区：${context.learningAnalytics.commonMisconceptions.join("、")}`,
  ].join("\n");
}

function practiceStepText(stepId) {
  const step = getTrainingStep(stepId);
  const result = practiceWorkflowState.stepResults?.[String(stepId)];
  const fragment = result?.fragment || practiceWorkflowState.generatedFragments[String(stepId)];
  const score = result ? stepResultToScoreObject(result) : null;
  if (!fragment) {
    return `本环节“${step.title}”尚未确认。建议教师继续基于泛雅模拟导入数据选择主方案、辅助方案，并补充评价证据后再用于真实课程。`;
  }
  return `${fragment}\n\n${scoreDiagnosisReportText(score)}`;
}

function overallPracticeScoreText() {
  const results = Object.values(practiceWorkflowState.stepResults || {});
  if (!results.length) return "尚未形成实践评分记录。";
  const average = normalizeAcademicScore(results.reduce((sum, result) => sum + Number(result.stepScore || 0), 0) / results.length);
  return `当前已形成 ${results.length} 个数据增强教学设计质量评分记录，已确认 ${practiceWorkflowState.completedStepIds.length} / ${trainingSteps.length} 个环节，整体数据驱动一致性评分为 ${formatAcademicScore(average)} / 4，等级：${getAcademicLevel(average)}。需复查环节：${
    practiceWorkflowState.needsReviewStepIds.length ? practiceWorkflowState.needsReviewStepIds.map((id) => `${id}. ${getTrainingStep(id).title}`).join("；") : "暂无"
  }。`;
}

function copyToFanyaAdviceText() {
  return [
    "1. 点击“复制到泛雅课程”后，仅复制本方案文本到剪贴板。",
    "2. 请教师打开泛雅课程对应的任务、作业、公告或资源位置，人工粘贴并二次核验。",
    "3. 第一版不会向泛雅写入内容，也不会声称已经完成真实平台推送。",
    "4. 粘贴前请根据真实班级、课程进度、学校规范和最新政策材料调整。",
  ].join("\n");
}

function renderFinalPracticePlanPreview() {
  const preview = $("#finalPracticePlanPreview");
  if (!preview || !practiceWorkflowState) return;
  const finalDiagnostic = practiceWorkflowState.finalDiagnostic || (practiceWorkflowState.finalPracticePlan ? calculatePracticeFinalDiagnostic() : null);
  preview.innerHTML = practiceWorkflowState.finalPracticePlan
    ? `
      ${renderFinalDiagnosticSection(finalDiagnostic, {
        eyebrow: "Real course diagnosis",
        title: "真实课程教学实践诊断",
        copy: "基于真实课程 20 环节实践结果，结合泛雅模拟导入的课程资源、作业记录、学习过程和学生反馈，汇总生成数据增强诊断。",
        bulletId: "practiceFinalBulletChart",
        detailId: "practiceDimensionDetail",
        chartTitle: "实践诊断 Bullet Chart",
      })}
      <pre>${escapeHtml(practiceWorkflowState.finalPracticePlan)}</pre>
    `
    : `<p class="muted">尚未生成真实课程教学实践方案。请确认环节，或点击“生成真实课程教学方案”预览当前内容。</p>`;
  if (practiceWorkflowState.finalPracticePlan && finalDiagnostic) {
    renderBulletChart($("#practiceFinalBulletChart", preview), finalDiagnostic.dimensions, {
      detailContainer: $("#practiceDimensionDetail", preview),
    });
  }
}

function saveFinalPracticePlanToAssets() {
  const content = practiceWorkflowState?.finalPracticePlan || generateFinalPracticePlan();
  const context = practiceWorkflowState.importedContext;
  const finalDiagnostic = practiceWorkflowState.finalDiagnostic || calculatePracticeFinalDiagnostic();
  const store = loadAssets();
  const item = {
    id: `practice-plan-${Date.now()}`,
    title: "《真实课程教学实践方案》",
    type: "真实课程教学实践方案",
    source: "教学实践",
    course: context.courseTitle || context.courseProfile.courseName,
    updatedAt: new Date().toISOString(),
    tags: ["教学实践", "泛雅模拟", "20环节", "学情驱动"],
    boundary: "来源于教学实践页的泛雅模拟授权课程上下文；第一版未读取真实学生个人数据。",
    summary: "基于泛雅模拟导入的教师信息、课程资源、班级学情、作业记录和学习过程数据生成的 20 环节真实课程教学实践方案。",
    usage: "用于真实课程备课、课堂任务发布、评价量规设计和课后复盘。",
    reuse: "可作为下一次教学实践、泛雅课程任务复制和教学资产迭代的基础。",
    risk: "第一版仅使用前端模拟导入数据，未接入真实泛雅 API；教师需基于真实课程情况二次核验。",
    content,
    finalDiagnostic,
    relatedFiles: [],
  };
  store.practiceReports = [item, ...(store.practiceReports || [])];
  store.tags = Array.from(new Set([...(store.tags || []), ...item.tags]));
  saveAssets(store);
  showToast("真实课程教学实践方案已保存到教学资产");
}

function makeEmptyAssets() {
  return {
    uploadedFileMeta: [],
    trainingReports: [],
    practiceReports: [],
    generatedRubrics: [],
    generatedTasks: [],
    fanyaSyncRecords: [],
    tags: [],
    sourceBoundaries: [],
  };
}

function loadAssets() {
  const legacy = loadFromLocalStorage(ASSETS_KEY, makeEmptyAssets());
  currentAssetStore = {
    ...makeEmptyAssets(),
    ...legacy,
  };
  if (legacy.uploads?.length && !currentAssetStore.uploadedFileMeta.length) {
    currentAssetStore.uploadedFileMeta = legacy.uploads;
  }
  if (legacy.items?.length && !currentAssetStore.practiceReports.length) {
    currentAssetStore.practiceReports = legacy.items;
  }
  return currentAssetStore;
}

function saveAssets(store = currentAssetStore) {
  currentAssetStore = {
    ...makeEmptyAssets(),
    ...(store || {}),
  };
  saveToLocalStorage(ASSETS_KEY, currentAssetStore);
}

function initAssetsPage() {
  if (!$("#assetList")) return;
  loadAssets();
  importTrainingAndPracticeAssets();
  renderAssetOverview();
  renderAssetUpload();
  bindAssetReuseActions();
  refreshAssetWorkbench();
}

function renderAssetOverview() {
  const store = currentAssetStore || loadAssets();
  $("#trainingReportCount") && ($("#trainingReportCount").textContent = String((store.trainingReports || []).length));
  $("#practiceReportCount") && ($("#practiceReportCount").textContent = String((store.practiceReports || []).length + (store.generatedTasks || []).length));
  $("#uploadedMetaCount") && ($("#uploadedMetaCount").textContent = String((store.uploadedFileMeta || []).length));
  $("#fanyaSyncCount") && ($("#fanyaSyncCount").textContent = String((store.fanyaSyncRecords || []).length));
}

function refreshAssetWorkbench() {
  renderAssetFilters();
  renderAssetList();
  renderAssetKnowledgeGraph();
  const active = getActiveWorkbenchAsset(getFilteredAssetWorkbenchItems());
  if (active) {
    viewAssetDetail(active.id, { skipGraphSync: true, skipListSync: true });
  } else {
    renderEmptyAssetDetail();
  }
}

function renderAssetFilters() {
  renderAssetFilterGroup("assetSourceFilters", "来源", "source", ASSET_SOURCE_FILTERS);
  renderAssetFilterGroup("assetTypeFilters", "类型", "type", ASSET_TYPE_FILTERS);
  renderAssetFilterGroup("assetStatusFilters", "状态", "status", ASSET_STATUS_FILTERS);
  const search = $("#assetSearchInput");
  if (search) {
    if (search.value !== assetFilterState.query) search.value = assetFilterState.query;
    if (search.dataset.assetSearchReady !== "true") {
      search.dataset.assetSearchReady = "true";
      search.addEventListener("input", () => {
        assetFilterState.query = search.value || "";
        refreshAssetWorkbench();
      });
    }
  }
}

function renderAssetFilterGroup(targetId, label, key, items) {
  const target = $(`#${targetId}`);
  if (!target) return;
  target.innerHTML = `
    <div class="asset-filter-title">${escapeHtml(label)}</div>
    <div class="asset-filter-chips">
      ${items
        .map(
          (item) => `
            <button
              type="button"
              data-asset-filter-key="${escapeHtml(key)}"
              data-asset-filter-value="${escapeHtml(item)}"
              class="${assetFilterState[key] === item ? "is-active" : ""}"
              aria-pressed="${assetFilterState[key] === item ? "true" : "false"}"
            >
              ${escapeHtml(item)}
            </button>
          `,
        )
        .join("")}
    </div>
  `;
  $$("[data-asset-filter-key]", target).forEach((button) => {
    button.addEventListener("click", () => {
      const filterKey = button.dataset.assetFilterKey;
      if (!filterKey || !Object.prototype.hasOwnProperty.call(assetFilterState, filterKey)) return;
      assetFilterState[filterKey] = button.dataset.assetFilterValue || "全部";
      refreshAssetWorkbench();
    });
  });
}

function renderAssetUpload() {
  renderSelectedFiles();
  const toggle = $("[data-asset-import-toggle]");
  const panel = $("#assetImportPanel");
  if (toggle && panel && toggle.dataset.assetImportReady !== "true") {
    toggle.dataset.assetImportReady = "true";
    toggle.addEventListener("click", () => {
      const nextOpen = panel.hidden;
      panel.hidden = !nextOpen;
      toggle.setAttribute("aria-expanded", String(nextOpen));
      toggle.classList.toggle("is-active", nextOpen);
      if (nextOpen) $("#assetDescription")?.focus();
    });
  }
  const fileInput = $("#assetFileInput");
  if (fileInput && fileInput.dataset.assetUploadReady !== "true") {
    fileInput.dataset.assetUploadReady = "true";
    fileInput.addEventListener("change", (event) => {
      pendingUploadFiles = Array.from(event.target.files || []).map((file) => ({
        id: `file-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: file.name,
        size: file.size,
        type: file.type || "未知类型",
        lastModified: file.lastModified,
        uploadedAt: new Date().toISOString(),
      }));
      renderSelectedFiles();
    });
  }
  const form = $("#assetUploadForm");
  if (form && form.dataset.assetSubmitReady !== "true") {
    form.dataset.assetSubmitReady = "true";
    form.addEventListener("submit", handleAssetUpload);
  }
}

function handleAssetUpload(event) {
  event.preventDefault();
  const description = $("#assetDescription")?.value.trim() || "";
  const course = $("#assetCourse")?.value.trim() || defaultTrainingCourse.courseName;
  const tags = parseTags($("#assetTags")?.value || "");
  const boundary = $("#sourceBoundary")?.value.trim() || "";
  const url = $("#assetUrl")?.value.trim() || "";
  const databaseBoundary = $("#databaseBoundary")?.value.trim() || "";
  const usageLimit = $("#usageLimit")?.value.trim() || "";

  if (!description && !pendingUploadFiles.length && !url && !databaseBoundary) {
    showToast("请至少填写材料说明、网页、数据库边界或上传文件");
    return;
  }

  const upload = {
    id: `upload-${Date.now()}`,
    title: description ? `知识库材料：${description.slice(0, 32)}` : "知识库上传材料元数据",
    type: "上传材料元数据",
    source: "上传材料",
    course,
    updatedAt: new Date().toISOString(),
    tags: tags.length ? tags : ["课程知识库"],
    boundary: boundary || databaseBoundary || "教师在上传表单中限定的课程知识范围。",
    summary: description || "教师上传或限定的课程材料元数据。",
    usage: "可作为后续教学设计、案例生成、评价量规生成和课程复盘的来源边界。",
    reuse: "下一次生成前可选择该材料条目作为课程知识库范围。",
    risk: usageLimit || "浏览器第一版仅保存文件元数据，不读取本地文件正文；正式引用前需教师核验来源。",
    content: [
      description,
      url ? `指定网页：${url}` : "",
      databaseBoundary ? `数据库边界：${databaseBoundary}` : "",
      pendingUploadFiles.length
        ? `文件元数据：${pendingUploadFiles.map((file) => `${file.name}（${formatFileSize(file.size)}，${file.type}）`).join("；")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
    files: pendingUploadFiles,
    relatedFiles: pendingUploadFiles,
  };
  currentAssetStore.uploadedFileMeta = [upload, ...(currentAssetStore.uploadedFileMeta || [])];
  currentAssetStore.sourceBoundaries = Array.from(
    new Set([...(currentAssetStore.sourceBoundaries || []), boundary, databaseBoundary].filter(Boolean)),
  );
  currentAssetStore.tags = Array.from(new Set([...(currentAssetStore.tags || []), ...upload.tags]));
  saveAssets(currentAssetStore);

  pendingUploadFiles = [];
  $("#assetUploadForm")?.reset();
  if ($("#assetCourse")) $("#assetCourse").value = defaultTrainingCourse.courseName;
  renderSelectedFiles();
  renderAssetOverview();
  selectedAssetId = upload.id;
  refreshAssetWorkbench();
  showToast("知识库元数据已保存");
}

function renderSelectedFiles() {
  const container = $("#selectedFileList");
  if (!container) return;
  container.innerHTML = pendingUploadFiles.length
    ? pendingUploadFiles
        .map(
          (file) => `
            <div class="file-meta-chip">
              <strong>${escapeHtml(file.name)}</strong>
              <span>${formatFileSize(file.size)} · ${escapeHtml(file.type || "未知类型")} · ${formatDate(file.uploadedAt)}</span>
            </div>
          `,
        )
        .join("")
    : `<p class="muted">尚未选择文件。选择后会显示文件名、大小、类型和上传时间元数据。</p>`;
}

function importTrainingAndPracticeAssets() {
  const store = currentAssetStore || loadAssets();
  const navigation = loadFromLocalStorage(TRAINING_STATE_KEY, null) || loadFromLocalStorage(NAVIGATION_TRAINING_KEY, null);
  if (navigation?.trainingReport && !store.trainingReports.some((item) => item.content === navigation.trainingReport)) {
    store.trainingReports = [
      {
        id: `training-report-import-${Date.now()}`,
        title: "《新教师教学设计训练报告》",
        type: "新教师训练报告",
        source: "教学导航",
        course: defaultTrainingCourse.courseName,
        updatedAt: navigation.updatedAt || new Date().toISOString(),
        tags: ["教学导航", "20 环节训练", "SWOT"],
        boundary: "来源于教学导航页系统示例课的 20 环节训练，不包含真实泛雅课程数据。",
        summary: "从教学导航状态自动导入的训练报告。",
        usage: "用于进入泛雅实践前校准教学设计思路。",
        reuse: "可复制后用于下一次生成。",
        risk: "示例训练不等同于真实班级数据。",
        content: navigation.trainingReport,
        relatedFiles: [],
      },
      ...(store.trainingReports || []),
    ];
  }
  saveAssets(store);
}

function getDerivedAssets() {
  const navigation = loadFromLocalStorage(TRAINING_STATE_KEY, null) || loadFromLocalStorage(NAVIGATION_TRAINING_KEY, null);
  const derived = [];
  if (navigation?.completedStepIds?.length) {
    derived.push({
      id: "derived-training-record",
      title: "20 环节训练记录",
      type: "20 环节训练记录",
      source: "教学导航",
      course: defaultTrainingCourse.courseName,
      updatedAt: navigation.updatedAt,
      tags: ["教学导航", "训练记录"],
      boundary: "来自浏览器 localStorage 中的教学导航训练状态。",
      summary: `已确认 ${navigation.completedStepIds.length} / ${trainingSteps.length} 个训练环节。`,
      usage: "用于回看训练进度和定位需复查环节。",
      reuse: "可回到教学导航页继续训练。",
      risk: "仅为本机浏览器训练状态，不代表真实课程数据。",
      content: JSON.stringify(
        {
          choices: navigation.choices,
          currentSelections: navigation.currentSelections,
          stepResults: navigation.stepResults,
          completedStepIds: navigation.completedStepIds,
          needsReviewStepIds: navigation.needsReviewStepIds,
        },
        null,
        2,
      ),
      relatedFiles: [],
      derived: true,
    });
    derived.push({
      id: "derived-template-collection",
      title: "优秀模板集合",
      type: "优秀模板集合",
      source: "教学导航",
      course: defaultTrainingCourse.courseName,
      updatedAt: navigation.updatedAt,
      tags: ["模板", "教学导航"],
      boundary: "来自教学导航训练环节生成的优秀模板。",
      summary: "包含已选择环节的模板定位、标准结构、优秀样例、检查清单和常见误区。",
      usage: "用于新教师后续备课参考。",
      reuse: "可复制模板文本并用于下一次生成。",
      risk: "模板仍需结合真实班级和课程规范调整。",
      content: JSON.stringify(navigation.templates || {}, null, 2),
      relatedFiles: [],
      derived: true,
    });
    derived.push({
      id: "derived-score-records",
      title: "多维评分记录",
      type: "多维评分记录",
      source: "教学导航",
      course: defaultTrainingCourse.courseName,
      updatedAt: navigation.updatedAt,
      tags: ["评分", "诊断建议"],
      boundary: "来自教学导航训练环节的模拟评分。",
      summary: "按一致性、真实性、学习者、参与度、评价效度和复盘改进 6 个学术维度记录评分。",
      usage: "用于发现低分维度并优化教学设计。",
      reuse: "可作为生成复盘建议的依据。",
      risk: "评分为前端模拟，不代表真实 AI 评价或教学质量认证。",
      content: JSON.stringify(navigation.scores || {}, null, 2),
      relatedFiles: [],
      derived: true,
    });
  }
  return derived;
}

function getExampleAssets() {
  return [
    {
      id: "example-rubric",
      title: "SWOT 矩阵评价量规",
      type: "评价量规",
      source: "示例资产",
      course: defaultTrainingCourse.courseName,
      updatedAt: new Date().toISOString(),
      tags: ["评价量规", "评价", "证据"],
      boundary: "示例内容，仅用于展示资产结构。",
      summary: "从分类准确性、药学证据质量、决策可行性和风险意识评价学生成果。",
      usage: "用于课堂展示评分和课后反馈。",
      reuse: "可在下一次生成时作为评价模板。",
      risk: "权重需根据学校过程性评价要求调整。",
      content: "分类准确性 30%，证据质量 30%，决策可行性 25%，风险意识 15%。",
      relatedFiles: [],
      derived: true,
    },
  ];
}

function collectAssetItems() {
  const store = currentAssetStore || loadAssets();
  const items = [
    ...(store.trainingReports || []),
    ...(store.practiceReports || []),
    ...(store.generatedRubrics || []),
    ...(store.generatedTasks || []),
    ...(store.uploadedFileMeta || []),
    ...(store.fanyaSyncRecords || []),
    ...getDerivedAssets(),
  ];
  return items.length ? items : getExampleAssets();
}

function normalizeAssetSource(source = "") {
  const value = String(source || "").trim();
  if (/泛雅|学习通|同步/.test(value)) return "泛雅同步";
  if (/教学实践|实践|课堂|作业/.test(value)) return "教学实践";
  if (/上传|知识库|教师/.test(value)) return "教师上传";
  if (/教学导航|导航|训练|示例/.test(value)) return "教学导航";
  return "教师上传";
}

function normalizeAssetType(type = "", title = "", summary = "") {
  const text = `${type} ${title} ${summary}`;
  if (/课程画像|学情|学习起点|新教师训练报告/.test(text)) return "课程画像";
  if (/教学设计|教案|方案|模板|20 环节|20环节/.test(text)) return "教学设计方案";
  if (/课堂活动|活动脚本|研讨|讨论/.test(text)) return "课堂活动脚本";
  if (/案例|情境|素材/.test(text)) return "案例材料";
  if (/评价量规|量规|Rubric|评分|评价标准/.test(text)) return "评价量规";
  if (/学习证据|作业|学生|反馈|提交/.test(text)) return "学习证据";
  if (/复盘|反思|改进/.test(text)) return "教学复盘";
  if (/来源边界|上传材料元数据|边界|数据库/.test(text)) return "来源边界";
  return "其他";
}

function getAssetBoundary(asset) {
  return String(asset.boundary || asset.sourceBoundary || asset.databaseBoundary || "").trim();
}

function getAssetWorkbenchStatus(asset, source) {
  const boundary = getAssetBoundary(asset);
  if (!boundary || /待补充|未标注|未填写|待核验/.test(boundary)) return "待核验";
  if (source === "泛雅同步") return "需更新";
  if (source === "教学实践") return "已用于实践";
  return "可复用";
}

function getAssetWorkbenchStage(asset, source, type) {
  if (asset.stage || asset.step || asset.workflowStep) return asset.stage || asset.step || asset.workflowStep;
  if (source === "教学导航") return type === "评价量规" ? "第 15 环节：课堂表现评价" : "课前教学设计与准备";
  if (source === "教学实践") return "课中教学实施与调控";
  if (source === "泛雅同步") return "课后评价反馈与持续改进";
  return "课程知识库沉淀";
}

function getAssetEvidence(asset) {
  const evidence = [];
  if (Array.isArray(asset.evidence)) evidence.push(...asset.evidence.filter(Boolean));
  if (Array.isArray(asset.relatedFiles)) evidence.push(...asset.relatedFiles.map((file) => file.name || file.title).filter(Boolean));
  if (Array.isArray(asset.files)) evidence.push(...asset.files.map((file) => file.name || file.title).filter(Boolean));
  if (Array.isArray(asset.tags)) evidence.push(...asset.tags.slice(0, 4));
  if (asset.boundary) evidence.push("来源边界记录");
  return Array.from(new Set(evidence.filter(Boolean))).slice(0, 6);
}

function toAssetWorkbenchItem(asset) {
  const source = normalizeAssetSource(asset.source);
  const type = normalizeAssetType(asset.type, asset.title, asset.summary);
  const boundary = getAssetBoundary(asset);
  const evidence = getAssetEvidence(asset);
  return {
    ...asset,
    rawSource: asset.source || "未标注",
    source,
    type,
    status: getAssetWorkbenchStatus(asset, source),
    stage: getAssetWorkbenchStage(asset, source, type),
    boundary: boundary || "待补充",
    usage: asset.usage || "可用于后续教学设计、课堂任务生成、评价量规校准和教学复盘。",
    reuse: asset.reuse || "可复制后作为下一次生成的资产上下文。",
    risk: asset.risk || "正式使用前需教师二次确认来源、授权和评分规范。",
    evidence: evidence.length ? evidence : ["本机浏览器资产记录"],
    raw: asset,
  };
}

function getAssetWorkbenchItems() {
  return collectAssetItems().map(toAssetWorkbenchItem);
}

function getAssetSearchText(asset) {
  return [
    asset.title,
    asset.summary,
    asset.course,
    asset.stage,
    asset.source,
    asset.rawSource,
    asset.type,
    asset.status,
    asset.boundary,
    asset.usage,
    asset.reuse,
    asset.risk,
    ...(asset.evidence || []),
    ...(asset.tags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getFilteredAssetWorkbenchItems() {
  const query = assetFilterState.query.trim().toLowerCase();
  return getAssetWorkbenchItems().filter((asset) => {
    const matchesSource = assetFilterState.source === "全部" || asset.source === assetFilterState.source;
    const matchesType = assetFilterState.type === "全部" || asset.type === assetFilterState.type;
    const matchesStatus = assetFilterState.status === "全部" || asset.status === assetFilterState.status;
    const matchesQuery = !query || getAssetSearchText(asset).includes(query);
    return matchesSource && matchesType && matchesStatus && matchesQuery;
  });
}

function findAssetWorkbenchItem(id) {
  return getAssetWorkbenchItems().find((item) => item.id === id);
}

function getActiveWorkbenchAsset(items = getFilteredAssetWorkbenchItems()) {
  if (!items.length) {
    selectedAssetId = "";
    return null;
  }
  const active = items.find((item) => item.id === selectedAssetId) || items[0];
  selectedAssetId = active.id;
  return active;
}

const ASSET_GRAPH_TYPE_META = {
  core: {
    label: "数据中枢",
    color: "#24483d",
    glow: "rgba(36, 72, 61, 0.22)",
  },
  generated: {
    label: "智能体生成",
    color: "#b96e46",
    glow: "rgba(185, 110, 70, 0.2)",
  },
  training: {
    label: "导航训练",
    color: "#547293",
    glow: "rgba(84, 114, 147, 0.18)",
  },
  knowledge: {
    label: "上传知识库",
    color: "#6f7554",
    glow: "rgba(111, 117, 84, 0.2)",
  },
  fanya: {
    label: "泛雅记录",
    color: "#8a7d57",
    glow: "rgba(138, 125, 87, 0.18)",
  },
  course: {
    label: "关联课程",
    color: "#49756d",
    glow: "rgba(73, 117, 109, 0.18)",
  },
  tag: {
    label: "标签主题",
    color: "#9a8775",
    glow: "rgba(154, 135, 117, 0.16)",
  },
  boundary: {
    label: "来源边界",
    color: "#a0615a",
    glow: "rgba(160, 97, 90, 0.18)",
  },
};

const ASSET_GRAPH_FILTERS = ["all", "generated", "training", "knowledge", "fanya", "course", "tag", "boundary"];

function compactAssetGraphText(value = "", length = 42) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

function normalizeAssetGraphId(prefix, value) {
  return `${prefix}-${String(value || "unknown")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}_-]/gu, "-")}`;
}

function getAssetGraphTypeMeta(type) {
  return ASSET_GRAPH_TYPE_META[type] || ASSET_GRAPH_TYPE_META.generated;
}

function classifyAssetGraphAsset(asset) {
  const source = `${asset.source || ""} ${asset.type || ""} ${asset.title || ""}`;
  if (/上传|知识库|文件元数据|数据库边界/.test(source)) return "knowledge";
  if (/泛雅/.test(source)) return "fanya";
  if (/教学导航|训练|评分记录|模板集合/.test(source)) return "training";
  return "generated";
}

function createAssetGraphNode(id, type, label, summary, extra = {}) {
  const meta = getAssetGraphTypeMeta(type);
  return {
    id,
    type,
    label: compactAssetGraphText(label, type === "boundary" ? 24 : 26),
    fullLabel: String(label || ""),
    summary: compactAssetGraphText(summary, 118),
    color: meta.color,
    glow: meta.glow,
    radius: extra.radius || (type === "core" ? 26 : type === "generated" || type === "training" || type === "knowledge" ? 13 : 8),
    vx: 0,
    vy: 0,
    pulse: Math.random() * Math.PI * 2,
    anchorX: 0,
    anchorY: 0,
    orbit: 0,
    orbitSpeed: 0,
    ...extra,
  };
}

function getAssetGraphNodeCounts(nodes) {
  return nodes.reduce(
    (counts, node) => {
      counts[node.type] = (counts[node.type] || 0) + 1;
      counts.all += 1;
      return counts;
    },
    { all: 0 },
  );
}

function buildAssetKnowledgeGraph() {
  const store = currentAssetStore || loadAssets();
  const assets = collectAssetItems().slice(0, 22);
  const nodes = new Map();
  const links = [];
  const addNode = (node) => {
    if (!nodes.has(node.id)) nodes.set(node.id, node);
    return nodes.get(node.id);
  };
  const addLink = (from, to, weight = 1, label = "") => {
    if (!from || !to || from === to) return;
    links.push({ from, to, weight, label });
  };

  const core = addNode(
    createAssetGraphNode(
      "agent-core",
      "core",
      "教学智能体数据中枢",
      "聚合教学导航训练、教学实践生成材料、上传知识库元数据和来源边界。",
      { radius: 28 },
    ),
  );

  const collectedTags = new Map();
  const collectedBoundaries = new Map();
  const collectedCourses = new Map();

  assets.forEach((asset) => {
    const type = classifyAssetGraphAsset(asset);
    const assetNodeId = `asset-${asset.id}`;
    const assetNode = addNode(
      createAssetGraphNode(assetNodeId, type, asset.title || asset.type || "教学资产", asset.summary || asset.boundary || "", {
        assetId: asset.id,
        source: asset.source,
        course: asset.course || defaultTrainingCourse.courseName,
        metaLine: `${getAssetGraphTypeMeta(type).label} · ${asset.source || "未标注来源"}`,
      }),
    );
    addLink(core.id, assetNode.id, type === "knowledge" ? 1.28 : 1.1, asset.source || "");

    const course = asset.course || defaultTrainingCourse.courseName;
    if (course) {
      const courseId = normalizeAssetGraphId("course", course);
      collectedCourses.set(courseId, course);
      addLink(assetNode.id, courseId, 0.74, "关联课程");
    }

    (asset.tags || []).slice(0, 5).forEach((tag) => {
      const tagId = normalizeAssetGraphId("tag", tag);
      collectedTags.set(tagId, tag);
      addLink(assetNode.id, tagId, 0.66, "标签");
    });

    const boundary = asset.boundary || "";
    if (boundary) {
      const boundaryLabel = compactAssetGraphText(boundary, 28);
      const boundaryId = normalizeAssetGraphId("boundary", boundaryLabel);
      collectedBoundaries.set(boundaryId, boundaryLabel);
      addLink(assetNode.id, boundaryId, 0.8, "来源边界");
    }
  });

  (store.tags || []).slice(0, 8).forEach((tag) => collectedTags.set(normalizeAssetGraphId("tag", tag), tag));
  (store.sourceBoundaries || []).slice(0, 6).forEach((boundary) => {
    const label = compactAssetGraphText(boundary, 28);
    collectedBoundaries.set(normalizeAssetGraphId("boundary", label), label);
  });

  collectedCourses.forEach((course, id) => {
    addNode(createAssetGraphNode(id, "course", course, "课程维度把训练、实践和上传材料连接到同一个教学语境。", { radius: 10 }));
    addLink(core.id, id, 0.62, "课程");
  });
  collectedTags.forEach((tag, id) => {
    addNode(createAssetGraphNode(id, "tag", tag, "标签帮助教师按主题复用教学资产。", { radius: 7 }));
    addLink(core.id, id, 0.38, "标签");
  });
  collectedBoundaries.forEach((boundary, id) => {
    addNode(createAssetGraphNode(id, "boundary", boundary, "来源边界用于提醒教师确认材料范围、授权和引用限制。", { radius: 8 }));
    addLink(core.id, id, 0.48, "边界");
  });

  if (nodes.size === 1) {
    addNode(createAssetGraphNode("asset-empty-hint", "generated", "等待资产沉淀", "保存训练报告、实践材料或上传知识库后，图谱会自动扩展。"));
    addLink(core.id, "asset-empty-hint", 0.72, "待生成");
  }

  return { nodes: Array.from(nodes.values()), links };
}

function restoreAssetGraphPositions(nodes, previousNodes = []) {
  const previous = new Map(previousNodes.map((node) => [node.id, node]));
  nodes.forEach((node) => {
    const old = previous.get(node.id);
    if (!old) return;
    node.x = old.x;
    node.y = old.y;
    node.vx = old.vx;
    node.vy = old.vy;
  });
}

function layoutAssetGraphNodes(state) {
  const width = state.width || 760;
  const height = state.height || 420;
  const centerX = width * 0.5;
  const centerY = height * 0.46;
  const groupCenters = {
    core: { x: centerX, y: centerY, spreadX: 0, spreadY: 0 },
    generated: { x: width * 0.22, y: height * 0.36, spreadX: width * 0.14, spreadY: height * 0.18 },
    training: { x: width * 0.34, y: height * 0.68, spreadX: width * 0.12, spreadY: height * 0.11 },
    knowledge: { x: width * 0.78, y: height * 0.3, spreadX: width * 0.12, spreadY: height * 0.18 },
    fanya: { x: width * 0.78, y: height * 0.62, spreadX: width * 0.09, spreadY: height * 0.12 },
    course: { x: width * 0.64, y: height * 0.48, spreadX: width * 0.06, spreadY: height * 0.07 },
    tag: { x: width * 0.5, y: height * 0.17, spreadX: width * 0.24, spreadY: height * 0.06 },
    boundary: { x: width * 0.48, y: height * 0.8, spreadX: width * 0.26, spreadY: height * 0.06 },
  };
  const groups = state.nodes.reduce((acc, node) => {
    acc[node.type] = acc[node.type] || [];
    acc[node.type].push(node);
    return acc;
  }, {});

  Object.entries(groups).forEach(([type, nodes]) => {
    nodes.forEach((node, index) => {
      const group = groupCenters[type] || groupCenters.generated;
      if (type === "core") {
        node.anchorX = centerX;
        node.anchorY = centerY;
        node.orbit = 0;
        if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) {
          node.x = node.anchorX;
          node.y = node.anchorY;
        }
        return;
      }
      const density = Math.max(nodes.length, 1);
      const phaseOffset = {
        generated: -0.18,
        training: 0.8,
        knowledge: 0.2,
        fanya: 1.1,
        course: -0.45,
        tag: -0.85,
        boundary: 0.55,
      }[type] || 0;
      const adjustedAngle = phaseOffset + (Math.PI * 2 * index) / density;
      node.anchorX = group.x + Math.cos(adjustedAngle) * group.spreadX;
      node.anchorY = group.y + Math.sin(adjustedAngle) * group.spreadY;
      node.orbit = type === "tag" || type === "boundary" ? 1.8 : type === "course" ? 1.2 : 2.6;
      node.orbitSpeed = 0.006 + ((index % 5) * 0.0015);
      node.pulse = node.pulse || adjustedAngle;
      if (!Number.isFinite(node.x) || !Number.isFinite(node.y) || state.forceRelayout) {
        node.x = node.anchorX + Math.cos(adjustedAngle) * Math.min(16, 56 / density);
        node.y = node.anchorY + Math.sin(adjustedAngle) * Math.min(10, 38 / density);
      }
    });
  });
  state.forceRelayout = false;
}

function resizeAssetGraphCanvas() {
  if (!assetGraphState?.canvas) return;
  const { canvas } = assetGraphState;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.round(rect.width || 720));
  const height = Math.max(300, Math.round(rect.height || 420));
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  assetGraphState.width = width;
  assetGraphState.height = height;
  assetGraphState.pixelRatio = ratio;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const context = assetGraphState.context;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  layoutAssetGraphNodes(assetGraphState);
  drawAssetGraphFrame();
}

function isAssetGraphNodeFocused(node) {
  const filter = assetGraphState?.activeFilter || "all";
  if (filter === "all" || node.type === "core") return true;
  if (node.type === filter) return true;
  const focusedIds = new Set(
    (assetGraphState?.links || [])
      .filter((link) => {
        const from = assetGraphState.nodeMap.get(link.from);
        const to = assetGraphState.nodeMap.get(link.to);
        return from?.type === filter || to?.type === filter;
      })
      .flatMap((link) => [link.from, link.to]),
  );
  return focusedIds.has(node.id);
}

function updateAssetGraphPhysics() {
  const state = assetGraphState;
  if (!state || state.reducedMotion) return;
  const width = state.width;
  const height = state.height;
  const nodes = state.nodes;

  for (let i = 0; i < nodes.length; i += 1) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j += 1) {
      const b = nodes[j];
      const dx = b.x - a.x || 0.01;
      const dy = b.y - a.y || 0.01;
      const distSq = dx * dx + dy * dy;
      const minDistance = a.radius + b.radius + 16;
      const force = Math.min(0.3, (minDistance * minDistance) / Math.max(distSq, 120)) * 0.008;
      a.vx -= dx * force;
      a.vy -= dy * force;
      b.vx += dx * force;
      b.vy += dy * force;
    }
  }

  state.links.forEach((link) => {
    const from = state.nodeMap.get(link.from);
    const to = state.nodeMap.get(link.to);
    if (!from || !to) return;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
    const target = 120 + (1.2 - link.weight) * 36;
    const pull = (distance - target) * 0.00018 * link.weight;
    const fx = dx * pull;
    const fy = dy * pull;
    from.vx += fx;
    from.vy += fy;
    to.vx -= fx;
    to.vy -= fy;
  });

  nodes.forEach((node) => {
    const focus = isAssetGraphNodeFocused(node) ? 1 : 0.34;
    const orbitX = node.anchorX + Math.cos(node.pulse * 0.7) * (node.orbit || 0);
    const orbitY = node.anchorY + Math.sin(node.pulse * 0.9) * (node.orbit || 0);
    node.vx += (orbitX - node.x) * 0.018 * focus;
    node.vy += (orbitY - node.y) * 0.018 * focus;
    if (state.pointer?.active) {
      const dx = node.x - state.pointer.x;
      const dy = node.y - state.pointer.y;
      const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      if (distance < 86) {
        const push = ((86 - distance) / 86) * 0.14;
        node.vx += (dx / distance) * push;
        node.vy += (dy / distance) * push;
      }
    }
    node.vx *= 0.76;
    node.vy *= 0.76;
    node.x = Math.min(width - node.radius - 8, Math.max(node.radius + 8, node.x + node.vx));
    node.y = Math.min(height - node.radius - 8, Math.max(node.radius + 8, node.y + node.vy));
    node.pulse += node.orbitSpeed || 0.006;
  });
}

function drawAssetGraphFrame() {
  const state = assetGraphState;
  if (!state?.context) return;
  const { context, width, height } = state;
  context.clearRect(0, 0, width, height);
  drawAssetGraphBackground(context, width, height, state);

  state.links.forEach((link) => {
    const from = state.nodeMap.get(link.from);
    const to = state.nodeMap.get(link.to);
    if (!from || !to) return;
    const focus = isAssetGraphNodeFocused(from) && isAssetGraphNodeFocused(to);
    const selectedByNode =
      state.selectedNodeId &&
      state.selectedNodeId !== "agent-core" &&
      (state.selectedNodeId === from.id || state.selectedNodeId === to.id);
    const selectedByHover = state.hoveredNodeId === from.id || state.hoveredNodeId === to.id;
    const selected = selectedByNode || selectedByHover;
    context.save();
    context.globalAlpha = selected ? 0.58 : focus ? 0.14 : 0.035;
    context.strokeStyle = selected ? "#a75f3d" : "#9b8a76";
    context.lineWidth = selected ? 1.6 : 0.9;
    context.beginPath();
    context.moveTo(from.x, from.y);
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2 - 8;
    context.quadraticCurveTo(midX, midY, to.x, to.y);
    context.stroke();
    context.restore();
  });

  state.nodes.forEach((node) => {
    const focus = isAssetGraphNodeFocused(node);
    const selected = state.selectedNodeId === node.id;
    const hovered = state.hoveredNodeId === node.id;
    const pulse = state.reducedMotion ? 0 : Math.sin(node.pulse * 1.6) * 0.9;
    const radius = node.radius + (selected || hovered ? 2.6 : pulse);
    context.save();
    context.globalAlpha = focus ? 1 : 0.2;
    context.fillStyle = node.glow;
    context.beginPath();
    context.arc(node.x, node.y, radius + (selected || hovered ? 13 : 8), 0, Math.PI * 2);
    context.fill();
    context.fillStyle = node.color;
    context.beginPath();
    context.arc(node.x, node.y, radius, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = selected ? "rgba(255, 250, 242, 0.96)" : "rgba(255, 250, 242, 0.84)";
    context.lineWidth = selected ? 2.2 : 1.2;
    context.stroke();
    context.fillStyle = "rgba(255, 255, 255, 0.42)";
    context.beginPath();
    context.arc(node.x - radius * 0.28, node.y - radius * 0.32, Math.max(1.4, radius * 0.18), 0, Math.PI * 2);
    context.fill();
    if (node.type === "core" || selected || hovered) {
      context.fillStyle = selected || hovered ? "#2f2923" : "rgba(47, 41, 35, 0.82)";
      context.font = `${selected || hovered ? 700 : 620} ${node.type === "core" ? 13 : 11}px sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "top";
      context.fillText(node.label, node.x, node.y + radius + 7);
    }
    context.restore();
  });
}

function animateAssetGraph() {
  updateAssetGraphPhysics();
  drawAssetGraphFrame();
  if (!assetGraphState?.reducedMotion) {
    assetGraphState.animationFrame = requestAnimationFrame(animateAssetGraph);
  }
}

function drawAssetGraphBackground(context, width, height, state) {
  context.fillStyle = "#fbf7ee";
  context.fillRect(0, 0, width, height);

  const glow = context.createRadialGradient(width * 0.48, height * 0.5, 20, width * 0.5, height * 0.5, Math.max(width, height) * 0.72);
  glow.addColorStop(0, "rgba(255, 253, 247, 0.96)");
  glow.addColorStop(0.52, "rgba(241, 234, 222, 0.7)");
  glow.addColorStop(1, "rgba(222, 232, 215, 0.36)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  const core = state.nodeMap.get("agent-core");
  const cx = core?.x || width * 0.48;
  const cy = core?.y || height * 0.52;
  context.save();
  context.strokeStyle = "rgba(83, 99, 82, 0.12)";
  context.lineWidth = 1;
  [0.32, 0.52, 0.72].forEach((scale, index) => {
    context.beginPath();
    context.ellipse(cx, cy, width * scale * 0.46, height * scale * 0.34, -0.08, 0, Math.PI * 2);
    context.setLineDash(index === 1 ? [3, 8] : []);
    context.stroke();
  });
  context.setLineDash([]);

  const labels = [
    ["生成材料", width * 0.18, height * 0.18],
    ["上传知识库", width * 0.7, height * 0.16],
    ["来源边界", width * 0.64, height * 0.9],
  ];
  context.font = "700 11px sans-serif";
  context.fillStyle = "rgba(96, 83, 70, 0.42)";
  context.textAlign = "center";
  labels.forEach(([label, x, y]) => context.fillText(label, x, y));

  for (let i = 0; i < 34; i += 1) {
    const angle = i * 2.399 + (state.nodes[0]?.pulse || 0) * 0.2;
    const radius = (Math.min(width, height) * (0.18 + (i % 5) * 0.055));
    const x = cx + Math.cos(angle) * radius * 1.08;
    const y = cy + Math.sin(angle) * radius * 0.72;
    context.globalAlpha = 0.14 + (i % 3) * 0.04;
    context.fillStyle = i % 4 === 0 ? "#b96e46" : "#6f7554";
    context.beginPath();
    context.arc(x, y, i % 6 === 0 ? 1.8 : 1.1, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function getAssetGraphPointer(event) {
  const rect = assetGraphState.canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function getAssetGraphNodeAtPoint(point) {
  if (!assetGraphState) return null;
  let nearest = null;
  let nearestDistance = Infinity;
  assetGraphState.nodes.forEach((node) => {
    const dx = point.x - node.x;
    const dy = point.y - node.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= node.radius + 12 && distance < nearestDistance) {
      nearest = node;
      nearestDistance = distance;
    }
  });
  return nearest;
}

function showAssetGraphTooltip(node, point) {
  const tooltip = $("#assetGraphTooltip");
  if (!tooltip || !node) return;
  tooltip.hidden = false;
  tooltip.innerHTML = `
    <strong>${escapeHtml(node.fullLabel || node.label)}</strong>
    <span>${escapeHtml(getAssetGraphTypeMeta(node.type).label)}</span>
  `;
  tooltip.style.left = `${Math.min(point.x + 16, (assetGraphState.width || 360) - 180)}px`;
  tooltip.style.top = `${Math.max(12, point.y - 14)}px`;
}

function hideAssetGraphTooltip() {
  const tooltip = $("#assetGraphTooltip");
  if (tooltip) tooltip.hidden = true;
}

function renderAssetGraphDetail(node) {
  const detail = $("#assetGraphDetail");
  if (!detail || !node) return;
  const typeMeta = getAssetGraphTypeMeta(node.type);
  detail.innerHTML = `
    <span>${escapeHtml(typeMeta.label)}</span>
    <strong>${escapeHtml(node.fullLabel || node.label)}</strong>
    <p>${escapeHtml(node.summary || "该节点由当前资产库数据自动聚合生成。")}</p>
    <dl>
      ${node.source ? `<div><dt>来源</dt><dd>${escapeHtml(node.source)}</dd></div>` : ""}
      ${node.course ? `<div><dt>关联课程</dt><dd>${escapeHtml(node.course)}</dd></div>` : ""}
      ${node.metaLine ? `<div><dt>节点说明</dt><dd>${escapeHtml(node.metaLine)}</dd></div>` : ""}
    </dl>
  `;
}

function selectAssetGraphNode(nodeId, options = {}) {
  if (!assetGraphState) return;
  const node = assetGraphState.nodeMap.get(nodeId);
  if (!node) return;
  assetGraphState.selectedNodeId = node.id;
  renderAssetGraphDetail(node);
  drawAssetGraphFrame();
  if (options.syncAssetDetail && node.assetId) viewAssetDetail(node.assetId, { skipGraphSync: true });
}

function highlightAssetGraphNodeByAsset(assetId) {
  if (!assetId) return;
  selectedAssetId = assetId;
  renderAssetKnowledgeGraph();
}

function bindAssetGraphCanvas(canvas) {
  if (canvas.dataset.assetGraphReady === "true") return;
  canvas.dataset.assetGraphReady = "true";
  canvas.addEventListener("pointermove", (event) => {
    if (!assetGraphState) return;
    const point = getAssetGraphPointer(event);
    assetGraphState.pointer = { ...point, active: true };
    const node = getAssetGraphNodeAtPoint(point);
    assetGraphState.hoveredNodeId = node?.id || "";
    canvas.style.cursor = node ? "pointer" : "default";
    if (node) showAssetGraphTooltip(node, point);
    else hideAssetGraphTooltip();
  });
  canvas.addEventListener("pointerleave", () => {
    if (!assetGraphState) return;
    assetGraphState.pointer = null;
    assetGraphState.hoveredNodeId = "";
    hideAssetGraphTooltip();
    drawAssetGraphFrame();
  });
  canvas.addEventListener("click", (event) => {
    if (!assetGraphState) return;
    const node = getAssetGraphNodeAtPoint(getAssetGraphPointer(event));
    if (node) selectAssetGraphNode(node.id, { syncAssetDetail: true });
  });
  window.addEventListener("resize", resizeAssetGraphCanvas);
}

function renderAssetGraphControls() {
  const state = assetGraphState;
  if (!state) return;
  const counts = getAssetGraphNodeCounts(state.nodes);
  const filterTarget = $("#assetGraphFilters");
  const legendTarget = $("#assetGraphLegend");
  const kpisTarget = $("#assetGraphKpis");
  const filterLabels = {
    all: "全部",
    generated: "智能体生成",
    training: "导航训练",
    knowledge: "上传知识库",
    fanya: "泛雅记录",
    course: "课程",
    tag: "标签",
    boundary: "来源边界",
  };
  if (kpisTarget) {
    kpisTarget.innerHTML = `
      <div><strong>${state.nodes.length}</strong><span>节点</span></div>
      <div><strong>${state.links.length}</strong><span>关系</span></div>
      <div><strong>${counts.knowledge || 0}</strong><span>知识库</span></div>
    `;
  }
  if (filterTarget) {
    filterTarget.innerHTML = ASSET_GRAPH_FILTERS.map(
      (filter) => `
        <button type="button" data-asset-graph-filter="${filter}" class="${state.activeFilter === filter ? "is-active" : ""}">
          ${escapeHtml(filterLabels[filter])}<span>${counts[filter] || (filter === "all" ? counts.all : 0)}</span>
        </button>
      `,
    ).join("");
    $$("[data-asset-graph-filter]", filterTarget).forEach((button) => {
      button.addEventListener("click", () => {
        state.activeFilter = button.dataset.assetGraphFilter || "all";
        renderAssetGraphControls();
        drawAssetGraphFrame();
      });
    });
  }
  if (legendTarget) {
    legendTarget.innerHTML = Object.entries(ASSET_GRAPH_TYPE_META)
      .filter(([type]) => type !== "core")
      .map(
        ([type, meta]) => `
          <span><i style="--legend-color:${meta.color}"></i>${escapeHtml(meta.label)}</span>
        `,
      )
      .join("");
  }
}

function renderAssetKnowledgeGraph() {
  if (assetGraphState?.animationFrame) cancelAnimationFrame(assetGraphState.animationFrame);
  assetGraphState = null;
  const target = $("#assetKnowledgeCanvas");
  if (!target) return;
  const allItems = getAssetWorkbenchItems();
  const filteredItems = getFilteredAssetWorkbenchItems();
  const active = getActiveWorkbenchAsset(filteredItems);
  const empty = $("#assetGraphEmpty");
  if (empty) empty.hidden = Boolean(active);
  if (!active) {
    target.innerHTML = "";
    renderAssetRelationInspector(null, allItems, filteredItems);
    return;
  }

  const relationNodes = [
    {
      key: "source",
      label: active.source,
      title: "来源",
      desc: active.rawSource && active.rawSource !== active.source ? active.rawSource : "来自当前资产库记录",
    },
    {
      key: "stage",
      label: active.stage,
      title: "教学场景",
      desc: `${active.course || defaultTrainingCourse.courseName} · ${active.type}`,
    },
    {
      key: "boundary",
      label: "来源边界",
      title: active.boundary,
      desc: active.status === "待核验" ? "需要教师补充或核验" : "已进入资产说明书",
    },
    {
      key: "reuse",
      label: "复用任务",
      title: getAssetPrimaryReuse(active),
      desc: "用于下一次生成前仍需教师确认",
    },
  ];

  target.innerHTML = `
    <div class="asset-relation-map-inner">
      <svg class="asset-relation-lines" viewBox="0 0 920 360" fill="none" aria-hidden="true">
        <path d="M212 90 C318 104 362 154 424 174" />
        <path d="M708 88 C604 106 556 150 496 174" />
        <path d="M222 276 C322 252 368 210 424 186" />
        <path d="M698 278 C602 252 554 210 496 186" />
      </svg>
      <div class="asset-relation-center">
        <span>当前资产</span>
        <strong>${escapeHtml(active.title)}</strong>
        <small>${escapeHtml(active.type)} · ${escapeHtml(active.status)}</small>
      </div>
      ${relationNodes.map(renderAssetRelationNode).join("")}
    </div>
  `;
  renderAssetRelationInspector(active, allItems, filteredItems);
}

function renderAssetRelationNode(node) {
  return `
    <article class="asset-relation-node relation-${escapeHtml(node.key)}">
      <span>${escapeHtml(node.label)}</span>
      <strong>${escapeHtml(node.title)}</strong>
      <p>${escapeHtml(node.desc)}</p>
    </article>
  `;
}

function getAssetPrimaryReuse(asset) {
  if (asset.type === "评价量规") return "生成评价量规或作业评分标准";
  if (asset.type === "课堂活动脚本") return "生成课堂活动说明";
  if (asset.type === "案例材料") return "生成学生任务单";
  if (asset.type === "教学复盘" || asset.type === "学习证据") return "生成教学复盘报告";
  return "生成下一次课教学设计";
}

function renderAssetRelationInspector(active, allItems, filteredItems) {
  const kpisTarget = $("#assetGraphKpis");
  const filtersTarget = $("#assetGraphFilters");
  const legendTarget = $("#assetGraphLegend");
  const detailTarget = $("#assetGraphDetail");
  const sourceCounts = ASSET_SOURCE_FILTERS.slice(1).map((source) => ({
    source,
    count: allItems.filter((asset) => asset.source === source).length,
  }));
  if (kpisTarget) {
    kpisTarget.innerHTML = `
      <div><strong>${allItems.length}</strong><span>资产</span></div>
      <div><strong>${filteredItems.length}</strong><span>当前结果</span></div>
      <div><strong>${allItems.filter((asset) => asset.status === "待核验").length}</strong><span>待核验</span></div>
    `;
  }
  if (filtersTarget) {
    filtersTarget.innerHTML = sourceCounts
      .map(
        (item) => `
          <button type="button" data-asset-graph-source="${escapeHtml(item.source)}" class="${assetFilterState.source === item.source ? "is-active" : ""}">
            ${escapeHtml(item.source)}<span>${item.count}</span>
          </button>
        `,
      )
      .join("");
    $$("[data-asset-graph-source]", filtersTarget).forEach((button) => {
      button.addEventListener("click", () => {
        assetFilterState.source = assetFilterState.source === button.dataset.assetGraphSource ? "全部" : button.dataset.assetGraphSource || "全部";
        refreshAssetWorkbench();
      });
    });
  }
  if (legendTarget) {
    legendTarget.innerHTML = `
      <span><i style="--legend-color:#547293"></i>来源</span>
      <span><i style="--legend-color:#7f8f68"></i>教学场景</span>
      <span><i style="--legend-color:#b96e46"></i>边界</span>
      <span><i style="--legend-color:#2f7d68"></i>复用</span>
    `;
  }
  if (detailTarget) {
    detailTarget.innerHTML = active
      ? `
        <span>证据链边界</span>
        <strong>${escapeHtml(active.title)}</strong>
        <p>${escapeHtml(active.summary || "该资产由当前资产库记录自动整理。")}</p>
        <dl>
          <div><dt>来源</dt><dd>${escapeHtml(active.source)} / ${escapeHtml(active.rawSource || active.source)}</dd></div>
          <div><dt>边界</dt><dd>${escapeHtml(active.boundary)}</dd></div>
          <div><dt>复用</dt><dd>${escapeHtml(getAssetPrimaryReuse(active))}</dd></div>
        </dl>
      `
      : `
        <span>当前资产</span>
        <strong>暂无可解释资产</strong>
        <p>保存训练报告、实践材料或知识库元数据后，这里会展示来源、边界和复用任务。</p>
      `;
  }
}

function renderAssetList() {
  const list = $("#assetList");
  if (!list) return;
  const items = getFilteredAssetWorkbenchItems();
  const active = getActiveWorkbenchAsset(items);
  $("#assetResultCount") && ($("#assetResultCount").textContent = `${items.length} 项结果`);
  if (!items.length) {
    list.innerHTML = `
      <div class="asset-empty-state">
        <strong>未找到匹配资产</strong>
        <p>请放宽来源、类型、状态筛选，或清空搜索关键词。</p>
      </div>
    `;
    return;
  }
  list.innerHTML = items.map(renderAssetRow).join("");
  if (active) syncAssetCardSelection(active.id);
  $$("[data-asset-card]", list).forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      viewAssetDetail(card.dataset.assetCard);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      viewAssetDetail(card.dataset.assetCard);
    });
  });
  bindAssetActions(list);
}

function renderAssetRow(asset) {
  const tags = asset.tags || [];
  const assetId = escapeHtml(asset.id);
  const statusTone = asset.status === "可复用" ? "is-ready" : asset.status === "待核验" ? "is-review" : asset.status === "需更新" ? "is-stale" : "is-used";
  return `
    <article class="asset-row asset-card ${selectedAssetId === asset.id ? "is-selected" : ""}" data-asset-card="${assetId}" tabindex="0" aria-selected="${selectedAssetId === asset.id ? "true" : "false"}">
      <div>
        <div class="asset-topline">
          <h3>${escapeHtml(asset.title)}</h3>
          <div class="asset-badge-row">
            <span class="asset-tag">${escapeHtml(asset.type)}</span>
            <span class="asset-source-chip">${escapeHtml(asset.source)}</span>
            <span class="asset-status-chip ${statusTone}">${escapeHtml(asset.status)}</span>
          </div>
        </div>
        <p class="muted">${escapeHtml(asset.summary || "")}</p>
        <div class="asset-meta">
          <span>课程：${escapeHtml(asset.course || defaultTrainingCourse.courseName)}</span>
          <span>场景：${escapeHtml(asset.stage)}</span>
          <span>边界：${escapeHtml(asset.boundary)}</span>
          <span>更新时间：${formatDate(asset.updatedAt)}</span>
        </div>
        <div class="tag-row">${(asset.evidence || tags).slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
      </div>
      <div class="asset-actions">
        <button type="button" data-view-asset="${assetId}">查看</button>
        <button type="button" data-copy-asset="${assetId}">复制</button>
        <button type="button" data-use-asset="${assetId}">用于下一次生成</button>
        <button type="button" data-delete-asset="${assetId}" ${asset.derived ? "disabled" : ""}>删除</button>
      </div>
    </article>
  `;
}

function findAsset(id) {
  return collectAssetItems().find((item) => item.id === id);
}

function bindAssetActions(root = document) {
  $$("[data-view-asset]", root).forEach((button) => button.addEventListener("click", () => viewAssetDetail(button.dataset.viewAsset)));
  $$("[data-copy-asset]", root).forEach((button) =>
    button.addEventListener("click", () => {
      const asset = findAssetWorkbenchItem(button.dataset.copyAsset);
      if (asset) copyText(asset.content || asset.summary || asset.title);
    }),
  );
  $$("[data-use-asset]", root).forEach((button) =>
    button.addEventListener("click", () => {
      const asset = findAssetWorkbenchItem(button.dataset.useAsset);
      if (!asset) return;
      copyText(buildAssetReusePrompt(asset, getAssetPrimaryReuse(asset)));
      showToast("已复制“用于下一次生成”的提示词");
    }),
  );
  $$("[data-delete-asset]", root).forEach((button) => button.addEventListener("click", () => deleteAsset(button.dataset.deleteAsset)));
}

function buildAssetReusePrompt(asset, actionLabel) {
  return [
    `请基于以下教学资产继续生成：${actionLabel}`,
    `资产标题：${asset.title}`,
    `课程语境：${asset.course || defaultTrainingCourse.courseName}`,
    `教学场景：${asset.stage}`,
    `内容摘要：${asset.summary || "暂无摘要"}`,
    `来源边界：${asset.boundary}`,
    `风险提醒：${asset.risk}`,
  ].join("\n");
}

function bindAssetReuseActions() {
  $$("[data-reuse-action]").forEach((button) => {
    if (button.dataset.assetReuseReady === "true") return;
    button.dataset.assetReuseReady = "true";
    button.addEventListener("click", () => {
      const active = findAssetWorkbenchItem(selectedAssetId) || getActiveWorkbenchAsset(getFilteredAssetWorkbenchItems());
      if (!active) {
        showToast("请先选择一个可复用资产");
        return;
      }
      const actionLabels = {
        lesson: "下一次课教学设计",
        activity: "课堂活动说明",
        task: "学生任务单",
        rubric: "评价量规",
        review: "教学复盘报告",
      };
      const label = actionLabels[button.dataset.reuseAction] || getAssetPrimaryReuse(active);
      copyText(buildAssetReusePrompt(active, label));
      showToast(`已复制“${label}”生成提示词`);
    });
  });
}

function syncAssetCardSelection(activeId = selectedAssetId) {
  $$("[data-asset-card]").forEach((card) => {
    const isActive = card.dataset.assetCard === activeId;
    card.classList.toggle("is-selected", isActive);
    card.setAttribute("aria-selected", String(isActive));
  });
}

function viewAssetDetail(id, options = {}) {
  const detail = $("#assetDetail");
  const asset = findAssetWorkbenchItem(id);
  if (!detail || !asset) return;
  selectedAssetId = asset.id;
  const assetId = escapeHtml(asset.id);
  detail.innerHTML = `
    <article class="detail-card asset-manual-card">
      <div class="asset-manual-head">
        <div>
          <span class="asset-manual-label">当前资产</span>
          <h3>${escapeHtml(asset.title)}</h3>
        </div>
        <span class="asset-status-chip ${asset.status === "可复用" ? "is-ready" : asset.status === "待核验" ? "is-review" : asset.status === "需更新" ? "is-stale" : "is-used"}">${escapeHtml(asset.status)}</span>
      </div>
      <div class="asset-badge-row">
        <span class="asset-tag">${escapeHtml(asset.type)}</span>
        <span class="asset-source-chip">${escapeHtml(asset.source)}</span>
        <span class="asset-source-chip">来源边界：${escapeHtml(asset.boundary)}</span>
      </div>
      <dl>
        <div><dt>类型</dt><dd>${escapeHtml(asset.type || "未标注")}</dd></div>
        <div><dt>来源</dt><dd>${escapeHtml(asset.source || "未标注")}</dd></div>
        <div><dt>教学场景</dt><dd>${escapeHtml(asset.stage || "未标注")}</dd></div>
        <div><dt>来源边界</dt><dd>${escapeHtml(asset.boundary || "待补充")}</dd></div>
        <div><dt>内容摘要</dt><dd>${escapeHtml(asset.summary || "暂无摘要")}</dd></div>
        <div><dt>教学用途</dt><dd>${escapeHtml(asset.usage || "可用于教学设计")}</dd></div>
        <div><dt>可复用方式</dt><dd>${escapeHtml(asset.reuse || "可复制后用于下一次生成")}</dd></div>
        <div><dt>风险提醒</dt><dd>${escapeHtml(asset.risk || "使用前请教师二次确认")}</dd></div>
        <div><dt>关联材料</dt><dd>${asset.evidence?.length ? asset.evidence.map((item) => escapeHtml(item)).join("；") : "暂无关联文件元数据"}</dd></div>
      </dl>
      <div class="asset-manual-actions">
        <button type="button" data-copy-asset="${assetId}">复制资产内容</button>
        <button type="button" data-use-asset="${assetId}">基于该资产生成下一步</button>
      </div>
    </article>
  `;
  bindAssetActions(detail);
  if (!options.skipListSync) syncAssetCardSelection(asset.id);
  if (!options.skipGraphSync) highlightAssetGraphNodeByAsset(id);
}

function renderEmptyAssetDetail() {
  const detail = $("#assetDetail");
  if (!detail) return;
  detail.innerHTML = `<p class="muted">当前筛选条件下没有资产。请放宽筛选，或导入新的课程材料。</p>`;
}

function deleteAsset(id) {
  const store = currentAssetStore || loadAssets();
  const collections = ["uploadedFileMeta", "trainingReports", "practiceReports", "generatedRubrics", "generatedTasks", "fanyaSyncRecords"];
  collections.forEach((key) => {
    store[key] = (store[key] || []).filter((item) => item.id !== id);
  });
  saveAssets(store);
  if (selectedAssetId === id) selectedAssetId = "";
  renderAssetOverview();
  refreshAssetWorkbench();
  showToast("资产已删除");
}

function makeDefaultWorkflowPositions() {
  return Object.fromEntries(workflowNodeBlueprints.map((node) => [node.id, { x: node.x, y: node.y }]));
}

function workflowEdgeId(edge) {
  return `${edge.from}->${edge.to}`;
}

function getWorkflowTypeLabel(type) {
  const labels = {
    main: "主流程",
    diagnosis: "智能诊断",
    subflow: "循环子流程",
    capability: "智能能力层",
    evaluation: "评价依据层",
    data: "数据闭环层",
    output: "最终产出",
  };
  return labels[type] || "工作流节点";
}

function getWorkflowEdgeColor(type) {
  const colors = {
    main: "#6558f5",
    capability: "#7c6df0",
    evaluation: "#31a66a",
    data: "#12a99a",
    feedback: "#e28a23",
  };
  return colors[type] || "#657083";
}

function getWorkflowNodePosition(nodeId) {
  const node = workflowNodeMap.get(nodeId);
  const position = workflowState.nodePositions[nodeId] || { x: node?.x || 0, y: node?.y || 0 };
  return {
    x: position.x,
    y: position.y,
    w: node?.width || node?.w || 250,
    h: node?.height || node?.h || 150,
  };
}

function nodeMatchesWorkflowQuery(node) {
  const query = workflowState.query.trim().toLowerCase();
  if (!query) return true;
  const text = [
    node.title,
    node.type,
    getWorkflowTypeLabel(node.type),
    node.description,
    ...(node.items || []),
  ]
    .join(" ")
    .toLowerCase();
  return text.includes(query);
}

function initWorkflowPage() {
  if (!$("#workflowCanvas")) return;
  workflowState.nodePositions = makeDefaultWorkflowPositions();
  renderWorkflowPage();
  bindWorkflowControls();
  bindWorkflowCanvasPan();
  window.requestAnimationFrame(fitWorkflowCanvas);
  window.addEventListener("resize", fitWorkflowCanvas);
}

function renderWorkflowPage() {
  renderWorkflowLanes();
  renderWorkflowNodes();
  renderWorkflowEdges();
  updateWorkflowTransform();
}

function fitWorkflowCanvas() {
  const canvas = $("#workflowCanvas");
  if (!canvas) return;
  const canvasWidth = canvas.clientWidth || window.innerWidth;
  const canvasHeight = canvas.clientHeight || window.innerHeight;
  const zoom = Math.min((canvasWidth - 56) / WORKFLOW_CANVAS_WIDTH, (canvasHeight - 56) / WORKFLOW_CANVAS_HEIGHT);
  workflowState.zoom = clamp(zoom, 0.38, 1);
  workflowState.panX = Math.max(20, (canvasWidth - WORKFLOW_CANVAS_WIDTH * workflowState.zoom) / 2);
  workflowState.panY = Math.max(20, (canvasHeight - WORKFLOW_CANVAS_HEIGHT * workflowState.zoom) / 2);
  updateWorkflowTransform();
}

function renderWorkflowLanes() {
  const layer = $("#workflowLanes");
  if (!layer) return;
  layer.innerHTML = workflowLanes
    .map(
      (lane) => `
        <section
          class="workflow-lane workflow-lane--${escapeHtml(lane.type)}"
          style="left: ${lane.x}px; top: ${lane.y}px; width: ${lane.width}px; height: ${lane.height}px;"
        >
          <span>${escapeHtml(lane.title)}</span>
          <b>${escapeHtml(lane.caption)}</b>
        </section>
      `,
    )
    .join("");
}

function renderWorkflowNodes() {
  const layer = $("#workflowNodes");
  if (!layer) return;
  layer.innerHTML = workflowNodeBlueprints
    .map((node) => {
      const position = getWorkflowNodePosition(node.id);
      const isSelected = workflowState.selectedNodeId === node.id;
      const isFiltered = !nodeMatchesWorkflowQuery(node);
      const isRunning = workflowEdges.find((edge) => edge.to === node.id && workflowEdgeId(edge) === workflowState.runningEdgeId);
      const typeLabel = getWorkflowTypeLabel(node.type);
      const details = node.items?.length
        ? `<ul class="workflow-node-list">${node.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : "";
      const loopMark = node.type === "subflow" ? `<span class="workflow-loop-mark" aria-hidden="true"></span>` : "";
      return `
        <article
          class="workflow-node workflow-node--${escapeHtml(node.type)} ${isSelected ? "is-selected" : ""} ${isFiltered ? "is-filtered" : ""} ${isRunning ? "is-running" : ""}"
          data-node-id="${escapeHtml(node.id)}"
          role="button"
          tabindex="0"
          aria-label="${escapeHtml(node.title)}"
          style="left: ${position.x}px; top: ${position.y}px; width: ${position.w}px; min-height: ${position.h}px;"
        >
          <span class="workflow-port in" aria-hidden="true"></span>
          <span class="workflow-port out" aria-hidden="true"></span>
          <div class="workflow-node-head">
            <span class="workflow-node-kind">${escapeHtml(typeLabel)}</span>
            ${loopMark}
          </div>
          <h3>${escapeHtml(node.title)}</h3>
          <p>${escapeHtml(node.description)}</p>
          ${details}
        </article>
      `;
    })
    .join("");

  $$("[data-node-id]", layer).forEach((element) => {
    const nodeId = element.dataset.nodeId;
    element.addEventListener("pointerdown", (event) => startWorkflowNodeDrag(event, nodeId));
    element.addEventListener("pointermove", moveWorkflowNode);
    element.addEventListener("pointerup", stopWorkflowNodeDrag);
    element.addEventListener("pointercancel", stopWorkflowNodeDrag);
    element.addEventListener("click", () => selectWorkflowNode(nodeId));
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectWorkflowNode(nodeId, true);
      }
    });
  });
}

function renderWorkflowEdges() {
  const svg = $("#workflowEdges");
  if (!svg) return;
  const downstreamEdges = getWorkflowDownstreamEdgeIds(workflowState.pathFocusNodeId);
  const selectedId = workflowState.selectedNodeId;
  const defs = `
    <defs>
      <marker id="workflowArrowMain" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#6558f5"></path>
      </marker>
      <marker id="workflowArrowCapability" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#7c6df0"></path>
      </marker>
      <marker id="workflowArrowEvaluation" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#31a66a"></path>
      </marker>
      <marker id="workflowArrowData" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#12a99a"></path>
      </marker>
      <marker id="workflowArrowFeedback" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#e28a23"></path>
      </marker>
    </defs>
  `;
  const paths = workflowEdges
    .map((edge, index) => {
      const from = getWorkflowNodePosition(edge.from);
      const to = getWorkflowNodePosition(edge.to);
      const fromCenterX = from.x + from.w / 2;
      const fromCenterY = from.y + from.h / 2;
      const toCenterX = to.x + to.w / 2;
      const toCenterY = to.y + to.h / 2;
      const sameLayer = Math.abs(fromCenterY - toCenterY) < 90;
      const flowsRight = toCenterX >= fromCenterX;
      let startX = flowsRight ? from.x + from.w : from.x;
      let startY = fromCenterY;
      let endX = flowsRight ? to.x : to.x + to.w;
      let endY = toCenterY;
      let labelX = (startX + endX) / 2;
      let labelY = (startY + endY) / 2 - 10;
      let d = "";

      if (edge.type === "feedback") {
        d = `M ${startX} ${startY} C ${startX} ${edge.arcY || startY}, ${endX} ${edge.arcY || endY}, ${endX} ${endY}`;
        labelX = (startX + endX) / 2;
        labelY = (edge.arcY || (startY + endY) / 2) - 14;
      } else if (edge.type === "main" || sameLayer) {
        const distance = Math.abs(endX - startX);
        const direction = flowsRight ? 1 : -1;
        const curve = Math.max(92, Math.min(280, distance * 0.46));
        d = `M ${startX} ${startY} C ${startX + direction * curve} ${startY}, ${endX - direction * curve} ${endY}, ${endX} ${endY}`;
      } else {
        const targetIsAbove = toCenterY < fromCenterY;
        startX = fromCenterX;
        startY = targetIsAbove ? from.y : from.y + from.h;
        endX = toCenterX;
        endY = targetIsAbove ? to.y + to.h : to.y;
        const routeY = edge.routeY || (startY + endY) / 2;
        d = `M ${startX} ${startY} L ${startX} ${routeY} L ${endX} ${routeY} L ${endX} ${endY}`;
        labelX = (startX + endX) / 2;
        labelY = routeY - 12;
      }
      const id = workflowEdgeId(edge);
      const isHighlighted = edge.from === selectedId || edge.to === selectedId || downstreamEdges.has(id);
      const isRunning = workflowState.runningEdgeId === id;
      const edgeColor = edge.color || getWorkflowEdgeColor(edge.type);
      const markerId = {
        main: "workflowArrowMain",
        capability: "workflowArrowCapability",
        evaluation: "workflowArrowEvaluation",
        data: "workflowArrowData",
        feedback: "workflowArrowFeedback",
      }[edge.type] || "workflowArrowMain";
      const label = edge.label
        ? `<text class="workflow-edge-label workflow-edge-label--${escapeHtml(edge.type)}" x="${labelX}" y="${labelY}">${escapeHtml(edge.label)}</text>`
        : "";
      const flowDuration = {
        main: 2.2,
        capability: 3.1,
        evaluation: 3.4,
        data: 3,
        feedback: 2.7,
      }[edge.type] || 3;
      const flowDelay = (index % 9) * -0.26;
      return `
        <path
          class="workflow-edge-path workflow-edge--${escapeHtml(edge.type)} ${edge.dashed ? "is-dashed" : ""} ${edge.animated ? "is-animated" : ""} ${isHighlighted ? "is-highlighted" : ""} ${isRunning ? "is-running" : ""}"
          d="${d}"
          marker-end="url(#${markerId})"
          style="--edge-color: ${edgeColor};"
        ></path>
        <path
          class="workflow-edge-flow workflow-flow--${escapeHtml(edge.type)} ${isHighlighted ? "is-highlighted" : ""}"
          d="${d}"
          style="--edge-color: ${edgeColor}; --flow-duration: ${flowDuration}s; --flow-delay: ${flowDelay}s;"
        ></path>
        ${label}
      `;
    })
    .join("");
  svg.innerHTML = defs + paths;
}

function bindWorkflowControls() {
  document.addEventListener("keydown", (event) => {
    if (document.body.dataset.page !== "workflow") return;
    if (event.key === "0") resetWorkflowView();
  });
}

function bindWorkflowCanvasPan() {
  const canvas = $("#workflowCanvas");
  if (!canvas) return;
  canvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest(".workflow-node")) return;
    workflowState.panning = {
      startX: event.clientX,
      startY: event.clientY,
      panX: workflowState.panX,
      panY: workflowState.panY,
    };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!workflowState.panning) return;
    workflowState.panX = workflowState.panning.panX + event.clientX - workflowState.panning.startX;
    workflowState.panY = workflowState.panning.panY + event.clientY - workflowState.panning.startY;
    updateWorkflowTransform();
  });
  canvas.addEventListener("pointerup", (event) => {
    workflowState.panning = null;
    canvas.releasePointerCapture?.(event.pointerId);
  });
  canvas.addEventListener("pointercancel", () => {
    workflowState.panning = null;
  });
  canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        setWorkflowZoom(workflowState.zoom + (event.deltaY > 0 ? -0.05 : 0.05));
        return;
      }
      workflowState.panX -= event.deltaX;
      workflowState.panY -= event.deltaY;
      updateWorkflowTransform();
    },
    { passive: false },
  );
}

function updateWorkflowTransform() {
  const transform = $("#workflowTransform");
  if (transform) {
    transform.style.transform = `translate(${workflowState.panX}px, ${workflowState.panY}px) scale(${workflowState.zoom})`;
  }
}

function setWorkflowZoom(nextZoom) {
  workflowState.zoom = clamp(nextZoom, 0.38, 1.35);
  updateWorkflowTransform();
}

function selectWorkflowNode(nodeId, shouldCenter = false) {
  if (!workflowNodeMap.has(nodeId)) return;
  workflowState.selectedNodeId = nodeId;
  workflowState.runningEdgeId = "";
  updateWorkflowSelectionClasses();
  renderWorkflowEdges();
  if (shouldCenter) focusWorkflowNode(nodeId, false);
}

function updateWorkflowSelectionClasses() {
  $$(".workflow-node").forEach((element) => {
    const isSelected = element.dataset.nodeId === workflowState.selectedNodeId;
    element.classList.toggle("is-selected", isSelected);
    element.classList.toggle(
      "is-running",
      workflowEdges.some((edge) => edge.to === element.dataset.nodeId && workflowEdgeId(edge) === workflowState.runningEdgeId),
    );
  });
}

function focusWorkflowNode(nodeId, announce = true) {
  const node = workflowNodeMap.get(nodeId);
  const canvas = $("#workflowCanvas");
  if (!node || !canvas) return;
  workflowState.selectedNodeId = nodeId;
  const position = getWorkflowNodePosition(nodeId);
  workflowState.panX = canvas.clientWidth / 2 - (position.x + position.w / 2) * workflowState.zoom;
  workflowState.panY = canvas.clientHeight / 2 - (position.y + position.h / 2) * workflowState.zoom;
  updateWorkflowSelectionClasses();
  renderWorkflowEdges();
  updateWorkflowTransform();
  if (announce) showToast(`已定位：${node.title}`);
}

function resetWorkflowView() {
  window.clearInterval(workflowState.demoTimer);
  workflowState.nodePositions = makeDefaultWorkflowPositions();
  workflowState.selectedNodeId = "training";
  workflowState.pathFocusNodeId = "";
  workflowState.runningEdgeId = "";
  renderWorkflowPage();
  fitWorkflowCanvas();
}

function startWorkflowNodeDrag(event, nodeId) {
  if (event.button !== 0 || !workflowNodeMap.has(nodeId)) return;
  event.stopPropagation();
  const position = getWorkflowNodePosition(nodeId);
  workflowState.selectedNodeId = nodeId;
  workflowState.runningEdgeId = "";
  workflowState.dragging = {
    nodeId,
    startX: event.clientX,
    startY: event.clientY,
    nodeX: position.x,
    nodeY: position.y,
  };
  updateWorkflowSelectionClasses();
  renderWorkflowEdges();
  event.currentTarget.setPointerCapture(event.pointerId);
}

function moveWorkflowNode(event) {
  const dragging = workflowState.dragging;
  if (!dragging || event.currentTarget.dataset.nodeId !== dragging.nodeId) return;
  const nextX = dragging.nodeX + (event.clientX - dragging.startX) / workflowState.zoom;
  const nextY = dragging.nodeY + (event.clientY - dragging.startY) / workflowState.zoom;
  workflowState.nodePositions[dragging.nodeId] = {
    x: clamp(nextX, 20, WORKFLOW_CANVAS_WIDTH - 20 - getWorkflowNodePosition(dragging.nodeId).w),
    y: clamp(nextY, 20, WORKFLOW_CANVAS_HEIGHT - 20 - getWorkflowNodePosition(dragging.nodeId).h),
  };
  event.currentTarget.style.left = `${workflowState.nodePositions[dragging.nodeId].x}px`;
  event.currentTarget.style.top = `${workflowState.nodePositions[dragging.nodeId].y}px`;
  renderWorkflowEdges();
}

function stopWorkflowNodeDrag(event) {
  if (!workflowState.dragging) return;
  workflowState.dragging = null;
  event.currentTarget.releasePointerCapture?.(event.pointerId);
}

function getWorkflowDownstreamNodes(nodeId) {
  return workflowEdges
    .filter((edge) => edge.from === nodeId)
    .map((edge) => workflowNodeMap.get(edge.to))
    .filter(Boolean);
}

function getWorkflowDownstreamEdgeIds(rootId) {
  if (!rootId) return new Set();
  const edgeIds = new Set();
  const visited = new Set([rootId]);
  const queue = [rootId];
  while (queue.length) {
    const current = queue.shift();
    workflowEdges.forEach((edge) => {
      if (edge.from !== current) return;
      edgeIds.add(workflowEdgeId(edge));
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push(edge.to);
      }
    });
  }
  return edgeIds;
}

document.addEventListener("DOMContentLoaded", () => {
  initGlobalNav();
  initTheoryAnchorToggles();
  const page = document.body.dataset.page;
  if (page === "home") initHomePage();
  if (page === "auth") initAuthPage();
  if (page === "teaching-navigation") initTeachingNavigationPage();
  if (page === "navigation") initNavigationTrainingPage();
  if (page === "practice") initPracticePage();
  if (page === "assets") initAssetsPage();
  if (page === "workflow") initWorkflowPage();
  surfaceHomeTaskEntry(page);
});

window.defaultTrainingCourse = defaultTrainingCourse;
window.trainingWorkflowConfig = trainingWorkflowConfig;
window.initGlobalNav = initGlobalNav;
window.setActiveNav = setActiveNav;
window.copyText = copyText;
window.downloadMarkdown = downloadMarkdown;
window.saveToLocalStorage = saveToLocalStorage;
window.loadFromLocalStorage = loadFromLocalStorage;
window.renderHorizontalBarChart = renderHorizontalBarChart;
window.renderStepHeatmap = renderStepHeatmap;
window.renderBulletChart = renderBulletChart;
window.initAuthPage = initAuthPage;
window.loadAccountSession = loadAccountSession;
window.saveAccountSession = saveAccountSession;
window.clearAccountSession = clearAccountSession;
window.initNavigationTrainingPage = initNavigationTrainingPage;
window.renderTrainingWorkflow = renderTrainingWorkflow;
window.renderTrainingSidebar = renderTrainingSidebar;
window.renderTrainingCurrentStep = renderTrainingCurrentStep;
window.renderGameTrainingMap = renderGameTrainingMap;
window.renderGameMapAssets = renderGameMapAssets;
window.renderGameMapStepDetail = renderGameMapStepDetail;
window.selectGameMapPrimaryOption = selectGameMapPrimaryOption;
window.confirmGameMapStep = confirmGameMapStep;
window.renderTrainingProgressMap = renderTrainingProgressMap;
window.routeTrainingNodes = routeTrainingNodes;
window.initTeachingNavigationPage = initTeachingNavigationPage;
window.renderTeachingNavigationPage = renderTeachingNavigationPage;
window.renderStageOverview = renderStageOverview;
window.renderNewTeacherMap = renderNewTeacherMap;
window.renderMapNode = renderMapNode;
window.renderNodeDetailPanel = renderNodeDetailPanel;
window.getRouteNodeStatus = getRouteNodeStatus;
window.selectRoutePrimaryOption = selectRoutePrimaryOption;
window.toggleRouteSecondaryOption = toggleRouteSecondaryOption;
window.confirmRouteStep = confirmRouteStep;
window.renderProgressSummary = renderProgressSummary;
window.openTrainingRouteModal = openTrainingRouteModal;
window.closeTrainingRouteModal = closeTrainingRouteModal;
window.renderTrainingOptionCards = renderTrainingOptionCards;
window.selectTrainingPrimaryOption = selectTrainingPrimaryOption;
window.toggleTrainingSecondaryOption = toggleTrainingSecondaryOption;
window.generateExcellentTemplate = generateExcellentTemplate;
window.generateDecisionScore = generateDecisionScore;
window.generateTrainingAnalysis = generateTrainingAnalysis;
window.confirmTrainingStep = confirmTrainingStep;
window.generateTrainingReport = generateTrainingReport;
window.saveTrainingReportToAssets = saveTrainingReportToAssets;
window.resetTrainingState = resetTrainingState;
window.initPracticePage = initPracticePage;
window.renderFanyaLogin = renderFanyaLogin;
window.useMockFanyaAccount = useMockFanyaAccount;
window.simulateFanyaAuth = simulateFanyaAuth;
window.renderAuthorizedCourses = renderAuthorizedCourses;
window.selectFanyaCourse = selectFanyaCourse;
window.renderPracticeWorkspace = renderPracticeWorkspace;
window.generatePracticeTask = generatePracticeTask;
window.savePracticeTaskToAssets = savePracticeTaskToAssets;
window.resetFanyaAuth = resetFanyaAuth;
window.PRACTICE_WORKFLOW_KEY = PRACTICE_WORKFLOW_KEY;
window.makeEmptyPracticeWorkflowState = makeEmptyPracticeWorkflowState;
window.loadPracticeWorkflowState = loadPracticeWorkflowState;
window.savePracticeWorkflowState = savePracticeWorkflowState;
window.createPracticeWorkflowStateFromCourse = createPracticeWorkflowStateFromCourse;
window.buildImportedContext = buildImportedContext;
window.renderImportedDataOverview = renderImportedDataOverview;
window.renderPracticeWorkflow = renderPracticeWorkflow;
window.renderPracticeWorkflowSidebar = renderPracticeWorkflowSidebar;
window.renderPracticeCurrentStep = renderPracticeCurrentStep;
window.renderPracticeOptionCards = renderPracticeOptionCards;
window.selectPracticePrimaryOption = selectPracticePrimaryOption;
window.togglePracticeSecondaryOption = togglePracticeSecondaryOption;
window.calculatePracticeRecommendations = calculatePracticeRecommendations;
window.generatePracticeExcellentTemplate = generatePracticeExcellentTemplate;
window.generatePracticeDecisionScore = generatePracticeDecisionScore;
window.generatePracticeAnalysis = generatePracticeAnalysis;
window.generatePracticeFragment = generatePracticeFragment;
window.confirmPracticeStep = confirmPracticeStep;
window.renderPracticeCourseDraft = renderPracticeCourseDraft;
window.generateFinalPracticePlan = generateFinalPracticePlan;
window.saveFinalPracticePlanToAssets = saveFinalPracticePlanToAssets;
window.initAssetsPage = initAssetsPage;
window.loadAssets = loadAssets;
window.renderAssetOverview = renderAssetOverview;
window.renderAssetUpload = renderAssetUpload;
window.handleAssetUpload = handleAssetUpload;
window.renderAssetList = renderAssetList;
window.viewAssetDetail = viewAssetDetail;
window.deleteAsset = deleteAsset;
window.importTrainingAndPracticeAssets = importTrainingAndPracticeAssets;
window.initWorkflowPage = initWorkflowPage;
window.renderWorkflowPage = renderWorkflowPage;
window.focusWorkflowNode = focusWorkflowNode;
window.resetWorkflowView = resetWorkflowView;
