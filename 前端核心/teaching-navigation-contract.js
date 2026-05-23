/*
 * PharmacoPilot Teaching Navigation Contract v2.0
 * Fixed product contract for the teaching-navigation page.
 * Codex and later developers must treat this file as stable product structure,
 * not as temporary page copy.
 */
(function attachPharmacoPilotNavigationContract(global) {
  const VERSION = "phase10-v2";

  const NAVIGATION_PHASES = [
    {
      id: "pre",
      title: "课前设计与准备",
      subtitle: "把课程、学生、目标、内容与材料准备清楚。",
      stationIds: [1, 2, 3, 4, 5],
      outputPackage: "教学设计包",
      colorToken: "accent",
    },
    {
      id: "in",
      title: "课中实施与调控",
      subtitle: "把课堂活动、学生探究与即时反馈设计清楚。",
      stationIds: [6, 7, 8],
      outputPackage: "课堂实施包",
      colorToken: "sage",
    },
    {
      id: "post",
      title: "课后评价与改进",
      subtitle: "把学生作品、评价反馈与教学资产沉淀清楚。",
      stationIds: [9, 10],
      outputPackage: "评价迭代包",
      colorToken: "blue",
    },
  ];

  const PHARMACY_SCENARIOS = [
    {
      id: "pharmacy-service",
      title: "药事服务管理",
      subtitle: "慢病服务、药师角色、患者需求、服务质量。",
      evidenceBoundary: "服务流程、患者需求、药师能力、患者安全与质量管理边界。",
    },
    {
      id: "insurance-access",
      title: "医保支付与可及性",
      subtitle: "政策目标、支付边界、患者负担、资源配置。",
      evidenceBoundary: "医保政策、支付约束、药物经济性、患者负担与利益相关者立场。",
    },
    {
      id: "regulatory-compliance",
      title: "监管合规风险",
      subtitle: "处方审核、药师在岗、宣传边界、质量安全。",
      evidenceBoundary: "监管要求、处方流程、人员资质、宣传合规与患者安全风险。",
    },
    {
      id: "drug-operation",
      title: "药品经营与组织管理",
      subtitle: "库存、供应链、门店绩效、服务能力。",
      evidenceBoundary: "品类结构、供应链稳定性、门店资源、药师服务能力与竞争环境。",
    },
  ];

  const QUALITY_DIMENSIONS = [
    {
      id: "alignment",
      label: "目标—活动—评价一致性",
      shortLabel: "一致性",
      theory: "Backward Design / Constructive Alignment",
      diagnosticQuestion: "目标、活动、学生产出和评价证据是否指向同一类能力？",
    },
    {
      id: "authenticity",
      label: "药事管理情境真实性",
      shortLabel: "真实性",
      theory: "Authentic Learning",
      diagnosticQuestion: "案例是否嵌入真实或高仿真的药事管理问题？",
    },
    {
      id: "learner",
      label: "学情诊断与差异支持",
      shortLabel: "学情",
      theory: "UDL / Danielson Framework",
      diagnosticQuestion: "教学设计是否回应学生先备知识、常见误区和学习差异？",
    },
    {
      id: "cognition",
      label: "认知参与与高阶思维",
      shortLabel: "高阶",
      theory: "Bloom / ICAP",
      diagnosticQuestion: "课堂任务是否推动学生从理解走向应用、分析、评价和互动建构？",
    },
    {
      id: "assessment",
      label: "评价证据与反馈效度",
      shortLabel: "评价",
      theory: "Formative Assessment / Rubric",
      diagnosticQuestion: "评价和反馈能否解释学习目标达成并指导改进？",
    },
    {
      id: "improvement",
      label: "数据复盘与资产沉淀",
      shortLabel: "复盘",
      theory: "Learning Analytics / Reflective Practice",
      diagnosticQuestion: "是否能基于学生证据、低分维度和反馈语持续改进？",
    },
  ];

  const NAV_STATIONS = [
    {
      id: 1,
      phase: "pre",
      title: "课程任务定位",
      displayName: "课程任务定位台",
      userMindset: "这节课为什么教？服务什么药事管理能力？",
      what: "明确本节课在课程体系、专业能力培养和学生任务产出中的位置。",
      why: "防止新教师从“讲知识点”直接开始备课。SWOT 不是四象限介绍，而是药事管理情境中的管理判断训练。",
      how: "查看“课程目标—药事任务—学生产出”定位图，选择本课主要定位，生成课程任务定位段落。",
      evidenceFigure: "课程目标—药事任务—学生产出三角图",
      decisionQuestion: "本节 SWOT 课最应该被定位为什么？",
      artifactType: "课程任务定位段落",
      qualityDimensions: ["alignment", "authenticity"],
      backendCheckpoints: ["教学情境", "课程任务", "专业能力", "产出边界"],
    },
    {
      id: 2,
      phase: "pre",
      title: "学情诊断与课前导学",
      displayName: "学情侦探局",
      userMindset: "学生现在卡在哪里？课前要收集什么证据？",
      what: "判断学生进入本课前的知识基础、常见误区、参与状态和学习困难，并转化为课前导学任务。",
      why: "学情分析如果不能转化为任务和课堂调整，就是空泛分析。新教师需要知道学生具体卡在哪里。",
      how: "查看预习完成率、前测正确率、误区分布和开放题证据引用率，选择主要障碍，生成学情分析、导学任务和诊断题。",
      evidenceFigure: "前测分布图 / 误区结构条形图 / 参与度 × 诊断表现二维分群图",
      decisionQuestion: "本班进入案例探究前的首要障碍是什么？",
      artifactType: "学情分析段落、课前导学任务、诊断题与问题收集表",
      qualityDimensions: ["learner", "assessment"],
      backendCheckpoints: ["学情分析", "先备知识", "常见误区", "预习任务", "诊断题", "问题收集"],
    },
    {
      id: 3,
      phase: "pre",
      title: "学习目标与评价证据",
      displayName: "目标证据舱",
      userMindset: "学生学完后要能做什么？怎么证明？",
      what: "把教学目标改写为可观察、可评价、可由学生产出证明的学习成果。",
      why: "“理解 SWOT”“掌握方法”“培养能力”过于笼统，无法判断学习是否发生。",
      how: "查看“目标—活动—产出—评价证据”矩阵，识别目标缺口和证据缺口，生成学习目标与评价证据表。",
      evidenceFigure: "目标—活动—产出—评价矩阵 / Bloom 层级分布图 / 证据覆盖热图",
      decisionQuestion: "当前目标设计最应补强哪一项？",
      artifactType: "学习目标表、目标—活动—评价证据对齐表",
      qualityDimensions: ["alignment", "assessment", "cognition"],
      backendCheckpoints: ["教学目标", "学习成果", "评价证据", "目标对齐"],
    },
    {
      id: 4,
      phase: "pre",
      title: "内容重构与问题链",
      displayName: "内容问题链工作台",
      userMindset: "教材内容怎么变成课堂问题链？",
      what: "把教材内容重构为问题链、概念链和任务链，帮助学生围绕真实问题推进学习。",
      why: "直接按教材顺序讲会退化为概念讲授；药事管理课堂应围绕事实、证据、判断、策略和风险组织内容。",
      how: "查看“教材内容—核心概念—问题链—学生任务”结构图，选择内容组织方式，生成课堂问题链和核心概念边界说明。",
      evidenceFigure: "概念网络图 / 问题链流程图 / 认知负荷热图",
      decisionQuestion: "本课内容重构的主线应是什么？",
      artifactType: "内容结构图、课堂问题链、核心概念边界说明",
      qualityDimensions: ["alignment", "learner", "cognition"],
      backendCheckpoints: ["核心概念", "重点难点", "问题链", "认知负荷"],
    },
    {
      id: 5,
      phase: "pre",
      title: "案例证据与资源开发",
      displayName: "案例证据室",
      userMindset: "药事管理案例、政策、数据、任务材料怎么准备？",
      what: "准备药事管理案例、政策材料、数据资料、任务单和证据模板。",
      why: "案例必须包含事实、政策、数据、利益相关者和风险边界，否则学生只能凭常识填表。",
      how: "查看案例证据密度图，判断材料中的事实、政策、数据、角色和风险边界是否足够，生成案例材料说明与证据标注表。",
      evidenceFigure: "案例证据密度图 / 材料来源矩阵 / 利益相关者关系图 / 证据链图",
      decisionQuestion: "案例材料最需要先处理什么问题？",
      artifactType: "案例材料说明、证据标注表、学生任务材料包",
      qualityDimensions: ["authenticity", "assessment"],
      backendCheckpoints: ["案例材料", "政策数据", "证据模板", "来源边界"],
    },
    {
      id: 6,
      phase: "in",
      title: "课堂活动时间线",
      displayName: "课堂活动编排器",
      userMindset: "90 分钟课堂怎么展开？",
      what: "设计课堂导入、概念支架、案例分析、小组展示、反馈修正和总结迁移的时间结构。",
      why: "新教师常见问题是讲授时间过长、活动时间不足、讨论没有产出；本环节把课堂改为学生完成可评价任务。",
      how: "查看 90 分钟课堂时间线图，调整讲授、案例分析、协作展示和反馈总结比例，生成课堂流程表。",
      evidenceFigure: "课堂时间轴 / ICAP 参与层级图 / 活动—产出 Sankey 图",
      decisionQuestion: "90 分钟课堂最需要修正的结构问题是什么？",
      artifactType: "90 分钟课堂流程、活动—产出—评价节点表",
      qualityDimensions: ["alignment", "cognition", "assessment"],
      backendCheckpoints: ["问题导入", "概念支架", "案例探究", "展示总结", "时间结构"],
    },
    {
      id: 7,
      phase: "in",
      title: "案例探究与协作推进",
      displayName: "案例探究室",
      userMindset: "学生如何分析、讨论、协作、产出？",
      what: "设计学生如何围绕药事管理案例进行事实提取、证据判断、小组协作和成果展示。",
      why: "课堂活动不能只是“讨论一下”；药事管理本科生需要在真实问题中完成证据分析、策略判断和风险表达。",
      how: "查看小组任务泳道图或案例证据链图，判断每个小组角色是否有明确任务和产出，生成协作任务单和教师巡视提示。",
      evidenceFigure: "小组任务泳道图 / 案例证据链图 / 角色—产出矩阵",
      decisionQuestion: "小组协作最需要补强哪一项？",
      artifactType: "小组协作任务单、案例探究任务单、教师巡视与追问提示",
      qualityDimensions: ["authenticity", "cognition", "learner"],
      backendCheckpoints: ["协作分工", "角色任务", "证据分析", "教师巡视", "展示追问"],
    },
    {
      id: 8,
      phase: "in",
      title: "形成性反馈与即时调节",
      displayName: "反馈调节台",
      userMindset: "课堂中如何检查、反馈、调整？",
      what: "设计课堂中的检查点、反馈语、触发阈值和即时调节动作。",
      why: "课堂不是照教案机械执行；教师需要根据学生表现判断是否补讲、给反例、调整分组或展示典型错误。",
      how: "查看形成性评价触发点曲线，选择最关键的检查点，生成反馈语模板和课堂调节规则。",
      evidenceFigure: "反馈触发点曲线 / 误区—反馈语匹配表 / 课堂风险预警卡",
      decisionQuestion: "哪个检查点最关键？",
      artifactType: "形成性评价检查点、反馈语模板、课堂调节规则",
      qualityDimensions: ["assessment", "learner", "improvement"],
      backendCheckpoints: ["课堂检查点", "即时反馈", "学习预警", "教学调控"],
    },
    {
      id: 9,
      phase: "post",
      title: "表现性评价与反馈",
      displayName: "评价量规实验台",
      userMindset: "学生作品怎么评？反馈怎么写？",
      what: "用评价量规判断学生作品是否真正体现药事管理判断能力，并生成可行动反馈。",
      why: "学生作品可能格式完整但质量较低，例如缺少证据、分类错误、策略与分析不匹配或缺少风险边界。",
      how: "查看量规雷达图或低分维度 Pareto 图，判断作品主要问题，生成评价量规、评分说明和反馈语模板。",
      evidenceFigure: "量规雷达图 / 学生作品质量分布图 / 低分维度 Pareto 图",
      decisionQuestion: "表现性评价最应强调什么？",
      artifactType: "表现性评价量规、学生作品评分表、反馈语模板、二次修改要求",
      qualityDimensions: ["assessment", "alignment"],
      backendCheckpoints: ["学生作品", "评价量规", "评分说明", "反馈语", "二次修改"],
    },
    {
      id: 10,
      phase: "post",
      title: "复盘改进与资产沉淀",
      displayName: "复盘资产库",
      userMindset: "这次课如何变成下一轮教学资产？",
      what: "把学生作品、典型误区、低分维度、反馈语、案例材料和改进建议沉淀为下一轮教学资产。",
      why: "如果课后只保存最终教案，智能体无法真正进化；更有价值的是保存学生证据、低分原因、有效反馈语和下一轮改进动作。",
      how: "查看资产沉淀优先级图，选择最值得保存的资产，生成教学复盘报告和资产沉淀清单。",
      evidenceFigure: "低分维度趋势图 / 资产沉淀网络图 / 下一轮改进优先级矩阵",
      decisionQuestion: "复盘时最值得沉淀的资产是什么？",
      artifactType: "教学复盘报告、资产沉淀清单、下一轮改进计划",
      qualityDimensions: ["improvement", "assessment"],
      backendCheckpoints: ["数据复盘", "教学反思", "资源沉淀", "下一轮改进"],
    },
  ];

  const INTERACTION_CONTRACT = {
    stationTemplate: [
      "环节说明卡：是什么、为什么、用户如何做",
      "证据图：展示可支持教学判断的数据、案例、目标、活动或评价证据",
      "教学判断题：必须是教学决策题，不是知识问答题",
      "系统反馈：解释判断合理性、风险和修正建议",
      "产物生成：生成可写入教案、任务单、量规、反馈语或复盘清单的文本",
      "保存资产：写入教学数据页或教学资产库",
    ],
    artifactRequiredSections: [
      "图表观察",
      "教学判断",
      "药事管理情境",
      "课堂动作或评价动作",
      "证据与资产沉淀",
    ],
  };

  const COPY_RULES = {
    pageTitle: "面向新教师的药事管理课程教学导航工作台",
    pageSubtitle: "按课前、课中、课后推进一节课的证据化教学设计、实施与复盘。",
    forbiddenVisiblePhrases: [
      "20环节教学模拟工作台",
      "20环节教学导航路径",
      "20个教学环节导航图",
    ],
    allowedTwentyStepUsage: "20 环节只允许作为后台质量检查点、理论映射或隐藏式诊断维度出现。",
  };

  const FORBIDDEN_CHANGES = [
    "不得把前台改回 20 个可见环节。",
    "不得把页面做成通用后台 dashboard。",
    "不得把页面做成学生闯关游戏；服务对象是新教师。",
    "不得增加大段前端说明文字；应由图表、判断题、反馈和产物驱动。",
    "不得把 SWOT 当作产品总主题；它只是《管理学原理》中的示例知识点。",
    "不得移除药事管理情境。",
    "不得大改 app.js 或全局工程结构。",
    "不得引入外部依赖；优先使用静态 HTML / CSS / 原生 JS / SVG。",
  ];

  function deepFreeze(obj) {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach((prop) => {
      const value = obj[prop];
      if (value && typeof value === "object" && !Object.isFrozen(value)) deepFreeze(value);
    });
    return obj;
  }

  global.PharmacoPilotNavigationContract = deepFreeze({
    VERSION,
    NAVIGATION_PHASES,
    NAV_STATIONS,
    PHARMACY_SCENARIOS,
    QUALITY_DIMENSIONS,
    INTERACTION_CONTRACT,
    COPY_RULES,
    FORBIDDEN_CHANGES,
  });
})(window);
