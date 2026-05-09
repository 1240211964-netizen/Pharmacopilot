const pains = [
  {
    id: 1,
    stage: "课前准备阶段",
    title: "课程定位与目标设计",
    pain: "不知道这门《管理学》课到底要讲到什么程度",
    manifestation:
      "新教师往往只会照教材逐章备课，难以把课程目标、章节目标与专业培养目标对齐；容易出现目标过泛或重点失衡。",
    impact: "学生学完后知道概念，但不清楚课程与药学和本专业的关系。",
    solution:
      "智能体将培养方案、课程大纲、教材章节要求自动映射，帮助教师生成“本门课—本章—本次课”三级目标。",
    features: "课程目标自动拆解；章节目标生成；必讲/可选/延伸内容建议",
  },
  {
    id: 2,
    stage: "课前准备阶段",
    title: "教学内容组织与重点编排",
    pain: "知道教材内容，但不会选内容、排顺序、定重难点",
    manifestation:
      "第一次上课时常把知识点平铺直叙地罗列出来，不清楚哪部分是基础概念、哪部分应结合药学场景重点展开。",
    impact: "学生难以抓住主线。",
    solution:
      "智能体自动生成“核心概念—关键关系—典型案例—易错点”结构化教学框架，并给出本次课的推荐讲授顺序。",
    features: "重难点识别；15/45/90分钟不同课时模板；章节逻辑图；易混概念对比卡",
  },
  {
    id: 3,
    stage: "课前准备阶段",
    title: "药学场景转化",
    pain: "管理学理论抽象，不会转成药学语境下的真实案例",
    manifestation:
      "新教师懂理论，但难以快速找到与药学服务、药品供应、医保支付、药店运营、公共卫生等相关的管理学案例。",
    impact: "课程容易变成泛管理学。",
    solution:
      "智能体将管理学概念自动映射到药学管理场景，生成案例导入、情境讨论题和岗位化解释。",
    features: "药学管理案例库；概念—场景自动映射；案例导入脚本；行业新闻转教学案例",
  },
  {
    id: 4,
    stage: "课前准备阶段",
    title: "学情分析与教学预判",
    pain: "不了解学生基础，备课缺乏针对性",
    manifestation:
      "新教师对学生的前置知识、学习风格、专业背景缺乏了解，备课时假设学生“什么都不知道”或“什么都知道”。",
    impact:
      "教学内容与学生实际水平脱节，要么过于简单导致学生无聊，要么过于深入导致听不懂。",
    solution:
      "智能体通过前测问卷、历届学生数据分析，帮助教师快速掌握班级学情画像，并据此推荐差异化教学策略。",
    features: "课前学情诊断问卷自动生成；班级知识基线画像；内容深度建议；差异化教学策略推荐",
  },
  {
    id: 5,
    stage: "课中实施阶段",
    title: "教学设计",
    pain: "不会设计完整教学过程",
    manifestation:
      "新教师常准备了内容，却没有设计导入、提问、讨论、练习、总结等教学动作；或者所有环节都靠教师讲。",
    impact: "学生课堂参与度低，被动接收。",
    solution:
      "智能体围绕每次课自动生成“导入—讲授—互动—练习—总结—作业”完整教学流程，并针对不同班型给出替代方案。",
    features: "一键生成教学流程；互动节点建议；小组讨论题；随堂练习设计；板书建议",
  },
  {
    id: 6,
    stage: "课中实施阶段",
    title: "PPT与教案起草",
    pain: "第一次备课耗时长，资料搜集和课件撰写效率低",
    manifestation:
      "新教师通常需要花大量时间找案例、写讲稿、做PPT、写教案，但产出质量不稳定，且不同材料之间口径不一致。",
    impact: "容易把时间都花在资料拼接而不是教学设计上。",
    solution:
      "智能体根据课程目标和本次课主题，自动生成教案初稿、PPT提纲、案例页和课堂话术。",
    features: "教案初稿；PPT大纲；课堂讲授提示词；讲稿与作业一体化生成",
  },
  {
    id: 7,
    stage: "课中实施阶段",
    title: "教学资源获取与整合",
    pain: "不知道去哪找高质量的教学资源和学术素材",
    manifestation:
      "新教师缺乏教学资源积累，不知道有哪些数据库、政策文件、行业报告可以用于教学。",
    impact: "缺乏前沿性和丰富度，课程吸引力不足；学生觉得内容陈旧。",
    solution:
      "智能体整合药学管理领域的政策文件、行业报告、学术文献、统计数据等资源，按教学主题分类推荐，并自动提取关键信息生成教学卡片。",
    features: "教学资源智能推荐；政策文件摘要；行业数据可视化模板；学术前沿速递；资源自动归档",
  },
  {
    id: 8,
    stage: "课中实施阶段",
    title: "课堂提问与互动",
    pain: "不会提问，提问层次单一，学生不愿意参与",
    manifestation:
      "新教师设计的问题要么过于简单，只能复述定义；要么过于空泛，学生无从作答；互动常流于形式。",
    impact: "不能有效检验理解，也不利于培养分析和决策能力。",
    solution:
      "智能体为每个知识点生成分层提问，并提供追问脚本、可能答案与纠偏提示。",
    features: "分层提问库；追问脚本；学生回答偏差提示；课堂投票题/判断题生成",
  },
  {
    id: 9,
    stage: "课中实施阶段",
    title: "课堂节奏控制",
    pain: "时间分配失衡，不知道每个环节讲多久",
    manifestation:
      "第一次授课容易导入过长、案例讲太细、后半程仓促收尾，或者内容没有讲完、练习被牺牲。",
    impact: "学生体验差，教师也难以完成既定教学目标。",
    solution:
      "智能体根据课时长度自动建议时间分配，并在教案中标注每个环节的推荐时长和可压缩环节。",
    features: "45分钟/90分钟节奏模板；超时预警点；可删减内容提示；课中提纲版教师卡片",
  },
  {
    id: 10,
    stage: "课中实施阶段",
    title: "实践教学设计",
    pain: "不知道如何设计与管理学理论匹配的实践环节",
    manifestation:
      "新教师缺乏药学管理实践教学经验，不知道如何设计药店经营模拟、SWOT分析实训、药品营销策划等实践项目。",
    impact: "理论与实践脱节，课程的应用性和职业导向性不足。",
    solution:
      "智能体提供与各章节匹配的实践教学方案模板，包括情境模拟、角色扮演、项目制学习等形式，并生成任务书和评价标准。",
    features: "实践教学方案库；模拟场景设计；角色扮演脚本；项目任务书自动生成；实践成果评价Rubric",
  },
  {
    id: 11,
    stage: "课后评价与反馈阶段",
    title: "过程性评价设计",
    pain: "只会留作业和签到",
    manifestation:
      "新教师常把过程性评价等同于出勤和课后作业，缺乏与课程目标匹配的随堂练习、案例分析、讨论表现等评价设计。",
    impact: "评价结果难以反映真实学习过程，也难以反哺教学改进。",
    solution:
      "智能体将课程目标映射到评价任务，帮助教师设计随堂任务、讨论评分规则、案例作业与阶段性反馈。",
    features: "评价任务模板；Rubric生成；目标—作业—评价映射；平时分构成建议",
  },
  {
    id: 12,
    stage: "课后评价与反馈阶段",
    title: "作业批改与反馈",
    pain: "作业能批改，但不会高质量或者一对一反馈",
    manifestation:
      "尤其是案例分析、简答题、管理决策小论文，新教师批改慢、反馈浅，只给一些共性建议。",
    impact: "学生不知道如何改进，教师也难以积累共性问题用于改课。",
    solution:
      "智能体可对文本型作业进行初步批阅，标注错误类型、薄弱概念和建议补学资源，教师再进行二次把关。",
    features: "案例作业初批；错因归类；个体反馈建议；班级共性问题画像",
  },
  {
    id: 13,
    stage: "课后评价与反馈阶段",
    title: "课程思政与专业融合",
    pain: "课程思政容易与专业内容不兼容",
    manifestation: "难以自然嵌入药学管理情境与职业规范。",
    impact: "思政内容生硬，影响课堂连贯性。",
    solution:
      "智能体在药学管理案例中自动识别可嵌入的职业伦理、公共责任、患者利益、资源公平等价值议题，并给出自然融入的表达方式。",
    features: "思政嵌入点提示；案例价值议题卡；概念+职业规范讲授建议",
  },
  {
    id: 14,
    stage: "课后评价与反馈阶段",
    title: "考试命题与试卷设计",
    pain: "不会科学命题，试卷质量不稳定",
    manifestation: "新教师命题缺乏经验，题目难度分布不合理、知识点覆盖不全、题型单一。",
    impact: "学生觉得考试与课堂所学脱节。",
    solution:
      "智能体根据课程目标和教学内容自动生成试题库，支持按知识点、难度、题型组卷，并自动校验目标覆盖度和难度分布。",
    features: "智能题库生成；药学情境化命题模板；历年试题分析与优化建议",
  },
  {
    id: 15,
    stage: "教师发展与课程建设阶段",
    title: "学科前沿跟踪",
    pain: "教学内容更新滞后，缺乏前沿性",
    manifestation:
      "新教师忙于日常教学和科研，没有精力持续跟踪药学管理领域的政策变化、行业动态和学术前沿。",
    impact: "学生获取的知识滞后于行业发展，毕业后发现课堂所学与实际工作脱节。",
    solution:
      "智能体持续追踪药学管理领域政策文件、行业报告、核心期刊论文等，自动提炼与教学相关的前沿信息，推荐可融入的章节和使用方式。",
    features: "政策动态追踪；行业报告自动摘要；前沿文献转教学素材；热点事件教学化解读；按章节推送提醒",
  },
  {
    id: 16,
    stage: "教师发展与课程建设阶段",
    title: "课后复盘与教学反思",
    pain: "上完课后不知道如何系统复盘和改进",
    manifestation:
      "教师没有结构化复盘框架，课后反思停留在模糊层面；缺乏基于数据的教学效果分析能力。",
    impact: "经验难以沉淀，下一轮授课仍重复同样问题；教学能力成长缓慢。",
    solution:
      "智能体根据课堂记录、作业数据和学生反馈，自动生成结构化复盘报告，精准定位教学薄弱环节并提供改进建议。",
    features: "课堂复盘报告自动生成；学生反馈智能摘要；教学行为数据分析；改课建议清单；教学反思日志模板",
  },
  {
    id: 17,
    stage: "教师发展与课程建设阶段",
    title: "教学督导与同行评价",
    pain: "不知道如何准备教学督导听课和同行评议",
    manifestation:
      "新教师对教学督导的评价标准不熟悉，不知道听课时评委关注什么、怎样准备示范课。",
    impact: "督导评价得分不理想，影响年度考核和职称评审；因焦虑导致示范课发挥失常。",
    solution:
      "智能体内置主流教学评价指标体系，对教师教案和教学设计进行自动预评估，标注可能的扣分点并给出优化建议。",
    features: "教学评价标准解读；教案自动预评分；示范课亮点设计建议；扣分风险点提示；教学竞赛准备指导",
  },
  {
    id: 18,
    stage: "教师发展与课程建设阶段",
    title: "教学团队协作与经验共享",
    pain: "缺乏与教学团队的有效沟通和资源共享机制",
    manifestation:
      "新教师与课程组其他教师之间缺乏系统沟通机制，不同教师讲授同一课程时口径不一、重复建设。",
    impact: "课程建设碎片化，团队整体教学水平提升慢；学生在不同班级获得的教学体验差异大。",
    solution:
      "智能体支持课程组共享教学资源库，统一课程标准和核心案例，记录不同教师的教学创新并促进经验流转。",
    features: "课程组共享知识库；统一教学标准；核心案例库；协作备课工作流；教学资源版本管理",
  },
  {
    id: 19,
    stage: "教师发展与课程建设阶段",
    title: "跨轮次持续优化",
    pain: "缺乏从首轮授课走向成熟课程的积累机制",
    manifestation:
      "新教师前几轮授课中积累的案例、提问、评价与反馈经验分散在个人电脑和临时文档中，难以沉淀为系统化课程资产。",
    impact: "课程建设效率低，团队共享弱，不利于持续迭代和推广。",
    solution:
      "智能体把教案、案例、作业、错题、反馈和复盘结果沉淀为结构化课程知识库，支持版本对比和迭代追踪。",
    features: "课程资产结构化沉淀；版本对比与迭代追踪；优秀案例复用推荐；教师成长档案；课程建设成果报告自动生成",
  },
  {
    id: 20,
    stage: "教师发展与课程建设阶段",
    title: "课堂管理与学生参与激励",
    pain: "难以调动学生积极性，课堂管理经验不足",
    manifestation:
      "新教师面对大班教学时常遇到学生玩手机、迟到、讨论不参与等情况；不知道如何建立课堂规则和激励机制。",
    impact: "课堂纪律松散，有效教学时间减少；学生参与度低导致教学效果不理想。",
    solution:
      "智能体提供课堂管理策略库、游戏化激励方案和师生互动技巧，帮助教师建立积极的课堂氛围。",
    features: "课堂管理策略推荐；游戏化教学/积分激励方案设计；课堂规则模板；大班教学互动技巧库；突发情况应对脚本",
  },
];

const stageOrder = [
  "全部",
  "课前准备阶段",
  "课中实施阶段",
  "课后评价与反馈阶段",
  "教师发展与课程建设阶段",
];

const stageBriefs = {
  课前准备阶段: {
    sequence: "Phase 01",
    label: "Prepare",
    node: "目标对齐、内容取舍与学情预判",
    title: "先把目标、内容和学情拉到同一张桌面上",
    body:
      "把培养方案、课程大纲、教材章节和班级基线统一到一个备课界面里，帮助教师先判断这次课讲什么、讲到什么程度，再决定用什么药学场景切入。",
    teacher: [
      "确认课程目标、章节目标和本次课目标是否一致",
      "判断知识点的深浅、重难点和推荐讲授顺序",
      "预判学生基础差异，决定是否需要前测或分层策略",
    ],
    agent: [
      "自动拆解课程—章节—课次三级目标",
      "生成重难点、内容取舍建议和章节逻辑图",
      "把管理学概念映射成药学管理案例、导入脚本和讨论情境",
      "输出学情诊断问卷与差异化教学建议",
    ],
    outputs: ["课次目标卡", "内容结构图", "药学案例导入脚本", "学情画像与分层建议"],
    signals: ["目标对齐", "内容定界", "案例转化", "学情预判"],
    summary: "让教师在上课前就清楚知道为什么讲、讲什么、如何起讲。",
    connector: "从课程平台带入课程、班级和章节上下文，形成开课前的统一备课底稿。",
    accent: "var(--sage)",
  },
  课中实施阶段: {
    sequence: "Phase 02",
    label: "Teach",
    node: "组织课堂流程、互动与节奏控制",
    title: "把课堂从“讲内容”升级成“带着学生完成任务”",
    body:
      "围绕一次完整授课，把导入、讲授、互动、练习、总结和作业串起来，同时给教师一个可跟着走的课堂执行脚本，避免节奏失控或互动流于形式。",
    teacher: [
      "组织本次课的导入、讲授、互动、练习和总结节奏",
      "准备 PPT、教案、板书线索和课堂提问",
      "控制 45 分钟或 90 分钟课堂中每个环节的时间",
    ],
    agent: [
      "生成完整教学流程、PPT 提纲、教案初稿和课堂话术",
      "提供分层提问、追问脚本、投票题和随堂练习",
      "给出课堂节奏模板、超时预警点和可压缩内容提示",
      "生成实践教学任务书、角色扮演脚本和评价标准",
    ],
    outputs: ["课堂流程脚本", "PPT 与教案初稿", "互动提问库", "节奏控制卡与实践任务书"],
    signals: ["教学设计", "互动提问", "节奏控制", "实践任务"],
    summary: "帮助教师把一堂课真正执行起来，而不是只有一堆零散材料。",
    connector: "可在课中发布任务、同步课堂作业说明，并把关键课堂动作记录为后续分析数据。",
    accent: "var(--blue)",
  },
  课后评价与反馈阶段: {
    sequence: "Phase 03",
    label: "Evaluate",
    node: "把目标转成评价任务、反馈和题库",
    title: "把课堂目标转成能落地的评价和反馈机制",
    body:
      "从随堂任务、Rubric 到作业反馈和题库命题，智能体把教学目标映射成评价动作，让教师不只会留作业，更能给出高质量反馈并沉淀可用数据。",
    teacher: [
      "决定哪些学习证据可以代表学生真正掌握了目标",
      "设计作业、讨论表现、随堂练习和考试题目的评价方式",
      "查看学生提交结果并给出个体反馈或班级层面的补救建议",
    ],
    agent: [
      "自动生成评价任务、Rubric 和目标—作业—评价映射",
      "对案例作业和简答作业做初批、错因归类和个体反馈建议",
      "生成思政融合表达和药学职业伦理嵌入点",
      "按知识点、难度和题型生成题库并校验覆盖度",
    ],
    outputs: ["Rubric 与评价任务", "作业反馈建议", "班级共性问题画像", "题库与组卷方案"],
    signals: ["Rubric", "作业反馈", "题库组卷", "价值融入"],
    summary: "评价不再是课后的补丁，而是课堂目标的延伸和闭环。",
    connector: "课后可同步作业、题库和成绩相关数据，并把学生表现反向喂给下一轮教学设计。",
    accent: "var(--amber)",
  },
  教师发展与课程建设阶段: {
    sequence: "Phase 04",
    label: "Improve",
    node: "复盘沉淀、团队共享与跨轮次迭代",
    title: "把单次授课经验沉淀成可复用的课程资产",
    body:
      "课堂结束后，系统继续把复盘、督导、团队协作和跨轮次迭代串起来，帮助教师从一次上课逐步走向稳定、成熟、可共享的课程建设体系。",
    teacher: [
      "复盘本次课哪里有效、哪里卡住、下次需要怎么改",
      "准备教学督导、示范课或同行评议材料",
      "与课程组共享案例、统一口径并持续迭代课程版本",
    ],
    agent: [
      "基于课堂记录、作业数据和学生反馈生成结构化复盘报告",
      "追踪政策、行业报告和文献更新，推送可融入教学的新素材",
      "根据教学评价指标自动预评估教案并标记潜在扣分点",
      "沉淀课程知识库、共享案例库和版本迭代记录",
    ],
    outputs: ["复盘报告", "督导准备清单", "课程组共享知识库", "跨轮次迭代档案"],
    signals: ["复盘分析", "前沿跟踪", "团队协作", "课程资产"],
    summary: "产品价值不止体现在一堂课，而是体现在课程会越来越成熟。",
    connector: "把平台日志、反馈数据和课程资源沉淀为长期资产，支撑团队共享与持续优化。",
    accent: "var(--rose)",
  },
};

const fanyaEntry = {
  name: "CoursePilot 泛雅助手",
  platform: "泛雅第三方入口",
};

const state = {
  stage: "全部",
  workflowStage: "课前准备阶段",
  query: "",
  selectedId: 1,
  selectedFeature: splitFeatures(pains[0].features)[0] ?? "",
  workflowIntake: {
    text: "",
    files: [],
  },
  connected: false,
  launch: {
    courseId: "",
    clazzId: "",
    cpi: "",
    enc: "",
    source: "",
  },
  fanya: {
    state: "checking",
    connected: false,
    message: "课程系统连接状态检测中",
    missing: [],
  },
  courseAgent: {
    state: "ready",
    connected: true,
    message: "当前站点已可作为泛雅第三方链接打开",
    missing: [],
    reply: "",
  },
};

const $ = (selector) => document.querySelector(selector);

function firstParam(params, names) {
  for (const name of names) {
    const value = params.get(name);
    if (value) return value;
  }
  return "";
}

function readLaunchContext() {
  const params = new URLSearchParams(window.location.search);
  state.launch = {
    courseId: firstParam(params, ["courseId", "courseid", "course_id"]),
    clazzId: firstParam(params, ["clazzId", "clazzid", "classId", "classid", "class_id"]),
    cpi: firstParam(params, ["cpi", "CPI"]),
    enc: firstParam(params, ["enc"]),
    source: firstParam(params, ["source", "from"]) || (params.size ? "fanya" : ""),
  };
}

function splitFeatures(text) {
  return text
    .split(/[；;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function stageItems(stage) {
  return pains.filter((item) => item.stage === stage);
}

function firstStageItem(stage) {
  return stageItems(stage)[0] ?? pains[0];
}

function ensureSelectedFeature(item) {
  const features = splitFeatures(item.features);
  if (!features.length) {
    state.selectedFeature = "";
    return "";
  }
  if (!features.includes(state.selectedFeature)) {
    state.selectedFeature = features[0];
  }
  return state.selectedFeature;
}

function shortenLabel(text, limit = 28) {
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function currentCourseTopic() {
  const text = state.workflowIntake.text.trim();
  if (/swot/i.test(text)) return "管理学中的 SWOT 分析";

  const quoted = text.match(/[《“"]([^》”"\n]{2,30})[》”"]/);
  if (quoted?.[1]) return quoted[1].trim();

  const topicMatch = text.match(/(?:课程|主题|本次课|章节|内容)[：:\s]*([^\n，,。；;]{3,32})/);
  if (topicMatch?.[1]) return topicMatch[1].trim();

  if (text) return shortenLabel(text.replace(/\s+/g, " "));

  const file = state.workflowIntake.files[0];
  if (file?.name) return shortenLabel(file.name.replace(/\.[^.]+$/, ""));

  return "管理学中的 SWOT 分析";
}

function currentCourseHint(topic) {
  if (state.workflowIntake.text.trim()) {
    return `已根据输入内容推断当前课程主题为“${topic}”。`;
  }
  if (state.workflowIntake.files.length) {
    return `已根据上传的 ${state.workflowIntake.files.length} 个文件推断当前课程主题为“${topic}”。`;
  }
  return `当前还没有输入课程主题，以下先用“${topic}”作为展示示例。`;
}

function currentSelection() {
  const selected =
    filteredPains().find((item) => item.id === state.selectedId) ??
    pains.find((item) => item.id === state.selectedId) ??
    pains[0];
  return {
    selected,
    activeFeature: ensureSelectedFeature(selected),
    topic: currentCourseTopic(),
  };
}

function launchContextText() {
  const lines = [];
  if (state.launch.courseId) lines.push(`courseId=${state.launch.courseId}`);
  if (state.launch.clazzId) lines.push(`clazzId=${state.launch.clazzId}`);
  if (state.launch.cpi) lines.push(`cpi=${state.launch.cpi}`);
  if (state.launch.source) lines.push(`source=${state.launch.source}`);
  return lines.length ? lines.join("；") : "当前没有从泛雅带入课程参数";
}

function buildFanyaPublishText(selected, activeFeature, topic) {
  const intakeText = state.workflowIntake.text.trim() || "教师暂未输入额外课程材料，请先基于页面已有课程上下文生成。";
  const files = state.workflowIntake.files.length
    ? state.workflowIntake.files.map((file) => `${file.name}（${formatFileSize(file.size)}）`).join("；")
    : "未上传附件";
  const checklist = buildActionChecklist(selected, activeFeature, topic);
  const deliverables = buildActionDeliverables(selected, activeFeature, topic);

  return [
    "【CoursePilot 泛雅发布稿】",
    "",
    "这份内容可直接粘贴到泛雅课程的任务、讨论、作业说明或课程资源说明中，教师可按实际班级情况微调后发布。",
    "",
    `【泛雅启动参数】${launchContextText()}`,
    `【当前课程主题】${topic}`,
    `【教学阶段】${selected.stage}`,
    `【教学环节】${selected.title}`,
    `【本次教学动作】${activeFeature}`,
    `【教师输入】${intakeText}`,
    `【附件线索】${files}`,
    "",
    "【建议发布给学生的任务说明】",
    `请围绕“${topic}”完成本次学习任务，重点关注“${selected.title}”中的关键问题。课堂或课后提交时，请结合课程案例、概念依据和个人判断进行说明。`,
    "",
    "【教师执行建议】",
    ...checklist.map((item, index) => `${index + 1}. ${item}`),
    "",
    "【建议配套材料】",
    ...deliverables.map((item, index) => `${index + 1}. ${item}`),
    "",
    "【发布前确认】",
    "1. 确认任务截止时间、提交方式和评分标准。",
    "2. 确认学生是否需要分组、是否需要上传附件。",
    "3. 确认内容是否符合本校泛雅课程的栏目设置。",
  ].join("\n");
}

function currentAgentPrompt() {
  const { selected, activeFeature, topic } = currentSelection();
  return buildFanyaPublishText(selected, activeFeature, topic);
}

function formatReplyText(text) {
  return escapeHtml(text || "").replace(/\n/g, "<br>");
}

function renderAgentReply(kind, text) {
  const reply = $("#courseAgentReply");
  if (!reply) return;
  reply.className = `course-agent-reply is-${kind}`;
  reply.innerHTML = formatReplyText(text);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function updateButtonBriefly(button, text) {
  if (!button) return;
  const original = button.innerHTML;
  button.textContent = text;
  window.setTimeout(() => {
    button.innerHTML = original;
  }, 1800);
}

async function copyCurrentAgentPrompt(button) {
  await copyText(currentAgentPrompt());
  updateButtonBriefly(button, "已复制");
}

async function prepareFanyaDraft(button, draftOverride = "") {
  const input = $("#courseAgentInput");
  const draft = (draftOverride || currentAgentPrompt()).trim();
  const targetButton = button || $("#askCourseAgent");
  if (input) input.value = draft;
  try {
    await copyText(draft);
    state.courseAgent = {
      state: "ready",
      connected: true,
      message: "泛雅发布稿已生成并复制",
      missing: [],
      reply: "已生成并复制到剪贴板。你可以把它粘贴到泛雅的任务、讨论、作业或课程资源说明中。",
    };
    renderCourseAgent();
    updateButtonBriefly(targetButton, "已复制");
  } catch (error) {
    state.courseAgent = {
      state: "error",
      connected: false,
      message: error.message,
      missing: [],
      reply: "",
    };
    renderCourseAgent();
    renderAgentReply("error", `发布稿已生成，但复制失败：${error.message}`);
  }
}

function buildHelpSummary(item) {
  const features = splitFeatures(item.features).slice(0, 3);
  return `围绕“${item.title}”，可以帮助你完成${features.join("、")}等具体动作。`;
}

function describeFeatureOutput(feature) {
  if (feature.includes("目标")) return "三级目标卡、目标对齐表和内容边界建议";
  if (feature.includes("重难点")) return "重难点排序、讲授重点和易错点清单";
  if (feature.includes("模板")) return "按课时长度拆好的结构模板和时间分配建议";
  if (feature.includes("逻辑图")) return "知识结构图、讲授顺序和章节主线";
  if (feature.includes("案例")) return "案例素材、导入脚本和课堂讨论题";
  if (feature.includes("映射")) return "概念到场景的映射表和岗位化表达";
  if (feature.includes("学情")) return "学情问卷、班级画像和差异化建议";
  if (feature.includes("流程")) return "导入、讲授、互动、练习和总结的整套流程";
  if (feature.includes("PPT") || feature.includes("教案") || feature.includes("讲稿")) return "教案初稿、PPT 提纲和课堂讲授提示";
  if (feature.includes("资源") || feature.includes("文献") || feature.includes("摘要")) return "教学资源清单、摘要和素材引用建议";
  if (feature.includes("提问") || feature.includes("追问")) return "分层提问库、追问脚本和常见回答偏差提醒";
  if (feature.includes("节奏") || feature.includes("超时")) return "环节时长表、压缩方案和课中提示卡";
  if (feature.includes("实践") || feature.includes("任务书") || feature.includes("Rubric")) return "实践任务书、角色设置和成果评价标准";
  if (feature.includes("评价")) return "评价任务、Rubric 和目标映射关系";
  if (feature.includes("反馈") || feature.includes("初批") || feature.includes("错因")) return "作业反馈、错因归类和补学建议";
  if (feature.includes("思政") || feature.includes("价值")) return "价值议题嵌入点和自然表达方式";
  if (feature.includes("题库") || feature.includes("命题")) return "题库草案、组卷建议和覆盖度检查";
  if (feature.includes("政策") || feature.includes("前沿") || feature.includes("热点")) return "前沿信息摘要、章节挂接点和课堂引用方式";
  if (feature.includes("复盘")) return "复盘报告、问题定位和下一轮改课建议";
  if (feature.includes("督导") || feature.includes("示范课")) return "督导预评分、亮点设计和风险提示";
  if (feature.includes("共享") || feature.includes("知识库") || feature.includes("版本")) return "课程资产条目、共享记录和版本迭代清单";
  if (feature.includes("课堂管理") || feature.includes("激励") || feature.includes("规则")) return "课堂规则、激励机制和突发情况应对脚本";
  return "可直接编辑的教学草案与配套材料";
}

function buildActionSummary(item, feature, topic) {
  return `点击“${feature}”后，系统会围绕“${topic}”直接生成${describeFeatureOutput(feature)}，教师只需要做审校、取舍和本地化调整。`;
}

function buildOutcomeSummary(item, topic) {
  const stageBenefits = {
    课前准备阶段: `让“${topic}”这次课的目标、内容和学生基础先对齐，再进入备课细化。`,
    课中实施阶段: `让“${topic}”这次课的课堂流程、提问互动和资源准备更完整，不再临场拼接。`,
    课后评价与反馈阶段: `让“${topic}”这次课的评价、反馈和题目设计真正回到课程目标本身。`,
    教师发展与课程建设阶段: `让“${topic}”这次课的经验被沉淀为后续可复用、可共享、可迭代的课程资产。`,
  };
  return stageBenefits[item.stage] ?? `让“${topic}”这次课更容易落成可执行的教学结果。`;
}

function buildFeatureOverview(feature, item, topic) {
  if (feature.includes("目标")) {
    return `把培养方案、章节要求和“${topic}”这次课的内容边界对齐，自动拆出学生这节课应该知道什么、会做什么、能完成什么。`;
  }
  if (feature.includes("重难点") || feature.includes("逻辑图") || feature.includes("模板")) {
    return `把“${item.title}”里的内容重新排序，帮教师快速判断先讲什么、重点讲什么、哪些内容适合压缩或后置。`;
  }
  if (feature.includes("案例") || feature.includes("场景") || feature.includes("映射")) {
    return `把抽象概念翻译成“${topic}”可直接使用的教学场景，让教师不必自己从零找案例、搭情境、写导入。`;
  }
  if (feature.includes("学情") || feature.includes("画像") || feature.includes("诊断")) {
    return `先识别学生对“${topic}”的已有基础，再决定讲授深度、练习难度和互动方式，避免讲得太浅或太深。`;
  }
  if (feature.includes("流程") || feature.includes("提问") || feature.includes("互动") || feature.includes("节奏")) {
    return `把课堂中的教师动作拆清楚，包括什么时候导入、什么时候发问、什么时候组织讨论、什么时候收束总结。`;
  }
  if (feature.includes("PPT") || feature.includes("教案") || feature.includes("讲稿")) {
    return `把“${topic}”从一个想法快速变成可展示、可讲授、可落笔的课件与教案素材。`;
  }
  if (feature.includes("资源") || feature.includes("摘要") || feature.includes("前沿") || feature.includes("文献")) {
    return `帮教师围绕“${topic}”快速找到能用、可信、适合课堂转译的教学资源，而不是自己四处搜集再二次加工。`;
  }
  if (feature.includes("实践") || feature.includes("任务书") || feature.includes("角色扮演") || feature.includes("Rubric")) {
    return `把理论内容转成学生真的要做的任务，明确练什么、怎么做、最后按什么标准评价。`;
  }
  if (feature.includes("评价") || feature.includes("反馈") || feature.includes("题库") || feature.includes("错因")) {
    return `把“${topic}”从讲完就结束，变成能被检验、被反馈、被持续修正的一整套评价闭环。`;
  }
  if (feature.includes("复盘") || feature.includes("督导") || feature.includes("共享") || feature.includes("版本")) {
    return `把一次授课中的经验、问题和优秀做法沉淀成后续可复用、可比较、可共享的课程资产。`;
  }
  if (feature.includes("课堂管理") || feature.includes("激励") || feature.includes("规则")) {
    return `把课堂组织和学生参与这类容易靠经验判断的事情，转成一套可提前设计的管理动作。`;
  }
  return `围绕“${item.title}”，把“${feature}”这个动作拆成教师可以直接使用的教学支持步骤。`;
}

function buildFeatureValue(feature, item, topic) {
  if (feature.includes("目标")) {
    return `最直接的价值是先为《${topic}》立住教学边界，后面的案例、PPT、作业和评价都能围绕同一组目标展开，不会越讲越散。`;
  }
  if (feature.includes("案例") || feature.includes("场景") || feature.includes("映射")) {
    return `它会让学生更快进入“${topic}”的真实应用场景，减少只记概念、不知道怎么用的情况。`;
  }
  if (feature.includes("学情") || feature.includes("画像") || feature.includes("诊断")) {
    return `它能让这节课的讲法跟学生基础匹配起来，避免教师准备得很充分，但学生根本接不住。`;
  }
  if (feature.includes("流程") || feature.includes("提问") || feature.includes("互动") || feature.includes("节奏")) {
    return `它会直接提升这节课的可执行性，让课堂不只是“内容准备好了”，而是真能按节奏和互动设计跑起来。`;
  }
  if (feature.includes("PPT") || feature.includes("教案") || feature.includes("讲稿")) {
    return `它能把教师的大量机械整理时间省出来，把精力放回教学判断和课堂设计本身。`;
  }
  if (feature.includes("评价") || feature.includes("反馈") || feature.includes("题库") || feature.includes("Rubric")) {
    return `它会让教师更容易判断学生究竟有没有真正掌握“${topic}”，而不是只靠感觉。`;
  }
  if (feature.includes("复盘") || feature.includes("督导") || feature.includes("共享") || feature.includes("版本")) {
    return `它让一次课不只服务于当下，而会继续反哺下一轮授课、课程组协作和课程建设成果沉淀。`;
  }
  return `它的核心价值是把“${feature}”从一个抽象功能点，变成这节课里真正能减轻教师负担、提升教学质量的具体动作。`;
}

function buildScenarioOutputs(item, feature, topic) {
  const examples = {
    1: [
      `生成《${topic}》本次课的三级目标：课程目标、章节目标、本次课目标各一版。`,
      `输出知识目标、能力目标、价值目标三列对齐表，方便直接写入教案。`,
      `给出“必讲 / 可选 / 延伸”边界，避免一节课把所有管理工具都塞满。`,
      `把“${feature}”整理成可直接展示给课程组的目标卡片。`,
    ],
    2: [
      `给出《${topic}》15 / 45 / 90 分钟三种课时结构，明确每一段讲什么。`,
      `列出 SWOT 四个维度里必须先讲、可以后置和适合案例带出的内容。`,
      `输出“概念解释 - 案例拆解 - 学生练习 - 总结回收”的推荐顺序。`,
      `生成易混概念对比卡，例如 SWOT 与 PEST、五力分析的边界区分。`,
    ],
    3: [
      `把《${topic}》映射到连锁药店经营、医院药学服务、医药企业渠道策略三个真实场景。`,
      `生成一个可直接开场的案例导入脚本，例如“某连锁药店门店扩张前的 SWOT 诊断”。`,
      `列出适合课堂讨论的场景问题：优势来自哪里、威胁如何量化、策略如何排序。`,
      `把行业新闻改写成可上课使用的管理案例，方便学生快速进入情境。`,
    ],
    4: [
      `为《${topic}》自动生成课前诊断问卷，判断学生是否已理解优势、劣势、机会、威胁的基本含义。`,
      `输出班级知识基线画像，区分“会概念复述”和“会分析应用”的学生比例。`,
      `给出本科低年级班和高年级班两套内容深度建议。`,
      `生成差异化教学提醒，例如哪些问题适合全班回答、哪些适合小组讨论。`,
    ],
    5: [
      `输出《${topic}》完整课堂流程：导入、讲授、分组分析、汇报、点评、总结。`,
      `给出 2 个课堂互动节点，例如“先判断案例中的内外部因素”与“再写策略组合”。`,
      `生成小组讨论任务单和教师总结话术，减少临场组织压力。`,
      `同步给出板书建议，让 SWOT 四象限和策略结论在黑板上有清晰结构。`,
    ],
    6: [
      `生成《${topic}》PPT 首页到结尾页的提纲，包括案例页、方法页和练习页。`,
      `输出一份可直接改写的教案初稿，写明每段教学目标、教师动作和学生活动。`,
      `提供课堂讲授提示词，例如如何解释“机会”和“优势”的区别。`,
      `把教案、PPT 与课后作业说明统一口径，避免材料之间互相打架。`,
    ],
    7: [
      `推荐与《${topic}》相关的行业报告、课程案例、政策文件和公开数据来源。`,
      `自动摘要一份资源卡片，例如“医药零售行业竞争格局变化”可以如何用于 SWOT 教学。`,
      `给出适合放进 PPT 的图表与引用位置，减少手动搜集时间。`,
      `把选中的资源按“课堂导入 / 讲授支撑 / 练习延伸”自动归档。`,
    ],
    8: [
      `生成《${topic}》的分层提问库：概念辨识题、案例判断题、策略决策题。`,
      `给出每个问题的追问脚本，例如学生只会复述时教师如何继续追问。`,
      `预测学生常见误答，例如把“机会”误写成企业内部优势，并给出纠偏提示。`,
      `附带课堂投票题，方便快速判断学生是否真的会用 SWOT。`,
    ],
    9: [
      `输出《${topic}》90 分钟课堂的时长分配表，标出导入、讲解、分组、汇报各自占比。`,
      `给出超时预警点，例如案例讨论超 12 分钟时该如何收束。`,
      `列出可压缩环节和不可压缩环节，帮助教师保住核心练习。`,
      `生成一张教师提纲卡，课上只看这张卡也能把节奏稳住。`,
    ],
    10: [
      `生成《${topic}》实践教学任务书，例如“为某药店门店制定 SWOT 分析与改进策略”。`,
      `提供角色扮演脚本，区分店长、运营经理、采购负责人三种视角。`,
      `给出分组成果提交模板，要求学生提交 SWOT 矩阵与策略优先级。`,
      `输出实践成果评价 Rubric，便于课堂展示后即时评分。`,
    ],
    11: [
      `把《${topic}》拆成可评价的过程性任务，例如随堂判断、小组矩阵、策略汇报。`,
      `生成对应 Rubric，区分概念准确度、分析完整性、策略可执行性三项标准。`,
      `输出平时分构成建议，明确这次课的课堂表现如何进入总评。`,
      `自动生成教师记录表，方便课后回看学生在哪一步最容易失分。`,
    ],
    12: [
      `对《${topic}》案例作业生成初批意见，指出学生矩阵分类错误和论证不足的位置。`,
      `把常见错误归类为“内部外部因素混淆”“策略建议与分析脱节”等类型。`,
      `为每位学生生成一段可发送的个体反馈建议。`,
      `汇总班级共性问题，方便下一次课专门补讲。`,
    ],
    13: [
      `在《${topic}》中自动识别可融入的价值议题，例如患者利益、资源公平与职业责任。`,
      `给出自然的表达句式，让思政内容跟案例分析连在一起，而不是硬插。`,
      `生成一个“为什么某些策略虽然有效但不一定合规”的课堂讨论点。`,
      `把价值议题卡片整理成课堂结束时的总结材料。`,
    ],
    14: [
      `围绕《${topic}》自动生成选择题、简答题、案例分析题三种题型。`,
      `给出试卷蓝图，确保概念识别、场景判断和策略设计都有覆盖。`,
      `校验题目难度分布，避免整张试卷只考概念复述。`,
      `生成一套更贴近药学管理场景的命题版本，便于平行替换。`,
    ],
    15: [
      `追踪与《${topic}》相关的行业动态，例如医药零售数字化、门店经营转型与竞争格局变化。`,
      `自动摘出适合挂接到课堂里的前沿案例，告诉教师放在导入还是总结更合适。`,
      `把热点事件转成教学素材卡，标出与 SWOT 哪个维度相关。`,
      `生成章节提醒：哪些前沿材料值得在下轮课更新进去。`,
    ],
    16: [
      `课后生成《${topic}》复盘报告，指出哪一段学生最投入、哪一段理解最弱。`,
      `汇总学生反馈与课堂表现数据，自动生成“保留 / 调整 / 删减”建议。`,
      `列出下一轮再讲《${topic}》时优先修改的 3 个点。`,
      `把复盘结论存成可追踪日志，后续可以直接对比不同轮次。`,
    ],
    17: [
      `按照《${topic}》示范课场景生成督导预评分表，提前看到可能的扣分点。`,
      `给出听课专家更容易关注的亮点，例如案例切入、互动设计、评价闭环。`,
      `生成一份 10 分钟说课提纲，帮助教师讲清这一节为什么这样设计。`,
      `列出需要提前准备的材料清单，例如教案、PPT、任务单和评价表。`,
    ],
    18: [
      `把《${topic}》相关教案、PPT、案例和作业沉淀为课程组共享条目。`,
      `生成统一口径说明，避免不同老师讲 SWOT 时重点完全不一样。`,
      `列出哪些案例适合新教师复用，哪些案例适合课程组扩充。`,
      `输出一次协作备课的分工建议，方便团队共同完善这节课。`,
    ],
    19: [
      `把《${topic}》这一轮的目标卡、PPT、作业、Rubric 和复盘结果自动挂成一个版本。`,
      `生成“本轮较上一轮”的变化摘要，例如案例更新、互动增加、评价标准调整。`,
      `推荐哪些优质提问和学生案例值得作为长期资产保留。`,
      `形成课程建设成果记录，后续可直接用于申报或课程汇报。`,
    ],
    20: [
      `为《${topic}》设计课堂参与机制，例如小组积分、汇报顺序和展示奖励。`,
      `输出适合大班使用的课堂规则模板，减少讨论跑题和低参与。`,
      `提供课堂冷场时的应急脚本，例如如何把学生重新拉回 SWOT 讨论。`,
      `把激励设计和课堂任务绑定，确保参与行为真的服务于学习目标。`,
    ],
  };

  return examples[item.id] ?? [`围绕“${topic}”生成与“${feature}”对应的教学草案与辅助材料。`];
}

function buildLessonTimeline(item, feature, topic) {
  const stagePlans = {
    课前准备阶段: [
      ["课前 48h", "读取输入", `先读取“${topic}”的课程目标、教材章节和已有材料，把“${feature}”所需的输入拉齐。`],
      ["课前 24h", "生成初稿", `围绕“${feature}”输出第一版教学草案，先给出目标边界、内容重点或案例映射。`],
      ["课前 12h", "教师确认", `教师确认取舍，保留真正要在《${topic}》这次课里落地的内容，删掉冗余信息。`],
      ["上课前", "形成可用版本", `把确认后的结果整理进教案、PPT 或任务单，确保上课前已经是一份可直接拿来用的版本。`],
    ],
    课中实施阶段: [
      ["0-10", "导入动作", `用“${feature}”对应的导入、提问或资源把学生带进“${topic}”的课堂情境。`],
      ["10-35", "核心推进", `让 Agent 生成的流程、讲授顺序或课堂脚本支撑教师推进核心内容。`],
      ["35-65", "互动执行", `在讨论、练习或角色任务里使用“${feature}”生成的具体材料，不让互动停留在口头层面。`],
      ["65-90", "收束回收", `根据这一步动作的目标回收课堂结果，把本次课真正落到学生产出和教师判断上。`],
    ],
    课后评价与反馈阶段: [
      ["课后当日", "收集结果", `整理“${topic}”这次课的作业、练习或课堂表现，为“${feature}”提供评价输入。`],
      ["24h 内", "生成反馈", `让 Agent 输出与“${feature}”对应的反馈、Rubric 或错因归类建议。`],
      ["下次课前", "确认补救点", `教师根据反馈确认哪些内容需要在下节课补讲、追问或再次练习。`],
      ["单元结束", "沉淀评价证据", `把这一步形成的评价证据保留下来，支撑之后的组卷、复盘和课程迭代。`],
    ],
    教师发展与课程建设阶段: [
      ["课后汇总", "拉取记录", `把“${topic}”这次课中的教案、课堂表现和学生反馈汇到同一处，作为“${feature}”的分析底座。`],
      ["周度复盘", "输出建议", `围绕“${feature}”生成复盘、督导准备或课程资产沉淀建议。`],
      ["学期中", "对比迭代", `把本轮结果和前一轮版本做对比，看这一步动作是否真的提升了教学质量。`],
      ["下一轮", "复用升级", `把成熟做法纳入课程组知识库，下次再讲“${topic}”时直接复用或升级。`],
    ],
  };

  return stagePlans[item.stage] ?? stagePlans.课前准备阶段;
}

function buildActionChecklist(item, feature, topic) {
  return [
    `先把《${topic}》相关输入交给 Agent：课程主题、章节材料、已有 PPT 或作业要求都可以成为“${feature}”的输入。`,
    `再让 Agent 围绕“${feature}”输出第一版结果，优先看它是否真正服务于“${selectedTitleLabel(item)}”这一步。`,
    `最后由教师做学科判断和课堂化处理，把自动结果改成适合本班学生、适合这次课时长的版本。`,
  ];
}

function selectedTitleLabel(item) {
  return item.title;
}

function buildActionDeliverables(item, feature, topic) {
  return buildScenarioOutputs(item, feature, topic);
}

function buildActionFinalOutputs(item, feature) {
  const stageMeta = stageBriefs[item.stage];
  const outputs = stageMeta?.outputs ?? [];
  return outputs.map((output) => `围绕“${feature}”最终沉淀为：${output}`);
}

function fileKey(file) {
  return [file.name, file.size, file.lastModified].join("__");
}

function mergeWorkflowFiles(files) {
  const merged = new Map(state.workflowIntake.files.map((file) => [fileKey(file), file]));
  files.forEach((file) => merged.set(fileKey(file), file));
  state.workflowIntake.files = Array.from(merged.values());
}

function formatFileSize(size) {
  if (!Number.isFinite(size) || size <= 0) return "0 KB";
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function renderWorkflowIntake() {
  const list = $("#workflowFileList");
  const outputCopy = $("#workflowOutputCopy");
  const outputTags = $("#workflowOutputTags");
  if (!list || !outputCopy || !outputTags) return;

  if (!state.workflowIntake.files.length) {
    list.innerHTML = `<span class="workflow-file-empty">尚未上传文件</span>`;
  } else {
    list.innerHTML = state.workflowIntake.files
      .map(
        (file, index) => `
          <div class="workflow-file-chip">
            <div>
              <strong>${escapeHtml(file.name)}</strong>
              <small>${formatFileSize(file.size)}</small>
            </div>
            <button class="workflow-file-remove" type="button" data-file-index="${index}" aria-label="移除 ${escapeHtml(file.name)}">移除</button>
          </div>
        `,
      )
      .join("");
  }

  const textCount = state.workflowIntake.text.trim().length;
  const fileCount = state.workflowIntake.files.length;
  if (!textCount && !fileCount) {
    outputCopy.textContent =
      "键入课程需求或上传文件后，系统会把文本线索、课件附件与平台上下文整理成统一输入，用于生成后续教学支持结果。";
    outputTags.innerHTML = ["文本输入", "文件上传", "平台上下文"]
      .map((tag) => `<span>${tag}</span>`)
      .join("");
  } else {
    const summary = [];
    if (textCount) summary.push(`${textCount} 字文本`);
    if (fileCount) summary.push(`${fileCount} 个文件`);
    outputCopy.textContent = `已接收 ${summary.join(" · ")}，可继续用于生成教案、课堂流程、评价任务与课程资产沉淀结果。`;
    const fileTags = Array.from(
      new Set(
        state.workflowIntake.files
          .map((file) => file.name.split(".").pop())
          .filter(Boolean)
          .map((ext) => ext.toUpperCase()),
      ),
    ).slice(0, 3);
    const tags = [...(textCount ? ["文本线索"] : []), ...fileTags, "课程平台上下文"];
    outputTags.innerHTML = tags
      .map((tag) => `<span>${tag}</span>`)
      .join("");
  }

  list.querySelectorAll(".workflow-file-remove").forEach((button) => {
    button.addEventListener("click", () => {
      state.workflowIntake.files.splice(Number(button.dataset.fileIndex), 1);
      renderWorkflowIntake();
    });
  });
}

function ensureSelectedId(items = filteredPains()) {
  if (!items.length) {
    state.selectedId = pains[0]?.id ?? 0;
    return;
  }
  if (!items.some((item) => item.id === state.selectedId)) {
    state.selectedId = items[0].id;
  }
}

function filteredPains() {
  const query = state.query.trim().toLowerCase();
  const tokens = query.split(/\s+/).filter(Boolean);
  const score = (item) => {
    if (!query) return 1;
    const fields = [item.stage, item.title, item.pain, item.manifestation, item.solution, item.features];
    const haystack = fields.join(" ").toLowerCase();
    let value = haystack.includes(query) ? 6 : 0;
    tokens.forEach((token) => {
      if (item.title.toLowerCase().includes(token)) value += 3;
      if (item.features.toLowerCase().includes(token)) value += 2;
      if (haystack.includes(token)) value += 1;
    });
    return value;
  };

  return pains
    .map((item) => ({ item, score: score(item) }))
    .filter(({ item, score: itemScore }) => {
      const stageMatch = state.stage === "全部" || item.stage === state.stage;
      return stageMatch && itemScore > 0;
    })
    .sort((a, b) => b.score - a.score || a.item.id - b.item.id)
    .map(({ item }) => item);
}

function renderWorkflow() {
  const activeStage = state.workflowStage;
  const activeMeta = stageBriefs[activeStage];
  const workflowShell = $("#workflowShell");

  workflowShell.style.setProperty("--workflow-accent", activeMeta.accent);

  $("#workflowRail").innerHTML = Object.entries(stageBriefs)
    .map(([stage, meta]) => {
      const items = stageItems(stage);
      return `
        <article
          class="workflow-lane ${stage === activeStage ? "active" : ""}"
          data-stage="${stage}"
          style="--lane-accent: ${meta.accent};"
        >
          <button
            class="workflow-lane-head"
            type="button"
            aria-pressed="${stage === activeStage}"
            data-stage="${stage}"
          >
            <span class="workflow-node-step">${meta.sequence}</span>
            <strong>${stage}</strong>
          </button>
          <div class="workflow-lane-list">
            ${items
              .map((item, index) => {
                return `
                  <button
                    class="workflow-lane-item ${item.id === state.selectedId ? "active" : ""}"
                    type="button"
                    data-stage="${stage}"
                    data-id="${item.id}"
                  >
                    <span class="workflow-lane-index">${String(index + 1).padStart(2, "0")}</span>
                    <span class="workflow-lane-dot" aria-hidden="true"></span>
                    <span class="workflow-lane-copy">${item.title}</span>
                  </button>
                `;
              })
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll(".workflow-lane-head").forEach((button) => {
    button.addEventListener("click", () => {
      state.workflowStage = button.dataset.stage;
      state.stage = button.dataset.stage;
      state.query = "";
      $("#globalSearch").value = "";
      state.selectedId = firstStageItem(button.dataset.stage).id;
      render();
      $("#painpoints").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll(".workflow-lane-item").forEach((button) => {
    button.addEventListener("click", () => {
      const item = pains.find((pain) => pain.id === Number(button.dataset.id));
      if (!item) return;
      state.workflowStage = item.stage;
      state.stage = item.stage;
      state.query = "";
      $("#globalSearch").value = "";
      state.selectedId = item.id;
      render();
      $("#painpoints").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderStageTabs() {
  const stageTabs = $("#stageTabs");
  stageTabs.innerHTML = stageOrder
    .map((stage) => {
      const count = stage === "全部" ? pains.length : pains.filter((item) => item.stage === stage).length;
      return `<button class="stage-tab" role="tab" type="button" aria-selected="${stage === state.stage}" data-stage="${stage}">${stage} ${count}</button>`;
    })
    .join("");

  stageTabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.stage = button.dataset.stage;
      if (button.dataset.stage !== "全部") {
        state.workflowStage = button.dataset.stage;
      }
      ensureSelectedId();
      render();
    });
  });
}

function renderPainList() {
  const list = $("#painList");
  const items = filteredPains();
  ensureSelectedId(items);
  $("#resultNote").textContent = `${items.length} 个匹配项`;
  list.innerHTML = items
    .map((item) => {
      const features = splitFeatures(item.features);
      return `
        <article class="pain-card ${item.id === state.selectedId ? "active" : ""}" data-id="${item.id}" tabindex="0">
          <small>${item.stage}</small>
          <h3>${item.id}. ${item.title}</h3>
          <span class="pain-card-kicker">可以帮助做什么</span>
          <p>${buildHelpSummary(item)}</p>
          <div class="chip-row">
            ${features
              .map(
                (feature) => `
                  <button
                    class="action-chip ${item.id === state.selectedId && feature === state.selectedFeature ? "active" : ""}"
                    type="button"
                    data-id="${item.id}"
                    data-feature="${feature}"
                  >
                    ${feature}
                  </button>
                `,
              )
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");

  list.querySelectorAll(".pain-card").forEach((card) => {
    const select = () => {
      const selected = pains.find((item) => item.id === Number(card.dataset.id));
      state.selectedId = Number(card.dataset.id);
      if (selected) state.workflowStage = selected.stage;
      render();
    };
    card.addEventListener("click", select);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select();
      }
    });
  });

  list.querySelectorAll(".action-chip").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const selected = pains.find((item) => item.id === Number(button.dataset.id));
      if (!selected) return;
      state.selectedId = selected.id;
      state.selectedFeature = button.dataset.feature;
      state.workflowStage = selected.stage;
      render();
    });
  });
}

function renderDetail() {
  const selected = filteredPains().find((item) => item.id === state.selectedId) ?? pains.find((item) => item.id === state.selectedId) ?? pains[0];
  const activeFeature = ensureSelectedFeature(selected);
  const topic = currentCourseTopic();

  $("#detailStage").textContent = selected.stage;
  $("#detailTitle").textContent = activeFeature;
  $("#detailParent").textContent = `所属环节：${selected.title}`;
  $("#detailPain").textContent = `这是“${selected.title}”里的一个具体动作。围绕“${topic}”，右侧内容会解释这个动作本身在做什么、会产出什么，以及为什么值得在这节课里用。`;
  $("#detailManifestation").textContent = buildFeatureOverview(activeFeature, selected, topic);
  $("#detailImpact").textContent = buildFeatureValue(activeFeature, selected, topic);
  $("#detailSolution").textContent = buildActionSummary(selected, activeFeature, topic);
  $("#detailFeatures").innerHTML = splitFeatures(selected.features)
    .map(
      (feature) => `
        <button
          class="feature-chip ${feature === activeFeature ? "active" : ""}"
          type="button"
          data-feature="${feature}"
        >
          ${feature}
        </button>
      `,
    )
    .join("");
  $("#detailScenarioTitle").textContent = `${activeFeature} 示例：${topic}`;
  $("#detailScenarioContext").textContent = `当前聚焦动作是“${activeFeature}”，所属环节为“${selected.title}”。${currentCourseHint(topic)}`;
  $("#detailScenarioList").innerHTML = buildScenarioOutputs(selected, activeFeature, topic)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  $("#detailFeatures").querySelectorAll(".feature-chip").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedFeature = button.dataset.feature;
      renderPainList();
      renderDetail();
    });
  });
  renderTimeline(selected, activeFeature, topic);
  renderAnswer(selected, activeFeature, topic);
}

function renderTimeline(selected = pains[0], activeFeature = ensureSelectedFeature(selected), topic = currentCourseTopic()) {
  const steps = [
    ["输入", "课程上下文", `读取“${topic}”、班级学情、教师痛点和当前选择的能力动作，先确定本节课真正要解决的问题。`],
    ...buildLessonTimeline(selected, activeFeature, topic),
    [
      "泛雅",
      "发布与留痕",
      "把确认后的课堂活动、讨论题、作业草稿、测验题和 Rubric 转成可复制到泛雅的发布稿。",
    ],
  ];
  $("#lessonTopic").textContent = `${topic}`;
  $("#lessonMode").textContent = activeFeature;
  $("#timeline").innerHTML = steps
    .map(
      ([stage, title, body], index) => `
        <div class="timeline-item">
          <div class="timeline-marker" aria-hidden="true">
            <span>${String(index + 1).padStart(2, "0")}</span>
          </div>
          <div class="timeline-node">
            <div class="timeline-node-head">
              <span class="timeline-time">${escapeHtml(stage)}</span>
              <span class="timeline-state">${index === steps.length - 1 ? "平台出口" : "本次课节点"}</span>
            </div>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(body)}</p>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderAnswer(selected = pains[0], activeFeature = ensureSelectedFeature(selected), topic = currentCourseTopic()) {
  const checklist = buildActionChecklist(selected, activeFeature, topic);
  const deliverables = buildActionDeliverables(selected, activeFeature, topic);
  const finalOutputs = buildActionFinalOutputs(selected, activeFeature);
  const connectorNote = stageBriefs[selected.stage]?.connector ?? "";
  const platformActions = [
    `讨论发布：围绕“${topic}”生成一个开放问题，要求学生说明判断依据而不是只给结论。`,
    `作业草稿：把“${activeFeature}”转成可提交任务，保留目标、步骤、评分方式和截止提示。`,
    `测验与 Rubric：生成 1 组概念边界题，并用 Rubric 记录证据完整性、表达清晰度和应用能力。`,
  ];
  $("#answerPanel").innerHTML = `
    <h3>${activeFeature} 的本次课建议</h3>
    <p>当前课程：${topic} · 所属环节：${selected.title}</p>
    <p>${buildFeatureOverview(activeFeature, selected, topic)}</p>
    <div class="answer-stepper" aria-label="本次课运行步骤">
      <span><strong>诊断</strong><small>识别本节课真正卡住的教学问题</small></span>
      <span><strong>设计</strong><small>生成课堂活动、材料和教师确认点</small></span>
      <span><strong>落地</strong><small>转成泛雅讨论、作业、测验和资源说明</small></span>
    </div>
    <div class="answer-block">
      <strong>执行建议</strong>
      <ul>
        ${checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
    <div class="answer-block">
      <strong>本次课完整输出</strong>
      <ul>
        ${deliverables.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
    <div class="answer-block">
      <strong>最终沉淀内容</strong>
      <ul>
        ${finalOutputs.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
      <p class="answer-note">${escapeHtml(connectorNote)}</p>
    </div>
    <div class="answer-platform-block">
      <strong>转为泛雅动作</strong>
      <ul>
        ${platformActions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
    <div class="answer-agent-actions">
      <button class="answer-agent-button" id="sendAgentPrompt" type="button">生成泛雅发布稿</button>
      <button class="answer-copy-button" id="copyAnswerPrompt" type="button">复制发布稿</button>
    </div>
  `;

  $("#sendAgentPrompt").addEventListener("click", (event) => {
    $("#fanya").scrollIntoView({ behavior: "smooth", block: "start" });
    prepareFanyaDraft(event.currentTarget).catch(() => updateButtonBriefly(event.currentTarget, "生成失败"));
  });
  $("#copyAnswerPrompt").addEventListener("click", (event) => {
    copyCurrentAgentPrompt(event.currentTarget).catch(() => updateButtonBriefly(event.currentTarget, "复制失败"));
  });
}

function renderMetrics() {
  const featureCount = new Set(pains.flatMap((item) => splitFeatures(item.features))).size;
  $("#metricPainCount").textContent = String(pains.length);
  $("#metricFeatureCount").textContent = String(featureCount);
}

function renderConnection() {
  const dot = $("#consoleDot");
  const status = $("#consoleStatus");
  const connector = $(".connector-state");
  const isConnected = state.fanya.connected;
  const isError = ["not_configured", "error", "local_file"].includes(state.fanya.state);
  dot.classList.toggle("connected", isConnected);
  dot.classList.toggle("error", isError);
  connector.classList.toggle("connected", isConnected);
  status.textContent = state.fanya.message;
  $("#connectText").textContent = isConnected ? "重新检查连接" : "启用课程连接";

  const hint = $("#connectHint");
  if (state.fanya.state === "local_file") {
    hint.textContent = "当前为预览模式。部署到正式环境后，可启用课程系统连接与教学数据同步能力。";
  } else if (state.fanya.state === "not_configured") {
    hint.textContent = "课程系统连接待配置。完成平台授权后，即可同步课程、班级、作业和学习数据。";
  } else if (state.fanya.state === "error") {
    hint.textContent = `课程系统连接暂时不可用：${state.fanya.message}`;
  } else if (isConnected) {
    hint.textContent = "课程系统连接已启用，可同步课程、作业、题库与学习数据。";
  } else {
    hint.textContent = "连接课程系统后，可同步课程、班级、作业、题库与学习数据，并将教学支持能力嵌入日常授课流程。";
  }
}

function renderLaunchContext() {
  const hasContext = Boolean(state.launch.courseId || state.launch.clazzId || state.launch.cpi);
  const panel = $("#launchContext");
  panel.hidden = !hasContext;

  if (hasContext) {
    $("#launchCourse").textContent = `courseId: ${state.launch.courseId || "未提供"}`;
    $("#launchClazz").textContent = `clazzId: ${state.launch.clazzId || "未提供"} · cpi: ${state.launch.cpi || "未提供"}`;
  }

  const origin = window.location.protocol === "file:" ? "https://your-domain" : window.location.origin;
  const launchUrl = new URL("/launch", origin);
  launchUrl.searchParams.set("courseId", state.launch.courseId || "251769346");
  launchUrl.searchParams.set("clazzId", state.launch.clazzId || "131807646");
  launchUrl.searchParams.set("cpi", state.launch.cpi || "18085305");
  launchUrl.searchParams.set("source", "fanya");
  $("#launchUrl").textContent = launchUrl.toString();
}

function renderCourseAgent() {
  $("#courseAgentName").textContent = fanyaEntry.name;
  const statusByState = {
    ready: `${fanyaEntry.platform} · 已就绪`,
    error: `${fanyaEntry.platform} · 复制异常`,
  };
  $("#courseAgentStatus").textContent = statusByState[state.courseAgent.state] || `${fanyaEntry.platform} · 已就绪`;
  $("#courseAgentHint").textContent = state.launch.courseId
    ? "本站已通过泛雅参数打开。生成发布稿时会自动带上 courseId、clazzId、cpi 和当前教学动作。"
    : "先在左侧生成本次课建议，再把建议转成可粘贴到泛雅的讨论、作业或资源说明。";

  const input = $("#courseAgentInput");
  if (input && !input.value.trim()) {
    input.placeholder = `点击“生成发布稿”，基于“${currentCourseTopic()}”生成可粘贴到泛雅的任务说明。`;
  }

  if (state.courseAgent.reply) {
    renderAgentReply("answer", state.courseAgent.reply);
  } else if (state.courseAgent.state === "error") {
    renderAgentReply("error", state.courseAgent.message);
  } else {
    renderAgentReply(
      "muted",
      "当前站点已按泛雅第三方链接方式接入。生成发布稿后可先复制到泛雅；真实写入作业、讨论和题库需要学校或超星开放接口授权。",
    );
  }
}

async function callApi(path, options = {}) {
  if (window.location.protocol === "file:") {
    return {
      ok: false,
      state: "local_file",
      connected: false,
      missing: [],
      message: "当前为预览模式",
    };
  }

  const response = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return {
      ok: false,
      state: "not_configured",
      connected: false,
      missing: ["BACKEND_API"],
      message: "当前网址已可作为第三方链接打开；如需站内 API 对话或课程数据同步，还需要部署后端接口。",
    };
  }

  const body = await response.json();
  if (!response.ok && !body.message) body.message = `HTTP ${response.status}`;
  return body;
}

async function refreshFanyaStatus() {
  try {
    const body = await callApi("/api/fanya/status");
    state.fanya = {
      state: body.state,
      connected: Boolean(body.connected),
      missing: body.missing || [],
      message:
        body.state === "not_configured"
          ? "课程系统连接待配置"
          : body.message || "课程系统连接已加载",
    };
  } catch (error) {
    state.fanya = {
      state: "error",
      connected: false,
      missing: [],
      message: error.message,
    };
  }
  renderConnection();
}

async function connectFanya() {
  const button = $("#connectMain");
  button.disabled = true;
  $("#connectText").textContent = "检测中";
  state.fanya = {
    state: "checking",
    connected: false,
    missing: [],
    message: "正在检查课程系统连接",
  };
  renderConnection();

  try {
    const body = await callApi("/api/fanya/connect", { method: "POST", body: "{}" });
    state.fanya = {
      state: body.state,
      connected: Boolean(body.connected),
      missing: body.missing || [],
      message:
        body.state === "not_configured"
          ? "课程系统连接待配置"
          : body.message || (body.connected ? "课程系统连接已启用" : "课程系统连接未启用"),
    };
  } catch (error) {
    state.fanya = {
      state: "error",
      connected: false,
      missing: [],
      message: error.message,
    };
  } finally {
    button.disabled = false;
    renderConnection();
  }
}

function render() {
  ensureSelectedId();
  renderWorkflow();
  renderWorkflowIntake();
  renderStageTabs();
  renderPainList();
  renderDetail();
  renderConnection();
  renderLaunchContext();
  renderCourseAgent();
}

function bindEvents() {
  $("#globalSearch").addEventListener("input", (event) => {
    state.query = event.target.value;
    const first = filteredPains()[0];
    if (first) {
      state.selectedId = first.id;
      if (state.stage === "全部") state.workflowStage = first.stage;
    }
    render();
  });

  document.querySelectorAll(".task-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.target === "fanya") {
        $("#fanya").scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (button.dataset.target === "agent") {
        const query = button.dataset.query;
        $("#workflowInputField").value = query;
        state.workflowIntake.text = query;
        render();
        $("#fanya").scrollIntoView({ behavior: "smooth", block: "start" });
        prepareFanyaDraft(button).catch(() => updateButtonBriefly(button, "生成失败"));
        return;
      }
      const query = button.dataset.query;
      $("#globalSearch").value = query;
      state.query = query;
      const first = filteredPains()[0];
      if (first) {
        state.selectedId = first.id;
      }
      render();
      $("#painpoints").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  $("#generateDemo").addEventListener("click", () => {
    $("#workflow").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#workflowInputField").addEventListener("input", (event) => {
    state.workflowIntake.text = event.target.value;
    renderWorkflowIntake();
    renderDetail();
  });

  $("#workflowFileInput").addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    mergeWorkflowFiles(files);
    event.target.value = "";
    renderWorkflowIntake();
    renderDetail();
  });

  [$("#connectTop"), $("#connectMain")].forEach((button) => {
    button.addEventListener("click", connectFanya);
  });

  $("#openAgentTop").addEventListener("click", () => {
    $("#fanya").scrollIntoView({ behavior: "smooth", block: "start" });
    $("#courseAgentInput").focus();
  });

  $("#askCourseAgent").addEventListener("click", (event) => {
    prepareFanyaDraft(event.currentTarget).catch(() => updateButtonBriefly(event.currentTarget, "生成失败"));
  });

  $("#copyAgentPrompt").addEventListener("click", (event) => {
    copyCurrentAgentPrompt(event.currentTarget).catch(() => updateButtonBriefly(event.currentTarget, "复制失败"));
  });

  $("#themeToggle").addEventListener("click", () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "dark" ? "" : "dark";
  });
}

function bindPageObservers() {
  const sections = Array.from(document.querySelectorAll("main > section"));
  const navLinks = Array.from(document.querySelectorAll('.topnav .nav-link[href^="#"]'));
  const navTargets = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  sections.forEach((section) => section.classList.add("page-section"));

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
  );

  sections.forEach((section) => revealObserver.observe(section));

  if (!navTargets.length) return;

  const visibility = new Map(navTargets.map((section) => [section.id, 0]));
  const updateActiveNav = () => {
    let currentId = "";
    let bestRatio = 0;
    visibility.forEach((ratio, id) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        currentId = id;
      }
    });

    if (!currentId && window.scrollY < navTargets[0].offsetTop) {
      currentId = navTargets[0].id;
    }

    navLinks.forEach((link) => {
      const isActive = currentId && link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("active", isActive);
    });
  };

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      updateActiveNav();
    },
    { threshold: [0.2, 0.35, 0.55, 0.75], rootMargin: "-16% 0px -52% 0px" },
  );

  navTargets.forEach((section) => navObserver.observe(section));
  updateActiveNav();
}

function drawAgentMap() {
  const canvas = $("#agentMap");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const labels = [
    ["目标清楚", 0.25, 0.22, "sage"],
    ["案例真实", 0.73, 0.2, "blue"],
    ["节奏稳定", 0.81, 0.53, "amber"],
    ["互动有效", 0.64, 0.79, "sage"],
    ["评价闭环", 0.36, 0.8, "rose"],
    ["平台留痕", 0.17, 0.55, "blue"],
    ["好课金标准", 0.5, 0.48, "ink"],
  ];
  const colors = {
    sage: getComputedStyle(document.documentElement).getPropertyValue("--sage").trim(),
    blue: getComputedStyle(document.documentElement).getPropertyValue("--blue").trim(),
    amber: getComputedStyle(document.documentElement).getPropertyValue("--amber").trim(),
    rose: getComputedStyle(document.documentElement).getPropertyValue("--rose").trim(),
    ink: getComputedStyle(document.documentElement).getPropertyValue("--ink").trim(),
    muted: getComputedStyle(document.documentElement).getPropertyValue("--muted").trim(),
    line: getComputedStyle(document.documentElement).getPropertyValue("--line").trim(),
    panel: getComputedStyle(document.documentElement).getPropertyValue("--panel").trim(),
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function frame(time) {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    for (let x = 28; x < width; x += 58) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 28; y < height; y += 58) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const points = labels.map(([label, x, y, color]) => ({
      label,
      x: x * width,
      y: y * height,
      color: colors[color],
      core: label === "好课金标准",
    }));
    const core = points.find((point) => point.core);

    points
      .filter((point) => !point.core)
      .forEach((point, index) => {
        const pulse = Math.sin(time / 700 + index) * 0.5 + 0.5;
        ctx.strokeStyle = point.color;
        ctx.globalAlpha = 0.28 + pulse * 0.16;
        ctx.beginPath();
        ctx.moveTo(core.x, core.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

    points.forEach((point, index) => {
      const radius = point.core ? 62 : 41;
      const pulse = Math.sin(time / 840 + index) * 0.5 + 0.5;
      ctx.fillStyle = colors.panel;
      ctx.strokeStyle = point.color;
      ctx.lineWidth = point.core ? 1.8 : 1.3;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius + pulse * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = point.color;
      ctx.font = point.core ? "600 15px sans-serif" : "600 13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(point.label, point.x, point.y);
    });

    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(frame);
}

readLaunchContext();
renderTimeline();
renderMetrics();
bindEvents();
bindPageObservers();
render();
drawAgentMap();
refreshFanyaStatus();
