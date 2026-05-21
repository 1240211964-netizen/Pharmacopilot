const PHASES = {
  pre: "阶段一：课前教学设计与准备",
  in: "阶段二：课中教学实施与调控",
  post: "阶段三：课后评价反馈与持续改进",
};

const PALETTE = {
  ink: "#141413",
  graphite: "#3d3d3a",
  muted: "#73726c",
  line: "rgba(31,30,29,.14)",
  paper: "#fffefa",
  vellum: "#faf9f5",
  accent: "#d97757",
  accentDark: "#b85f45",
  sage: "#4d6257",
  blue: "#3f617a",
  gold: "#b58a45",
  rose: "#a45149",
  purple: "#6d6287",
  grid: "rgba(31,30,29,.075)",
  axis: "rgba(31,30,29,.34)",
  threshold: "rgba(61,61,58,.46)",
  paperLine: "rgba(31,30,29,.10)",
};

const STEP_DEFS = [
  {
    id: 1,
    phase: "pre",
    title: "教学情境与课程任务分析",
    type: "coursePositionCanvas",
    outputType: "课程任务定位段落",
    purpose: "把知识点放回课程目标、专业任务与学生产出中，避免从概念讲授直接开始。",
    userJob: "判断本课为什么教、服务哪类专业任务、学生最后交付什么。",
    lenses: ["课程定位", "任务价值", "前后衔接"],
    requiredElements: ["课程位置", "专业任务", "学生产出", "证据来源", "后续约束"],
    decision: {
      question: "本节 SWOT 课最应该被定位为什么？",
      options: [
        { id: "task", label: "药事管理情境中的管理决策训练", impact: "authenticTask", score: 3.4 },
        { id: "concept", label: "管理学工具概念介绍", impact: "conceptOnly", score: 2.0 },
        { id: "exam", label: "期末考试知识点复习", impact: "examOnly", score: 1.8 },
      ],
    },
    impactsTo: [2, 3, 5, 8],
  },
  {
    id: 2,
    phase: "pre",
    title: "学情分析与学习起点诊断",
    type: "learnerDiagnosisWorkbench",
    outputType: "学情分析段落",
    purpose: "用分布、趋势、误区和学生分层判断本班真实学习起点。",
    userJob: "判断学生卡在哪里、谁需要支持、教学设计应优先调整什么。",
    lenses: ["学习起点", "误区结构", "群体分层", "教学调整"],
    requiredElements: ["学习证据", "学生类型", "学习障碍", "分层支架", "评价证据"],
    decision: {
      question: "本班进入案例探究前的首要障碍是什么？",
      options: [
        { id: "conceptBoundary", label: "内部条件与外部环境边界混淆", impact: "conceptBoundary", score: 3.2 },
        { id: "evidenceWeakness", label: "能够填表但缺少证据链", impact: "evidenceWeakness", score: 3.5 },
        { id: "lowParticipation", label: "低参与学生无法进入任务", impact: "lowParticipation", score: 3.1 },
      ],
    },
    impactsTo: [3, 6, 7, 8, 11, 12, 15, 17, 19],
  },
  {
    id: 3,
    phase: "pre",
    title: "教学目标与预期学习成果设计",
    type: "objectiveAlignmentMatrix",
    outputType: "教学目标与学习成果表",
    purpose: "把课程要求改写为可观察、可评价、可由学生产出证明的学习目标。",
    userJob: "判断目标是否能被产出和评价证据证明，是否回应学情障碍。",
    lenses: ["Bloom层级", "目标对齐", "证据覆盖", "学情继承"],
    requiredElements: ["可观察行为", "认知层级", "学生产出", "评价证据", "目标数量"],
    decision: {
      question: "当前目标设计最应补强哪一项？",
      options: [
        { id: "observable", label: "把“理解”改写为可观察行为", impact: "observableOutcomes", score: 3.3 },
        { id: "evidence", label: "为每个目标配置评价证据", impact: "evidenceCoverage", score: 3.5 },
        { id: "moreGoals", label: "增加更多目标以显得完整", impact: "overTargeting", score: 1.7 },
      ],
    },
    impactsTo: [8, 12, 15, 17],
  },
  {
    id: 4,
    phase: "pre",
    title: "教学内容重构与核心概念提炼",
    type: "conceptProblemChain",
    outputType: "内容结构与问题链",
    purpose: "将教材内容重构为核心概念、问题链和任务链，控制认知负荷。",
    userJob: "判断哪些内容必须讲、哪些压缩、哪些转化为学生任务。",
    lenses: ["概念网络", "问题链", "负荷热图", "内容取舍"],
    requiredElements: ["核心概念", "重难点边界", "问题链", "认知负荷", "任务关联"],
    decision: {
      question: "本课内容重构的主线应是什么？",
      options: [
        { id: "problemChain", label: "按“概念边界—证据判断—策略建议”组织", impact: "problemChain", score: 3.4 },
        { id: "textbook", label: "按教材章节逐段讲授", impact: "textbookSequence", score: 2.1 },
        { id: "allContent", label: "尽量覆盖所有内容点", impact: "cognitiveOverload", score: 1.6 },
      ],
    },
    impactsTo: [5, 8, 11, 12],
  },
  {
    id: 5,
    phase: "pre",
    title: "学习资源与案例材料开发",
    type: "evidenceAnnotationDesk",
    outputType: "案例材料说明与使用边界",
    purpose: "把案例材料转化为可支撑学生判断的证据资源，而不是背景材料堆砌。",
    userJob: "标注事实、数据、政策和观点，识别支撑分析的关键材料。",
    lenses: ["材料结构", "证据标注", "来源边界", "目标映射"],
    requiredElements: ["真实情境", "关键事实", "材料来源", "可读性", "使用边界"],
    decision: {
      question: "案例材料最需要先处理什么问题？",
      options: [
        { id: "evidenceTag", label: "标注可用于判断的事实和依据", impact: "evidenceAnnotation", score: 3.5 },
        { id: "length", label: "继续增加背景材料，让案例更丰满", impact: "materialOverload", score: 1.9 },
        { id: "conclusion", label: "直接给出参考答案，降低难度", impact: "prematureConclusion", score: 1.5 },
      ],
    },
    impactsTo: [6, 8, 12, 17],
  },
  {
    id: 6,
    phase: "pre",
    title: "课前学习支架与预习任务设计",
    type: "preclassTaskPlanner",
    outputType: "课前导学任务",
    purpose: "让学生带着基本理解、明确问题和可分析材料进入课堂。",
    userJob: "为不同学生群体配置预习任务、支架和提交物。",
    lenses: ["任务流", "支架匹配", "提交物", "负荷控制"],
    requiredElements: ["预习材料", "导学问题", "提交要求", "问题收集", "分层资源"],
    decision: {
      question: "课前任务最应该收集哪类证据？",
      options: [
        { id: "misconception", label: "概念边界判断和学生疑问", impact: "preclassDiagnosis", score: 3.4 },
        { id: "completion", label: "只统计是否看完视频", impact: "completionOnly", score: 1.9 },
        { id: "longReading", label: "要求阅读大量资料", impact: "preclassOverload", score: 1.7 },
      ],
    },
    impactsTo: [7, 9, 10],
  },
  {
    id: 7,
    phase: "pre",
    title: "诊断性评价与学习问题收集",
    type: "diagnosticAssessmentBuilder",
    outputType: "课前诊断设计",
    purpose: "用少量高价值题目识别学生进入课堂任务前的关键障碍。",
    userJob: "判断题目是否能识别误区，并能反向调整课堂设计。",
    lenses: ["题目映射", "误区归因", "覆盖矩阵", "调整规则"],
    requiredElements: ["诊断目标", "题目设计", "错误归因", "数据收集", "教学调整"],
    decision: {
      question: "最有价值的诊断题应测什么？",
      options: [
        { id: "whyWrong", label: "要求学生说明判断理由，暴露误区来源", impact: "diagnosticReasoning", score: 3.5 },
        { id: "definition", label: "只考 SWOT 定义记忆", impact: "recallOnly", score: 1.8 },
        { id: "hardExam", label: "使用高难度考试题筛选学生", impact: "diagnosticMismatch", score: 1.6 },
      ],
    },
    impactsTo: [8, 11, 15],
  },
  {
    id: 8,
    phase: "pre",
    title: "教学过程、活动序列与评价量规设计",
    type: "lessonTimelineRubric",
    outputType: "90分钟课堂流程与评价量规",
    purpose: "把教学目标、活动序列、学生产出、评价节点和时间结构形成闭环。",
    userJob: "编排课堂时间轴，检查每个活动是否有产出和评价证据。",
    lenses: ["时间轴", "活动产出", "评价节点", "节奏风险"],
    requiredElements: ["活动序列", "时间分配", "学生产出", "评价量规", "证据链"],
    decision: {
      question: "90分钟课堂最需要修正的结构问题是什么？",
      options: [
        { id: "studentTime", label: "压缩讲授，增加学生证据分析与反馈时间", impact: "studentCenteredTimeline", score: 3.6 },
        { id: "moreLecture", label: "延长教师讲授，保证内容覆盖", impact: "lectureDominance", score: 1.8 },
        { id: "freeDiscussion", label: "扩大自由讨论，弱化量规约束", impact: "unstructuredActivity", score: 2.0 },
      ],
    },
    impactsTo: [9, 12, 14, 15, 17],
  },
  {
    id: 9,
    phase: "in",
    title: "问题情境创设与学习动机激发",
    type: "scenarioHookTester",
    outputType: "课堂导入脚本",
    purpose: "用真实问题和认知冲突打开课堂，引出学习任务而不是直接解释概念。",
    userJob: "选择能激发学生初判并指向本课产出的导入情境。",
    lenses: ["情境冲突", "初判投票", "目标对齐", "经验连接"],
    requiredElements: ["真实问题", "认知冲突", "任务指向", "学生经验", "导入时长"],
    decision: {
      question: "最适合本课的导入方式是什么？",
      options: [
        { id: "conflictVote", label: "药店经营案例冲突 + 学生初判投票", impact: "scenarioConflict", score: 3.4 },
        { id: "definitionStart", label: "先解释 SWOT 定义", impact: "conceptFirst", score: 2.0 },
        { id: "newsOnly", label: "展示新闻材料但不设置任务", impact: "looseHook", score: 1.9 },
      ],
    },
    impactsTo: [10, 12],
  },
  {
    id: 10,
    phase: "in",
    title: "先行组织与已有经验激活",
    type: "advanceOrganizerMap",
    outputType: "先行组织活动",
    purpose: "帮助学生从已有经验、预习结果和旧知识进入本课任务路径。",
    userJob: "连接旧知、新知与任务规则，避免学生带着误区进入探究。",
    lenses: ["旧知新知", "任务路径", "预习回扣", "误区澄清"],
    requiredElements: ["先行框架", "已有经验", "误区澄清", "学习路径", "任务规则"],
    decision: {
      question: "先行组织最应先澄清什么？",
      options: [
        { id: "boundary", label: "内部条件与外部环境的判断路径", impact: "boundaryOrganizer", score: 3.5 },
        { id: "history", label: "SWOT 模型历史背景", impact: "backgroundFirst", score: 1.8 },
        { id: "goalRepeat", label: "重复朗读教学目标", impact: "formalGoal", score: 1.9 },
      ],
    },
    impactsTo: [11, 12],
  },
  {
    id: 11,
    phase: "in",
    title: "核心概念讲解与认知支架提供",
    type: "conceptScaffoldBoard",
    outputType: "概念讲解与支架表",
    purpose: "讲清核心概念边界，并提供学生可操作的判断支架。",
    userJob: "选择正例、反例、判断规则和任务模板。",
    lenses: ["正反例", "边界规则", "支架层级", "讲授节制"],
    requiredElements: ["概念定义", "边界规则", "示例反例", "操作支架", "讲授节制"],
    decision: {
      question: "概念讲解最应采用哪种支架？",
      options: [
        { id: "examples", label: "正例/反例 + 判断流程卡", impact: "exampleScaffold", score: 3.5 },
        { id: "definition", label: "完整定义 + 术语解释", impact: "definitionOnly", score: 2.1 },
        { id: "freeExplore", label: "先让学生自由讨论，之后再讲", impact: "prematureExplore", score: 2.0 },
      ],
    },
    impactsTo: [12, 15],
  },
  {
    id: 12,
    phase: "in",
    title: "案例探究与证据分析活动",
    type: "inquiryEvidenceDesk",
    outputType: "案例探究任务单",
    purpose: "让学生从案例事实出发，完成有依据的分析、判断和论证。",
    userJob: "把案例事实、学生判断和证据依据连接成可评价证据链。",
    lenses: ["事实判断依据", "证据链", "小组进度", "分析深度"],
    requiredElements: ["案例事实", "证据标注", "分析问题", "小组产出", "教师追问"],
    decision: {
      question: "案例探究最需要防止什么问题？",
      options: [
        { id: "evidence", label: "学生凭经验填矩阵而不标注依据", impact: "evidenceChain", score: 3.6 },
        { id: "slow", label: "学生讨论速度较慢", impact: "paceConcern", score: 2.4 },
        { id: "different", label: "小组答案不一致", impact: "productiveDifference", score: 2.8 },
      ],
    },
    impactsTo: [13, 14, 15, 17],
  },
  {
    id: 13,
    phase: "in",
    title: "协作学习与角色任务推进",
    type: "collaborationSwimlane",
    outputType: "小组协作任务单",
    purpose: "让小组合作具有真实协作必要性、明确角色责任和过程证据。",
    userJob: "配置组内角色、任务依赖和教师巡视点。",
    lenses: ["角色泳道", "任务依赖", "参与热图", "巡视点"],
    requiredElements: ["协作必要性", "角色分工", "过程记录", "教师巡视", "公平参与"],
    decision: {
      question: "当前小组任务最需要补强哪一项？",
      options: [
        { id: "roles", label: "为每个角色设置独立证据产出", impact: "roleAccountability", score: 3.5 },
        { id: "leader", label: "指定小组长完成主要任务", impact: "leaderDominance", score: 1.7 },
        { id: "random", label: "随机分组后自由讨论", impact: "weakCollaboration", score: 1.9 },
      ],
    },
    impactsTo: [14, 15],
  },
  {
    id: 14,
    phase: "in",
    title: "学习成果展示、课堂对话与追问",
    type: "dialogueProbeScript",
    outputType: "展示与追问脚本",
    purpose: "通过展示、同伴质询和教师追问推动学生修正和深化判断。",
    userJob: "设计展示结构、追问类型和修正路径。",
    lenses: ["展示结构", "追问路径", "对话流", "修正对比"],
    requiredElements: ["展示结构", "同伴质询", "教师追问", "即时反馈", "修正动作"],
    decision: {
      question: "教师追问应优先追问什么？",
      options: [
        { id: "evidenceProbe", label: "追问每条判断的证据来源和替代解释", impact: "evidenceProbe", score: 3.6 },
        { id: "praise", label: "主要肯定展示表现，保持氛围", impact: "surfaceFeedback", score: 1.9 },
        { id: "correctAnswer", label: "直接给出标准答案", impact: "teacherAnswer", score: 1.8 },
      ],
    },
    impactsTo: [15, 16, 17],
  },
  {
    id: 15,
    phase: "in",
    title: "形成性评价与即时反馈调节",
    type: "formativeMonitor",
    outputType: "形成性评价方案",
    purpose: "在课堂过程中持续检查学生学习状态，并依据证据即时调节教学。",
    userJob: "设置检查点、触发阈值、反馈语和调节动作。",
    lenses: ["检查点", "反馈触发", "预警", "调节决策"],
    requiredElements: ["检查节点", "反馈结构", "调节规则", "证据记录", "后续动作"],
    decision: {
      question: "哪个检查点最关键？",
      options: [
        { id: "beforeInquiry", label: "案例探究前的概念边界即时判断", impact: "formativeCheckpoint", score: 3.5 },
        { id: "afterClass", label: "课后再通过作业判断", impact: "lateFeedback", score: 1.8 },
        { id: "randomAsk", label: "随机提问几名学生", impact: "thinEvidence", score: 2.0 },
      ],
    },
    impactsTo: [16, 18, 19],
  },
  {
    id: 16,
    phase: "in",
    title: "课堂总结、迁移提升与课后任务衔接",
    type: "closureTransferPlanner",
    outputType: "总结迁移与课后任务",
    purpose: "把课堂成果收束为可迁移的方法，并衔接课后深化任务。",
    userJob: "设计总结结构、迁移情境和课后任务链。",
    lenses: ["总结链", "迁移地图", "课后任务", "分层延伸"],
    requiredElements: ["核心总结", "方法迁移", "课后任务", "资源推荐", "困惑回应"],
    decision: {
      question: "课后任务应如何设计？",
      options: [
        { id: "reviseTransfer", label: "基于课堂反馈修订矩阵，并迁移到新药事管理案例", impact: "transferTask", score: 3.5 },
        { id: "copy", label: "抄写 SWOT 定义和四象限", impact: "lowTransfer", score: 1.6 },
        { id: "reading", label: "阅读扩展材料但不提交产出", impact: "noEvidence", score: 1.9 },
      ],
    },
    impactsTo: [17, 18],
  },
  {
    id: 17,
    phase: "post",
    title: "学习成果收集与表现性评价",
    type: "performanceAssessmentDesk",
    outputType: "表现性评价方案",
    purpose: "用学生作品、量规评分和证据标注证明目标达成情况。",
    userJob: "评价学生作品质量，定位低分维度并准备反馈。",
    lenses: ["作品样例", "量规矩阵", "目标达成", "反馈准备"],
    requiredElements: ["成果收集", "量规评分", "证据解释", "样例归档", "反馈准备"],
    decision: {
      question: "表现性评价最应强调什么？",
      options: [
        { id: "rubricEvidence", label: "按量规逐项对照学生证据评分", impact: "rubricEvidence", score: 3.6 },
        { id: "overall", label: "给出总体印象分", impact: "impressionScore", score: 1.7 },
        { id: "complete", label: "只看矩阵是否填满", impact: "completionScore", score: 1.9 },
      ],
    },
    impactsTo: [18, 19, 20],
  },
  {
    id: 18,
    phase: "post",
    title: "学习数据分析与学习困难诊断",
    type: "learningAnalyticsReview",
    outputType: "学习数据复盘",
    purpose: "基于课后作业、量规和过程数据识别学生困难来源。",
    userJob: "判断困难来自概念、证据、推理、表达还是参与。",
    lenses: ["得分分布", "低分热图", "错误类型", "困难归因"],
    requiredElements: ["平台数据", "错误类型", "群体差异", "困难归因", "行动建议"],
    decision: {
      question: "课后低分的主要来源是什么？",
      options: [
        { id: "evidenceReasoning", label: "证据不足与推理断裂", impact: "postEvidenceGap", score: 3.6 },
        { id: "lazy", label: "学生学习态度不认真", impact: "blameStudents", score: 1.3 },
        { id: "hard", label: "课程内容过难，降低要求", impact: "lowerDemand", score: 1.8 },
      ],
    },
    impactsTo: [19, 20],
  },
  {
    id: 19,
    phase: "post",
    title: "差异化反馈、补救教学与拓展支持",
    type: "differentiatedSupportMatrix",
    outputType: "差异化反馈方案",
    purpose: "把学习困难诊断转化为不同学生群体的反馈、补救和拓展支持。",
    userJob: "为基础、稳定、进阶与风险学生匹配反馈路径。",
    lenses: ["群体策略", "补救路径", "拓展任务", "覆盖检查"],
    requiredElements: ["共性反馈", "个性批注", "补救资源", "拓展任务", "实施可行"],
    decision: {
      question: "反馈方案应如何分层？",
      options: [
        { id: "matrix", label: "按学生群体 × 错误类型匹配反馈策略", impact: "supportMatrix", score: 3.6 },
        { id: "general", label: "全班统一提醒注意证据", impact: "genericFeedback", score: 1.8 },
        { id: "topOnly", label: "只给优秀学生布置拓展任务", impact: "unequalSupport", score: 1.7 },
      ],
    },
    impactsTo: [20],
  },
  {
    id: 20,
    phase: "post",
    title: "教学反思、资源沉淀与持续改进",
    type: "reflectionAssetLoop",
    outputType: "教学反思与资产沉淀清单",
    purpose: "把本轮教学数据、问题归因、改进动作和可复用资源沉淀为下一轮资产。",
    userJob: "判断哪些问题需要迭代、哪些材料可以复用、哪些数据回流下一轮。",
    lenses: ["反思闭环", "资产回流", "下轮迭代", "资源清单"],
    requiredElements: ["数据依据", "问题归因", "资产沉淀", "迭代计划", "下轮验证"],
    decision: {
      question: "本轮教学最应该沉淀什么？",
      options: [
        { id: "assetLoop", label: "案例、量规、反馈语、样例与下轮诊断规则", impact: "assetLoop", score: 3.7 },
        { id: "summary", label: "写一段课堂总体感受", impact: "shallowReflection", score: 1.7 },
        { id: "slides", label: "只保存课件", impact: "assetNarrow", score: 2.0 },
      ],
    },
    impactsTo: [1, 2],
  },
];

const LEARNER_DATA = [
  { group: "进阶巩固", count: 7, score: 78, evidence: 66, engagement: 88 },
  { group: "稳定基础", count: 9, score: 64, evidence: 46, engagement: 78 },
  { group: "概念边界混淆", count: 8, score: 55, evidence: 34, engagement: 84 },
  { group: "证据链薄弱", count: 9, score: 46, evidence: 23, engagement: 86 },
  { group: "低参与风险", count: 6, score: 38, evidence: 14, engagement: 48 },
];

const TREND_DATA = [
  { label: "发布", complete: 18, concept: 22, evidence: 8 },
  { label: "视频", complete: 64, concept: 38, evidence: 18 },
  { label: "测验", complete: 86, concept: 58, evidence: 31 },
  { label: "开放题", complete: 82, concept: 54, evidence: 29 },
];

const TYPE_META = {
  coursePositionCanvas: { label: "课程任务定位", color: PALETTE.sage },
  learnerDiagnosisWorkbench: { label: "学情诊断工作台", color: PALETTE.accent },
  objectiveAlignmentMatrix: { label: "目标对齐矩阵", color: PALETTE.blue },
  conceptProblemChain: { label: "内容问题链", color: PALETTE.gold },
  evidenceAnnotationDesk: { label: "证据标注台", color: PALETTE.purple },
  preclassTaskPlanner: { label: "课前任务设计", color: PALETTE.sage },
  diagnosticAssessmentBuilder: { label: "诊断评价设计", color: PALETTE.blue },
  lessonTimelineRubric: { label: "课堂流程量规", color: PALETTE.accent },
  scenarioHookTester: { label: "情境导入测试", color: PALETTE.gold },
  advanceOrganizerMap: { label: "先行组织图", color: PALETTE.purple },
  conceptScaffoldBoard: { label: "概念支架板", color: PALETTE.blue },
  inquiryEvidenceDesk: { label: "案例证据分析", color: PALETTE.accent },
  collaborationSwimlane: { label: "协作泳道", color: PALETTE.sage },
  dialogueProbeScript: { label: "课堂追问脚本", color: PALETTE.purple },
  formativeMonitor: { label: "形成性评价监测", color: PALETTE.gold },
  closureTransferPlanner: { label: "总结迁移设计", color: PALETTE.sage },
  performanceAssessmentDesk: { label: "表现性评价", color: PALETTE.blue },
  learningAnalyticsReview: { label: "学习数据复盘", color: PALETTE.accent },
  differentiatedSupportMatrix: { label: "差异化支持矩阵", color: PALETTE.purple },
  reflectionAssetLoop: { label: "反思资产闭环", color: PALETTE.sage },
};

const state = {
  currentStepId: 2,
  completed: new Set([1]),
  lensByStep: {},
  decisions: {},
  insights: {},
  edits: {},
};

const $ = (id) => document.getElementById(id);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const esc = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function currentStep() {
  return STEP_DEFS.find((step) => step.id === state.currentStepId) || STEP_DEFS[1];
}

function selectedLens(step = currentStep()) {
  return state.lensByStep[step.id] || step.lenses[0];
}

function selectedDecision(step = currentStep()) {
  return state.decisions[step.id] || null;
}

function readinessStatus(stepId) {
  if (stepId === state.currentStepId) return "active";
  if (state.completed.has(stepId)) return "done";
  const maxDone = Math.max(0, ...state.completed);
  if (stepId <= Math.max(state.currentStepId + 1, maxDone + 1)) return "ready";
  return "locked";
}

function getConfiguredWendaDomain() {
  const env = window.__PHARMACOPILOT_ENV__ || {};
  const raw = env.VITE_WENDAO_DOMAIN || env.WENDAO_DOMAIN || "";
  return String(raw).trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
}

function buildWendaPlatformAuthUrl() {
  const domain = getConfiguredWendaDomain();
  if (!domain) return "";
  const url = new URL("/api/openAccess/redirect/home", `https://${domain}`);
  url.searchParams.set("hd", "0,1,1");
  return url.href;
}

function syncHeaderWendaAuthLinks() {
  const url = buildWendaPlatformAuthUrl();
  document.querySelectorAll("[data-wenda-platform-auth]").forEach((link) => {
    link.href = url || "about:blank";
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-disabled", String(!url));
  });
}

function initProductizedGlobalNav() {
  const header = document.querySelector(".site-header");
  const button = $("navMenuToggle");
  const closeNav = () => {
    document.body.classList.remove("nav-open");
    button?.setAttribute("aria-expanded", "false");
  };

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === "teaching-navigation");
    if (link.dataset.nav === "teaching-navigation") link.setAttribute("aria-current", "page");
  });

  button?.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    document.body.classList.toggle("nav-open", !expanded);
    button.setAttribute("aria-expanded", String(!expanded));
  });

  header?.querySelectorAll(".topnav a, .top-actions a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  header?.querySelectorAll("[data-auth-provider='github']").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      toast("GitHub 授权待接入：未来用于读取仓库、同步教学资产与版本。");
    });
  });

  syncHeaderWendaAuthLinks();
  header?.querySelectorAll("[data-wenda-platform-auth]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = buildWendaPlatformAuthUrl();
      if (!url) {
        event.preventDefault();
        toast("未配置闻道机构域名，请先在配置服务填写后再打开授权链接。");
        return;
      }
      event.currentTarget.href = url;
    });
  });

  const syncHeaderScrollState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 4);
  };
  syncHeaderScrollState();
  window.addEventListener("scroll", syncHeaderScrollState, { passive: true });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });
}

function render() {
  renderFlowMap();
  renderStepHeader();
  renderLensTabs();
  renderVisual();
  renderDecisions();
  renderArtifact();
  renderRightRail();
  renderArchitectureGrid();
}

function renderFlowMap() {
  const flow = $("flowMap");
  if (!flow) return;
  flow.innerHTML = STEP_DEFS.map((step) => {
    const status = readinessStatus(step.id);
    return `<button class="flow-node ${status}" type="button" data-step="${step.id}" title="${esc(step.title)}">${String(step.id).padStart(2, "0")}</button>`;
  }).join("");
  flow.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => setActiveStep(Number(btn.dataset.step)));
  });
  const fill = $("progressFill");
  if (fill) fill.style.width = `${Math.max(5, (state.completed.size / STEP_DEFS.length) * 100)}%`;
}

function setActiveStep(id) {
  state.currentStepId = clamp(Number(id), 1, STEP_DEFS.length);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderStepHeader() {
  const step = currentStep();
  const decision = selectedDecision(step);
  const score = decision?.score || (step.id === 2 ? 3.2 : 2.6);
  const meta = TYPE_META[step.type];
  $("phasePill").textContent = PHASES[step.phase];
  $("activeTitle").textContent = `${String(step.id).padStart(2, "0")} ${step.title}`;
  $("activePurpose").textContent = step.purpose;
  $("maturityScore").textContent = score.toFixed(1);
  $("inputEvidence").textContent = step.userJob;
  $("teacherDecision").textContent = step.decision.question;
  $("outputArtifact").textContent = step.outputType;
  $("visualType").textContent = meta.label;
  $("visualTitle").textContent = `${selectedLens(step)}证据工作台`;
}

function renderLensTabs() {
  const step = currentStep();
  const el = $("lensTabs");
  if (!el) return;
  const active = selectedLens(step);
  el.innerHTML = step.lenses.map((lens) => `<button class="lens-tab ${lens === active ? "active" : ""}" type="button" data-lens="${esc(lens)}">${esc(lens)}</button>`).join("");
  el.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.lensByStep[step.id] = btn.dataset.lens;
      renderStepHeader();
      renderLensTabs();
      renderVisual();
    });
  });
}

function renderVisual() {
  const step = currentStep();
  const canvas = $("visualCanvas");
  const cards = getVisualCards(step, selectedLens(step));
  canvas.innerHTML = `<div class="chart-grid visual-card-grid">${cards.map((card, index) => renderVisualCard(card, index)).join("")}</div>`;
  canvas.querySelectorAll("[data-insight]").forEach((card) => {
    card.addEventListener("click", () => {
      state.insights[step.id] = card.dataset.insight;
      renderDecisions();
      renderArtifact();
      toast("已把该证据写入当前环节反馈");
    });
  });
}

function renderVisualCard(card, index) {
  const wide = card.wide || index > 1 ? "wide" : "";
  return `<button class="chart-panel visual-card ${wide}" type="button" data-insight="${esc(card.insight)}">
    <div class="visual-card-head">
      <div>
        <h4>${esc(card.title)}</h4>
        <p>${esc(card.subtitle)}</p>
      </div>
      <span class="click-chip">写入证据</span>
    </div>
    <div class="viz-body">${card.html}</div>
    <p class="chart-note"><strong>教学含义：</strong>${esc(card.insight)}</p>
  </button>`;
}

function renderDecisions() {
  const step = currentStep();
  const decision = selectedDecision(step);
  const list = $("decisionList");
  list.innerHTML = step.decision.options.map((option) => `<button class="decision-option ${decision?.id === option.id ? "active" : ""}" type="button" data-id="${esc(option.id)}">
    <span class="option-dot"></span>
    <span><strong>${esc(option.label)}</strong><span>成熟度预估：${option.score.toFixed(1)} / 4.0</span></span>
  </button>`).join("");
  list.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const option = step.decision.options.find((item) => item.id === btn.dataset.id);
      state.decisions[step.id] = option;
      renderStepHeader();
      renderDecisions();
      renderArtifact();
      renderRightRail();
      toast("已根据教师判断更新后续约束");
    });
  });

  const feedback = $("copilotFeedback");
  const insight = state.insights[step.id];
  const impactText = decision
    ? `当前判断会触发“${decision.impact}”状态，后续 ${formatImpacts(step.impactsTo)} 将自动继承这一约束。`
    : "请选择一个判断。系统将根据判断更新产物草稿和后续环节约束。";
  feedback.innerHTML = `<strong>Copilot 反馈</strong>
    <ul>
      <li>${esc(impactText)}</li>
      <li>${esc(insight ? `当前证据：${insight}` : "点击上方任一证据卡，可把可视化证据写入本环节反馈。")}</li>
    </ul>`;
}

function renderArtifact() {
  const step = currentStep();
  const generated = generateOutput(step, selectedDecision(step), state.insights[step.id]);
  const value = state.edits[step.id] ?? generated;
  $("artifactTitle").textContent = `生成：${step.outputType}`;
  $("artifactText").value = value;
  $("requirementRow").innerHTML = step.requiredElements.map((item) => `<span class="req-chip">${esc(item)}</span>`).join("");
}

function renderRightRail() {
  const step = currentStep();
  const scores = [
    ["目标一致性", 78],
    ["情境真实性", 84],
    ["学情诊断", step.id === 2 ? 88 : 72],
    ["认知参与", 76],
    ["评价效度", step.phase === "post" ? 82 : 68],
    ["数据复盘", step.phase === "post" ? 82 : 61],
  ];
  $("dimensionSummary").innerHTML = scores.map(([name, score]) => `<div class="dimension-row"><span>${name}</span><div class="mini-bar"><i style="width:${score}%"></i></div><b>${score}</b></div>`).join("");
}

function renderArchitectureGrid() {
  const el = $("architectureGrid");
  if (!el) return;
  el.innerHTML = STEP_DEFS.map((step) => {
    const meta = TYPE_META[step.type];
    return `<article class="arch-card" style="--card-color:${meta.color}">
      <div class="arch-top"><span>${String(step.id).padStart(2, "0")}</span><i></i></div>
      <strong>${esc(step.title)}</strong>
      <p>${esc(meta.label)} · ${esc(step.outputType)}</p>
    </article>`;
  }).join("");
}

function handleRegenerate() {
  const step = currentStep();
  state.edits[step.id] = generateOutput(step, selectedDecision(step), state.insights[step.id]);
  renderArtifact();
  toast("已按当前判断重新生成产物");
}

function handleWrite() {
  const step = currentStep();
  const text = $("artifactText").value;
  state.edits[step.id] = text;
  state.completed.add(step.id);
  state.currentStepId = Math.min(STEP_DEFS.length, step.id + 1);
  render();
  toast(step.id >= STEP_DEFS.length ? "20环节训练已完成" : `已写入「${step.outputType}」并进入下一环节`);
}

function generateOutput(step, decision, insight) {
  const choice = decision?.label || "尚未选择教师判断";
  const evidence = insight || "当前可视化证据显示，需要将证据判读转化为教学设计动作";
  const impacts = step.impactsTo.length ? step.impactsTo.map((id) => `第${id}环节`).join("、") : "下一轮教学迭代";
  return `【${step.outputType}】本环节围绕“${step.title}”展开。教师依据可视化证据判断：${choice}。系统提示的关键证据为：${evidence}。

据此，本环节设计应包含：${step.requiredElements.join("、")}。教师需要把这些要素转化为可执行的课堂动作、学生产出和评价证据，避免停留在空泛表述。

后续约束：本环节结果将影响 ${impacts}。后续环节应继承当前判断，并在任务、支架、评价或反馈设计中显式回应。`;
}

function formatImpacts(ids) {
  return ids.length ? ids.map((id) => `第${id}环节`).join("、") : "下一轮教学迭代";
}

function getVisualCards(step) {
  const cards = {
    coursePositionCanvas: [
      card("课程目标—专业任务—学生产出", "三角定位图", "本课应从课程目标和专业任务推出学生产出，而不是从知识点定义开始。", triangleDiagram()),
      card("课程前后衔接链", "本节课在课程体系中的位置", "当前 SWOT 任务应承接管理工具基础，并为后续药事管理案例决策铺垫。", flowDiagram(["管理工具基础", "SWOT案例判断", "管理策略建议", "药事管理综合案例"])),
      card("任务价值雷达", "真实任务、证据、产出、评价", "如果真实任务和评价证据偏低，课程定位会退化为普通概念讲授。", radarLite([86, 74, 80, 68, 76], ["真实", "证据", "产出", "评价", "迁移"])),
      card("产出类型选择", "学生最终交付物", "明确产出类型后，后续目标、流程和评价才能闭环。", cardStack(["一页SWOT矩阵", "证据标注说明", "管理建议", "展示回应记录"])),
    ],
    learnerDiagnosisWorkbench: [
      card("诊断测验得分分布", "识别低分集中区间", "低分区间集中，说明不能直接进入开放案例讨论。", histogram()),
      card("课前学习趋势", "完成率、概念正确率、证据标注率", "完成率高但证据标注率低，说明学习障碍不是简单未预习。", trendChart()),
      card("学生群体分层", "投入 × 诊断表现", "证据链薄弱与低参与风险应采用不同支架。", studentSegmentation()),
      card("误区结构", "错误类型排序", "边界混淆和证据不足是本课最需要被教学设计回应的障碍。", horizontalBars([{ label: "边界混淆", value: 42 }, { label: "证据不足", value: 38 }, { label: "未完成预习", value: 16 }, { label: "策略泛化", value: 14 }])),
    ],
    objectiveAlignmentMatrix: [
      card("Bloom × 学生产出矩阵", "目标层级覆盖", "目标不能停留在理解层，应覆盖应用、分析和评价。", objectiveMatrix()),
      card("目标—产出—评价证据", "三列对齐", "每条教学目标都必须能被一个学生产出和一条评价证据证明。", threeColumnMap(["目标", "产出", "证据"], ["区分内外部因素", "完成矩阵", "提出建议"])),
      card("学情障碍继承", "第2环节结果进入目标设计", "如果前序诊断为证据链薄弱，目标中必须出现“说明依据”。", heatmap(["边界", "证据", "表达", "迁移"])),
      card("高阶目标比例", "认知层级平衡", "高阶目标比例过低会导致课堂活动难以形成真实决策训练。", donut(68, "高阶目标")),
    ],
    conceptProblemChain: [
      card("核心概念网络", "概念关系与边界", "先处理内外部边界，再进入策略匹配，能降低误区风险。", networkDiagram(["SWOT", "内部条件", "外部环境", "证据", "策略"])),
      card("内容重要性—难度图", "取舍依据", "高难高重要内容应转化为示范和支架，而不是简单压缩。", quadrantChart()),
      card("问题链", "由浅入深组织内容", "问题链应从概念边界推进到证据判断，再进入策略建议。", flowDiagram(["是什么", "如何区分", "依据在哪", "如何建议"])),
      card("认知负荷热图", "内容密度风险", "材料、概念、任务同时投放会导致新教师课堂失控。", heatmap(["概念", "案例", "数据", "策略"])),
    ],
    evidenceAnnotationDesk: [
      card("案例材料标注板", "事实、数据、政策、观点", "只有被标注为事实或依据的材料，才能进入学生证据链。", annotationBoard()),
      card("材料来源可信度", "来源边界检查", "教学模拟材料也要标注边界，避免学生误把背景设定当真实结论。", horizontalBars([{ label: "政策材料", value: 86 }, { label: "案例事实", value: 78 }, { label: "教师设定", value: 52 }, { label: "观点材料", value: 38 }])),
      card("材料—目标映射", "资源是否服务学习目标", "未映射到目标的材料应压缩或移除。", matrixMap(["政策", "门店数据", "患者需求"], ["边界", "证据", "建议"])),
      card("材料噪音检测", "信息过载风险", "材料越多不等于案例越真实，关键是可读且可判断。", donut(62, "有效材料")),
    ],
    preclassTaskPlanner: [
      card("课前任务流程", "材料—问题—提交", "预习任务必须留下可诊断证据，而不是只记录观看完成。", flowDiagram(["概念卡", "案例初读", "边界判断", "开放疑问"])),
      card("学生群体—支架匹配", "分层支持", "低参与风险学生需要低门槛进入任务，证据薄弱学生需要标注支架。", supportMatrix()),
      card("提交物检查", "课前能收集什么", "开放疑问和理由说明比单纯完成率更有教学调整价值。", checklist(["边界判断题", "证据摘录卡", "开放疑问", "案例初判"])),
      card("任务负荷", "预习时间控制", "课前负荷过高会放大低参与风险。", barChart([20, 35, 50, 28], ["阅读", "视频", "判断", "提交"])),
    ],
    diagnosticAssessmentBuilder: [
      card("题目—误区—调整映射", "诊断题价值", "高价值诊断题必须能指向具体教学调整。", threeColumnMap(["题目", "误区", "调整"], ["边界题", "证据题", "理由题"])),
      card("知识点覆盖矩阵", "诊断覆盖范围", "覆盖过宽会降低诊断效率，重点应放在高风险误区。", matrixMap(["概念", "证据", "策略"], ["识别", "解释", "应用"])),
      card("错误选项归因树", "学生为什么错", "错误选项应对应误区，而不是只作为干扰项。", treeDiagram("错误答案", ["边界混淆", "证据不足", "概念记忆", "策略跳跃"])),
      card("诊断到课堂调节", "结果如何使用", "诊断结果必须影响讲授、分组、支架或评价节点。", flowDiagram(["诊断", "归因", "支架", "课堂调整"])),
    ],
    lessonTimelineRubric: [
      card("90分钟课堂时间轴", "活动序列与时间分配", "讲授比例过高会压缩学生证据分析与展示反馈。", timeline()),
      card("活动—产出—评价节点", "教学闭环", "每个活动必须留下学生产出或教师观察证据。", threeColumnMap(["活动", "产出", "评价"], ["导入", "探究", "展示", "总结"])),
      card("师生活动占比", "课堂主导结构", "学生分析、协作和展示时间应超过单向讲授。", donut(64, "学生中心活动")),
      card("节奏风险", "时间过载预警", "探究和展示相邻时需要预留反馈缓冲。", heatmap(["导入", "讲解", "探究", "展示"])),
    ],
    scenarioHookTester: [
      card("情境冲突卡", "导入是否有判断张力", "真实冲突能让学生理解为什么需要 SWOT 工具。", conflictCards()),
      card("学生初判投票", "导入后的认知分歧", "分歧越清晰，越适合引出概念边界和证据判断。", barChart([32, 26, 18, 24], ["优势", "机会", "威胁", "不确定"])),
      card("情境—目标对齐", "是否服务本课目标", "导入不能只热闹，必须自然指向学生产出。", matrixMap(["冲突", "角色", "数据"], ["目标", "任务", "评价"])),
      card("经验连接", "学生能否进入讨论", "药店、医保和监管情境更容易激活学生已有经验。", radarLite([82, 76, 68, 72, 64], ["熟悉", "冲突", "任务", "证据", "迁移"])),
    ],
    advanceOrganizerMap: [
      card("旧知—新知—任务路径", "先行组织主线", "学生需要先看到从概念到案例产出的完整路径。", flowDiagram(["管理工具", "SWOT边界", "案例证据", "管理建议"])),
      card("认知连接网络", "已有经验激活", "先连接经验，再给任务规则，能降低进入活动的门槛。", networkDiagram(["预习", "旧知", "药店经验", "概念边界", "任务单"])),
      card("误区澄清点", "活动前必须处理", "未澄清误区会直接污染后续案例探究产出。", horizontalBars([{ label: "内外部边界", value: 86 }, { label: "事实与观点", value: 72 }, { label: "策略与证据", value: 68 }])),
      card("任务路径可见度", "学生知道怎么做吗", "路径越清晰，教师巡视成本越低。", donut(74, "路径清晰度")),
    ],
    conceptScaffoldBoard: [
      card("正例/反例矩阵", "概念边界训练", "正反例比抽象定义更适合新教师讲清概念边界。", exampleMatrix()),
      card("判断规则流程", "如何判断 S/W/O/T", "学生需要流程卡来稳定完成分类，而不是凭直觉。", flowDiagram(["看主体", "判内外", "找证据", "归类别"])),
      card("支架层级", "从示范到独立完成", "支架应逐步撤除，避免学生依赖模板填空。", stepLadder(["教师示范", "半结构表", "小组判断", "独立修订"])),
      card("讲授节制", "概念讲解时间", "核心讲授应服务任务，不应吞掉探究时间。", donut(28, "讲授占比")),
    ],
    inquiryEvidenceDesk: [
      card("事实—判断—依据三列表", "案例探究核心表", "学生每个矩阵条目都应能回到具体事实和依据。", threeColumnMap(["事实", "判断", "依据"], ["药师服务", "库存压力", "政策变化"])),
      card("证据链图", "从材料到建议", "没有证据链，学生的 SWOT 会退化为观点罗列。", evidenceChain()),
      card("小组进度", "过程可见度", "教师应能看到小组卡在事实提取、分类还是建议形成。", barChart([86, 62, 44, 36], ["事实", "分类", "依据", "建议"])),
      card("分析深度", "是否只是摘录", "高质量分析要解释原因、比较选择并权衡风险。", radarLite([74, 62, 58, 46, 52], ["事实", "原因", "比较", "风险", "建议"])),
    ],
    collaborationSwimlane: [
      card("角色泳道图", "小组协作责任", "每个角色都必须有独立产出，才能避免伪协作。", swimlane()),
      card("任务依赖", "协作是否必要", "如果任务没有依赖关系，小组合作会变成分工抄写。", networkDiagram(["证据员", "分类员", "质询员", "汇报员", "修订员"])),
      card("参与热图", "谁在参与", "参与不均衡时应加入随机展示和个人准备。", heatmap(["A组", "B组", "C组", "D组"])),
      card("教师巡视点", "过程调控", "巡视点应聚焦争议、沉默、偏题和证据缺口。", checklist(["证据缺口", "角色沉默", "分类争议", "时间滞后"])),
    ],
    dialogueProbeScript: [
      card("展示结构树", "学生如何汇报", "展示应聚焦判断与依据，而不是朗读完整表格。", treeDiagram("展示", ["核心判断", "证据依据", "风险边界", "修正建议"])),
      card("追问路径", "教师如何推进思维", "证据追问和反例追问能促使学生修正判断。", flowDiagram(["你依据什么", "有反例吗", "风险是什么", "如何修正"])),
      card("课堂对话流", "师生/生生互动", "有效对话应包含回应、质询和修正，而不是单向评价。", dialogueFlow()),
      card("修正前后对比", "学习是否发生", "修正记录是形成性评价的重要证据。", beforeAfter("修正后", "修正前")),
    ],
    formativeMonitor: [
      card("课堂检查点地图", "在哪些节点判断", "形成性评价应前置到任务过程中，而不是课后才发现问题。", timeline(true)),
      card("反馈触发器", "低正确率如何处理", "低于阈值时应触发重讲、示范或支架，而不是继续推进。", decisionTree()),
      card("低正确率预警", "过程风险", "概念判断和证据标注是本课最关键的预警点。", barChart([58, 31, 72, 66], ["概念", "证据", "协作", "展示"])),
      card("反馈结构", "学生听完知道怎么改", "反馈应采用“肯定—问题—证据—动作”的结构。", flowDiagram(["肯定", "指出问题", "给出证据", "修改动作"])),
    ],
    closureTransferPlanner: [
      card("总结—迁移—课后任务链", "课堂收束结构", "总结必须回到方法，而不仅是重复四个概念。", flowDiagram(["核心方法", "新情境", "课后修订", "平台提交"])),
      card("知识迁移地图", "可迁移到哪些场景", "迁移任务应连接药店经营、医保支付、合规监管等情境。", networkDiagram(["SWOT", "药店经营", "医保准入", "合规监管", "服务优化"])),
      card("课后任务结构", "承接课堂产出", "课后任务应要求学生修订而不是重复练习。", checklist(["修订矩阵", "补充依据", "风险说明", "提交反思"])),
      card("分层延伸", "不同学生不同任务", "进阶学生需要迁移挑战，低起点学生需要概念补救。", supportMatrix()),
    ],
    performanceAssessmentDesk: [
      card("学生作品样例对比", "高低质量差异", "评价应指向证据质量，而不是只看矩阵是否填满。", beforeAfter("证据充分", "观点罗列")),
      card("量规评分矩阵", "逐项评分", "量规必须解释为什么得分，而不是只给总分。", rubricMatrix()),
      card("目标达成证据", "目标是否被证明", "每个目标都应能找到作品证据或过程证据。", matrixMap(["目标1", "目标2", "目标3"], ["作品", "展示", "修订"])),
      card("反馈准备", "低分维度转反馈", "低分维度应直接生成可操作反馈语。", horizontalBars([{ label: "证据", value: 42 }, { label: "分类", value: 64 }, { label: "建议", value: 58 }, { label: "表达", value: 70 }])),
    ],
    learningAnalyticsReview: [
      card("作业得分分布", "课后表现", "课后得分分布可判断教学目标是否真正达成。", histogram()),
      card("低分维度热图", "错在哪里", "证据不足与推理断裂应回调到案例探究和形成性评价。", heatmap(["分类", "证据", "推理", "表达"])),
      card("错误类型堆叠", "困难来源", "不同错误类型需要不同补救路径。", horizontalBars([{ label: "证据不足", value: 48 }, { label: "推理断裂", value: 31 }, { label: "概念混淆", value: 26 }, { label: "表达不清", value: 18 }])),
      card("困难归因", "目标、内容、活动、评价", "不要简单归因为学生不努力，要定位教学设计中可改进的节点。", donut(71, "可教学干预")),
    ],
    differentiatedSupportMatrix: [
      card("学生群体 × 反馈策略矩阵", "分层反馈", "反馈必须匹配学生类型和错误类型。", supportMatrix()),
      card("补救路径", "基础薄弱学生", "补救路径应从概念边界到证据标注逐步推进。", flowDiagram(["概念卡", "判断题", "证据表", "案例重做"])),
      card("拓展任务树", "进阶学生", "进阶任务应提供迁移和风险权衡，而不是更多同类练习。", treeDiagram("拓展", ["新案例", "风险权衡", "多角色辩论", "策略优化"])),
      card("支持覆盖", "是否有遗漏群体", "支持覆盖不足会让低参与风险延续到下一轮。", donut(82, "覆盖率")),
    ],
    reflectionAssetLoop: [
      card("目标—问题—改进闭环", "反思结构", "反思必须基于目标达成和证据，而不是主观感受。", loopDiagram()),
      card("教学资产回流", "哪些资源可复用", "案例、量规、反馈语和学生样例应进入资产库。", flowDiagram(["案例", "量规", "反馈语", "样例", "下轮诊断"])),
      card("本轮与下轮路径", "持续改进", "下轮改进必须有可验证指标。", beforeAfter("下轮验证", "本轮问题")),
      card("沉淀资源清单", "可复用资产", "资产沉淀让系统成为教师成长工具，而不只是一次性生成器。", checklist(["案例材料", "评价量规", "反馈语", "学生样例", "反思记录"])),
    ],
  };
  return cards[step.type] || [card(step.title, TYPE_META[step.type]?.label || "工作台", step.purpose, cardStack(step.requiredElements))];
}

function card(title, subtitle, insight, html) {
  return { title, subtitle, insight, html };
}

function svgWrap(content, viewBox = "0 0 420 190", extra = "", title = "教学证据图表") {
  return `<svg viewBox="${viewBox}" class="chart-svg ${extra}" role="img"><title>${esc(title)}</title>${content}</svg>`;
}

function triangleDiagram() {
  return svgWrap(`<polygon points="210,20 48,165 372,165" fill="rgba(217,119,87,.08)" stroke="${PALETTE.accent}" stroke-width="2"></polygon>
    ${svgNode(210, 20, "课程目标")}${svgNode(48, 165, "专业任务")}${svgNode(372, 165, "学生产出")}
    <text x="210" y="104" text-anchor="middle" fill="${PALETTE.graphite}" font-size="13">本课定位</text>`);
}

function svgNode(x, y, label) {
  return `<g><circle cx="${x}" cy="${y}" r="26" fill="#fffefa" stroke="${PALETTE.line}"></circle><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" fill="${PALETTE.graphite}">${esc(label)}</text></g>`;
}

function flowDiagram(nodes) {
  const width = 420;
  const step = nodes.length > 1 ? 348 / (nodes.length - 1) : 0;
  const body = nodes.map((name, index) => {
    const x = 36 + index * step;
    const nextX = 36 + (index + 1) * step;
    return `<g>${index < nodes.length - 1 ? `<line x1="${x + 28}" y1="84" x2="${nextX - 28}" y2="84" stroke="${PALETTE.line}" stroke-width="2"></line>` : ""}
      <rect x="${x - 33}" y="58" width="66" height="52" rx="14" fill="#fffefa" stroke="${index === 1 ? PALETTE.accent : PALETTE.line}"></rect>
      <text x="${x}" y="88" text-anchor="middle" font-size="11" fill="${PALETTE.graphite}">${esc(name)}</text></g>`;
  }).join("");
  return svgWrap(body, `0 0 ${width} 170`);
}

function radarLite(values, labels) {
  const cx = 210;
  const cy = 95;
  const r = 66;
  const outer = labels.map((_, index) => polar(cx, cy, r, index, labels.length));
  const pts = values.map((value, index) => polar(cx, cy, r * value / 100, index, values.length));
  const axis = outer.map((point, index) => `<line x1="${cx}" y1="${cy}" x2="${point[0]}" y2="${point[1]}" stroke="rgba(31,30,29,.08)"></line><text x="${point[0]}" y="${point[1]}" font-size="10" text-anchor="middle" fill="${PALETTE.muted}">${esc(labels[index])}</text>`).join("");
  return svgWrap(`<polygon points="${outer.map((point) => point.join(",")).join(" ")}" fill="none" stroke="${PALETTE.line}"></polygon>${axis}<polygon points="${pts.map((point) => point.join(",")).join(" ")}" fill="rgba(217,119,87,.20)" stroke="${PALETTE.accent}" stroke-width="2"></polygon>`);
}

function polar(cx, cy, r, index, total) {
  const angle = -Math.PI / 2 + index * 2 * Math.PI / total;
  return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
}

function cardStack(items) {
  return `<div class="mini-grid">${items.map((item) => `<div>${esc(item)}</div>`).join("")}</div>`;
}

function histogram() {
  return barChart(
    [3, 6, 8, 10, 7, 4],
    ["0-39", "40-49", "50-59", "60-69", "70-79", "80+"],
    [PALETTE.rose, PALETTE.rose, PALETTE.gold, PALETTE.gold, PALETTE.blue, PALETTE.sage],
    { yLabel: "人数", xLabel: "诊断得分段", referenceIndex: 3, referenceLabel: "60 分进入支架线" },
  );
}

function trendChart() {
  const series = [
    { key: "complete", label: "完成", color: PALETTE.sage },
    { key: "concept", label: "概念", color: PALETTE.blue },
    { key: "evidence", label: "证据", color: PALETTE.accent },
  ];
  const w = 420;
  const h = 190;
  const m = { l: 34, r: 20, t: 16, b: 32 };
  const iw = w - m.l - m.r;
  const ih = h - m.t - m.b;
  const grid = [0, 25, 50, 75, 100].map((value) => {
    const y = m.t + ih - ih * value / 100;
    return `<line class="chart-grid-line" x1="${m.l}" x2="${w - m.r}" y1="${y}" y2="${y}"></line><text class="chart-tick" x="${m.l - 8}" y="${y + 4}" text-anchor="end">${value}</text>`;
  }).join("");
  const benchmarkY = m.t + ih - ih * 70 / 100;
  const benchmark = `<line class="chart-threshold" x1="${m.l}" x2="${w - m.r}" y1="${benchmarkY}" y2="${benchmarkY}"></line>
    <text class="chart-threshold-label" x="${w - m.r - 2}" y="${benchmarkY - 5}" text-anchor="end">70% 可推进线</text>`;
  const lines = series.map((item, index) => {
    const pts = TREND_DATA.map((data, i) => [m.l + iw * i / (TREND_DATA.length - 1), m.t + ih - ih * data[item.key] / 100]);
    const last = pts[pts.length - 1];
    const lastValue = TREND_DATA[TREND_DATA.length - 1][item.key];
    return `<path d="M ${pts.map((point) => point.join(" ")).join(" L ")}" fill="none" stroke="${item.color}" stroke-width="2.5"></path>
      <text class="chart-direct-label" x="${Math.min(w - 62, last[0] + 10)}" y="${last[1] + 4}" fill="${item.color}">${item.label} ${lastValue}%</text>
      ${pts.map((point) => `<circle cx="${point[0]}" cy="${point[1]}" r="4" fill="${item.color}"></circle>`).join("")}`;
  }).join("");
  const labels = TREND_DATA.map((data, index) => `<text class="chart-tick" x="${m.l + iw * index / (TREND_DATA.length - 1)}" y="${h - 8}" text-anchor="middle">${data.label}</text>`).join("");
  return svgWrap(`${grid}${benchmark}${lines}${labels}<text class="chart-axis-title" x="${m.l + iw / 2}" y="${h - 1}" text-anchor="middle">课前周期</text><text class="chart-axis-title" x="12" y="${m.t + ih / 2}" text-anchor="middle" transform="rotate(-90 12 ${m.t + ih / 2})">比例</text>`);
}

function studentSegmentation() {
  const colors = [PALETTE.sage, PALETTE.blue, PALETTE.gold, PALETTE.accent, PALETTE.rose];
  const points = LEARNER_DATA.flatMap((group, groupIndex) => Array.from({ length: group.count }, (_, index) => ({
    x: clamp(group.engagement + (index % 3 - 1) * 8, 20, 100),
    y: clamp(group.score + (index % 4 - 1.5) * 5, 20, 95),
    color: colors[groupIndex],
  })));
  return scatterPlot(points, "课前参与", "诊断得分");
}

function scatterPlot(points, xLabel, yLabel) {
  const w = 420;
  const h = 190;
  const m = { l: 36, r: 16, t: 14, b: 30 };
  const iw = w - m.l - m.r;
  const ih = h - m.t - m.b;
  const grid = [0, 25, 50, 75, 100].map((value) => {
    const x = m.l + iw * value / 100;
    const y = m.t + ih - ih * value / 100;
    return `<line class="chart-grid-line" x1="${m.l}" x2="${w - m.r}" y1="${y}" y2="${y}"></line><line class="chart-grid-line light" x1="${x}" x2="${x}" y1="${m.t}" y2="${m.t + ih}"></line>`;
  }).join("");
  const xMid = m.l + iw * .5;
  const yMid = m.t + ih * .5;
  const guides = `<line class="chart-threshold" x1="${xMid}" x2="${xMid}" y1="${m.t}" y2="${m.t + ih}"></line>
    <line class="chart-threshold" x1="${m.l}" x2="${w - m.r}" y1="${yMid}" y2="${yMid}"></line>
    <text class="chart-zone-label" x="${m.l + 8}" y="${m.t + 14}">高表现</text>
    <text class="chart-zone-label" x="${w - m.r - 8}" y="${m.t + ih - 8}" text-anchor="end">需支架</text>`;
  const dots = points.map((point) => `<circle cx="${m.l + iw * point.x / 100}" cy="${m.t + ih - ih * point.y / 100}" r="5" fill="${point.color || PALETTE.accent}" opacity=".78"></circle>`).join("");
  return svgWrap(`${grid}${guides}${dots}<text class="chart-axis-title" x="${m.l + iw / 2}" y="${h - 4}" text-anchor="middle">${esc(xLabel)}</text><text class="chart-axis-title" x="12" y="${m.t + ih / 2}" text-anchor="middle" transform="rotate(-90 12 ${m.t + ih / 2})">${esc(yLabel)}</text>`);
}

function horizontalBars(data) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const colors = [PALETTE.accent, PALETTE.blue, PALETTE.gold, PALETTE.sage, PALETTE.rose];
  return `<div class="bars">${data.map((item, index) => `<div><div class="bar-label"><span>${esc(item.label)}</span><span>${item.value}</span></div><div class="bar-track"><i style="width:${item.value / max * 100}%;background:${colors[index % colors.length]}"></i></div></div>`).join("")}<p class="bar-caption">排序用于确定优先处理的教学障碍，不代表单一归因。</p></div>`;
}

function barChart(data, labels, colors = [], options = {}) {
  const w = 420;
  const h = 190;
  const m = { l: 34, r: 16, t: 14, b: 38 };
  const iw = w - m.l - m.r;
  const ih = h - m.t - m.b;
  const max = Math.max(...data, 1);
  const bw = iw / data.length * .66;
  const step = iw / data.length;
  const grid = [0, .25, .5, .75, 1].map((percent) => {
    const y = m.t + ih - ih * percent;
    const value = Math.round(max * percent);
    return `<line class="chart-grid-line" x1="${m.l}" x2="${w - m.r}" y1="${y}" y2="${y}"></line><text class="chart-tick" x="${m.l - 7}" y="${y + 4}" text-anchor="end">${value}</text>`;
  }).join("");
  const axis = `<line class="chart-axis" x1="${m.l}" x2="${m.l}" y1="${m.t}" y2="${m.t + ih}"></line><line class="chart-axis" x1="${m.l}" x2="${w - m.r}" y1="${m.t + ih}" y2="${m.t + ih}"></line>`;
  const reference = options.referenceLabel && Number.isFinite(options.referenceIndex)
    ? (() => {
      const x = m.l + options.referenceIndex * step;
      return `<line class="chart-threshold" x1="${x}" x2="${x}" y1="${m.t}" y2="${m.t + ih}"></line><text class="chart-threshold-label" x="${x + 6}" y="${m.t + 10}">${esc(options.referenceLabel)}</text>`;
    })()
    : "";
  const bars = data.map((value, index) => {
    const bh = ih * value / max;
    const x = m.l + index * step + step * .17;
    const y = m.t + ih - bh;
    const color = colors[index] || [PALETTE.accent, PALETTE.blue, PALETTE.sage, PALETTE.gold][index % 4];
    return `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5" fill="${color}" opacity=".86"></rect><text class="chart-value-label" x="${x + bw / 2}" y="${Math.max(12, y - 6)}" text-anchor="middle">${value}</text><text class="chart-tick" x="${x + bw / 2}" y="${h - 12}" text-anchor="middle">${esc(labels[index])}</text>`;
  }).join("");
  const axisTitles = `${options.xLabel ? `<text class="chart-axis-title" x="${m.l + iw / 2}" y="${h - 1}" text-anchor="middle">${esc(options.xLabel)}</text>` : ""}${options.yLabel ? `<text class="chart-axis-title" x="12" y="${m.t + ih / 2}" text-anchor="middle" transform="rotate(-90 12 ${m.t + ih / 2})">${esc(options.yLabel)}</text>` : ""}`;
  return svgWrap(axis + grid + reference + bars + axisTitles);
}

function objectiveMatrix() {
  return matrixMap(["记忆", "理解", "应用", "分析", "评价", "创造"], ["概念", "矩阵", "证据", "建议"], ["应用-矩阵", "分析-证据", "评价-建议"]);
}

function matrixMap(rows, cols, highlight = []) {
  const cells = rows.map((row, rowIndex) => `<div class="row-head">${esc(row)}</div>${cols.map((col, colIndex) => {
    const active = highlight.includes(`${row}-${col}`) || ((rowIndex + colIndex) % 3 === 0);
    return `<div class="${active ? "cell-active" : "cell-muted"}">${active ? "●" : "·"}</div>`;
  }).join("")}`).join("");
  return `<div class="data-matrix" style="--cols:${cols.length}"><div class="head">维度</div>${cols.map((col) => `<div class="head center">${esc(col)}</div>`).join("")}${cells}</div>`;
}

function threeColumnMap(columns, rows) {
  const colors = ["blue", "accent", "sage"];
  return `<div class="three-map">${rows.map((row) => `<div>${columns.map((column, index) => `<span class="${colors[index % colors.length]}"><b>${esc(column)}</b><small>${esc(row)}</small></span>`).join("")}</div>`).join("")}</div>`;
}

function heatmap(labels) {
  const cols = ["目标", "活动", "评价", "反馈"];
  return `<div class="heatmap-wrap"><div class="heatmap" style="--cols:${cols.length}"><div></div>${cols.map((col) => `<b>${esc(col)}</b>`).join("")}${labels.map((row, rowIndex) => `<span>${esc(row)}</span>${cols.map((col, colIndex) => {
    const value = (rowIndex * 23 + colIndex * 17 + 42) % 100;
    return `<i style="background:${heatColor(value)}">${value}</i>`;
  }).join("")}`).join("")}</div><div class="heatmap-legend" aria-label="热图强度说明"><span>低风险</span><i></i><b></b><em></em><span>高风险</span></div></div>`;
}

function donut(value, label) {
  const r = 54;
  const target = 60;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - value / 100);
  const targetAngle = -90 + target / 100 * 360;
  const targetPoint = polar(90, 90, r + 16, target / 100, 1);
  return svgWrap(`<circle cx="90" cy="90" r="${r}" fill="none" stroke="rgba(31,30,29,.08)" stroke-width="16"></circle>
    <circle cx="90" cy="90" r="${r}" fill="none" stroke="${PALETTE.accent}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" transform="rotate(-90 90 90)"></circle>
    <line class="chart-threshold" x1="90" y1="${90 - r - 9}" x2="90" y2="${90 - r + 9}" transform="rotate(${targetAngle} 90 90)"></line>
    <text x="90" y="84" text-anchor="middle" font-size="28" font-weight="700" fill="${PALETTE.accentDark}">${value}%</text>
    <text x="90" y="106" text-anchor="middle" font-size="12" fill="${PALETTE.muted}">${esc(label)}</text>
    <text class="chart-threshold-label" x="${targetPoint[0]}" y="${targetPoint[1]}" text-anchor="middle">及格线 ${target}%</text>`, "0 0 180 180", "donut-svg");
}

function heatColor(value) {
  if (value >= 70) return "rgba(217,119,87,.58)";
  if (value >= 45) return "rgba(181,138,69,.40)";
  return "rgba(77,98,87,.20)";
}

function networkDiagram(nodes) {
  const cx = 210;
  const cy = 95;
  const r = 68;
  const coords = nodes.map((node, index) => [...polar(cx, cy, r, index, nodes.length), node]);
  const lines = coords.map((point, index) => coords.slice(index + 1).map((target, subIndex) => `<line x1="${point[0]}" y1="${point[1]}" x2="${target[0]}" y2="${target[1]}" stroke="rgba(31,30,29,.07)"></line>`).join("")).join("");
  const labels = coords.map((point, index) => `<g><circle cx="${point[0]}" cy="${point[1]}" r="24" fill="#fffefa" stroke="${index === 0 ? PALETTE.accent : PALETTE.line}" stroke-width="1.5"></circle><text x="${point[0]}" y="${point[1] + 4}" text-anchor="middle" font-size="10" fill="${PALETTE.graphite}">${esc(point[2])}</text></g>`).join("");
  return svgWrap(lines + labels);
}

function quadrantChart() {
  return scatterPlot([
    { label: "内外边界", x: 82, y: 84, color: PALETTE.accent },
    { label: "策略组合", x: 62, y: 72, color: PALETTE.blue },
    { label: "模型历史", x: 34, y: 30, color: PALETTE.muted },
    { label: "案例证据", x: 76, y: 60, color: PALETTE.sage },
  ], "重要性", "难度");
}

function annotationBoard() {
  const items = [["事实", "门店慢病服务人手不足"], ["数据", "顾客复购率下降12%"], ["政策", "处方审核要求提高"], ["观点", "经理认为应扩大宣传"]];
  return `<div class="annotation-board">${items.map(([tag, text]) => `<div class="annotation-item"><div><strong>${esc(text)}</strong><p>材料类型：${esc(tag)}</p></div><span class="source-tag">${esc(tag)}</span></div>`).join("")}</div>`;
}

function checklist(items) {
  return `<div class="checklist">${items.map((item) => `<div><span>✓</span>${esc(item)}</div>`).join("")}</div>`;
}

function supportMatrix() {
  return matrixMap(["低参与", "边界混淆", "证据薄弱", "进阶"], ["概念卡", "证据表", "示范题", "挑战任务"]);
}

function treeDiagram(root, branches) {
  const branchWidth = 380 / branches.length;
  const body = `<rect x="160" y="18" width="100" height="38" rx="14" fill="#fffefa" stroke="${PALETTE.accent}"></rect><text x="210" y="42" text-anchor="middle" font-size="12" fill="${PALETTE.graphite}">${esc(root)}</text>${branches.map((branch, index) => {
    const x = 18 + index * branchWidth;
    return `<g><line x1="210" y1="56" x2="${x + 45}" y2="110" stroke="${PALETTE.line}"></line><rect x="${x}" y="110" width="90" height="40" rx="14" fill="#fffefa" stroke="${PALETTE.line}"></rect><text x="${x + 45}" y="134" text-anchor="middle" font-size="10" fill="${PALETTE.graphite}">${esc(branch)}</text></g>`;
  }).join("")}`;
  return svgWrap(body);
}

function timeline(checkpoints = false) {
  const items = [["0-8", "导入"], ["8-20", "概念支架"], ["20-52", "案例探究"], ["52-75", "展示追问"], ["75-90", "总结迁移"]];
  const widths = [18, 28, 75, 52, 36];
  return `<div class="timeline-board">${items.map(([time, name], index) => `<div class="timeline-item"><span class="time-badge">${time}</span><div><strong>${esc(name)}${checkpoints && index < 4 ? " · 检查点" : ""}</strong><p>活动必须留下可复盘的学习证据。</p></div><span class="evidence-tag" style="min-width:${widths[index]}px">${checkpoints ? "检查" : "证据"}</span></div>`).join("")}</div>`;
}

function conflictCards() {
  return cardStack(["政策机会还是外部威胁？", "药师能力是优势还是资源不足？", "患者需求增长如何转成策略？", "促销能否突破合规边界？"]);
}

function exampleMatrix() {
  return matrixMap(["政策支持", "药师不足", "竞争加剧", "服务流程"], ["优势", "劣势", "机会", "威胁"]);
}

function stepLadder(items) {
  return `<div class="step-ladder">${items.map((item, index) => `<div style="margin-left:${index * 16}px">${index + 1}. ${esc(item)}</div>`).join("")}</div>`;
}

function evidenceChain() {
  return flowDiagram(["案例事实", "证据标注", "SWOT判断", "策略建议"]);
}

function swimlane() {
  const roles = [["证据员", "提取事实"], ["分类员", "完成归类"], ["质询员", "追问依据"], ["汇报员", "展示修订"]];
  return `<div class="swimlane-board">${roles.map(([role, task]) => `<div class="swimlane-item"><strong>${esc(role)}</strong><p>${esc(task)}</p></div>`).join("")}</div>`;
}

function dialogueFlow() {
  return flowDiagram(["展示", "同伴质询", "教师追问", "学生修正"]);
}

function beforeAfter(good = "修正后", bad = "修正前") {
  return `<div class="before-after"><div class="bad"><span>${esc(bad)}</span><p>观点罗列，依据不足。</p></div><div class="good"><span>${esc(good)}</span><p>判断清楚，证据可追溯。</p></div></div>`;
}

function decisionTree() {
  return treeDiagram("检查结果", ["通过继续", "低正确率重讲", "证据不足加支架", "参与低重分组"]);
}

function rubricMatrix() {
  return matrixMap(["分类准确", "证据支撑", "策略匹配", "风险意识"], ["1分", "2分", "3分", "4分"]);
}

function loopDiagram() {
  return svgWrap(`<circle cx="210" cy="95" r="62" fill="none" stroke="rgba(217,119,87,.25)" stroke-width="16"></circle>
    <path d="M210 33 A62 62 0 0 1 272 95" fill="none" stroke="${PALETTE.accent}" stroke-width="16" stroke-linecap="round"></path>
    <path d="M272 95 A62 62 0 0 1 210 157" fill="none" stroke="${PALETTE.blue}" stroke-width="16" stroke-linecap="round"></path>
    <path d="M210 157 A62 62 0 0 1 148 95" fill="none" stroke="${PALETTE.sage}" stroke-width="16" stroke-linecap="round"></path>
    <path d="M148 95 A62 62 0 0 1 210 33" fill="none" stroke="${PALETTE.gold}" stroke-width="16" stroke-linecap="round"></path>
    <text x="210" y="99" text-anchor="middle" font-size="13" fill="${PALETTE.graphite}">持续改进</text>
    <text x="210" y="22" text-anchor="middle" font-size="10" fill="${PALETTE.muted}">目标</text>
    <text x="300" y="99" text-anchor="middle" font-size="10" fill="${PALETTE.muted}">证据</text>
    <text x="210" y="176" text-anchor="middle" font-size="10" fill="${PALETTE.muted}">改进</text>
    <text x="120" y="99" text-anchor="middle" font-size="10" fill="${PALETTE.muted}">资产</text>`);
}

function toast(text) {
  const node = $("toast");
  if (!node) return;
  node.textContent = text;
  node.classList.add("show");
  clearTimeout(node.timer);
  node.timer = setTimeout(() => node.classList.remove("show"), 1800);
}

function initTeachingNavigationWorkbench() {
  initProductizedGlobalNav();
  $("regenerateBtn")?.addEventListener("click", handleRegenerate);
  $("writeBtn")?.addEventListener("click", handleWrite);
  $("artifactText")?.addEventListener("input", (event) => {
    state.edits[currentStep().id] = event.target.value;
  });
  render();
}

initTeachingNavigationWorkbench();
