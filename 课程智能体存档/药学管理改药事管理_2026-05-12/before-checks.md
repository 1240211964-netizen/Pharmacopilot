# Before Checks

## active-code occurrences before
./前端核心/app.js:2140:      "转化为药学管理案例与追问提示",
./前端核心/app.js:2694:    <p>当前账号会话保存在本机浏览器，可继续进入药学管理课程教学工作流。</p>
./前端核心/app.js:3503:    rubric: "目标是否具体、可观察、可评价，并能体现药学管理课程特色。",
./前端核心/app.js:4399:      <p>建议继续完善“${escapeHtml(current.title)}”，检查该环节是否同时回应教学目标、学情起点、学习证据和药学管理真实情境。</p>
./前端核心/assets.html:53:            汇总教学实践生成材料、教师上传知识库、泛雅模拟记录和新手教程示例记录，形成可检索、可核验、可复用的药学管理课程资产。
./scripts/build_competition_materials.py:28:    "name": "CoursePilot Agent 药学管理课程智能体",
./scripts/build_competition_materials.py:31:    "specialty": "药学 / 药事管理 / 药学管理",
./scripts/build_competition_materials.py:51:CoursePilot Agent 面向药学管理与药事服务相关课程，聚焦新教师首次授课和课程持续建设中的真实痛点。药学类课程中的管理学内容兼具专业性、政策性和实践性，教师既要讲清管理学概念，又要把概念落到药品经营、医院药学、医保支付、处方流转、慢病管理、患者教育和用药安全等真实场景。新教师常见困难包括：课程目标难以对齐培养方案，教材内容不会取舍，抽象理论难以转化为药学案例，学情预判不足，课堂互动和节奏控制不稳定，过程性评价与作业反馈缺少标准，课后复盘和课程资产沉淀不足。以上问题会导致课堂成为泛管理学讲授，学生知道概念却不知道如何在药学岗位情境中判断、举证和决策。
./scripts/build_competition_materials.py:54:本智能体申报赛道为“课程智能体”，定位为药学管理课程的教学工作台。它不是通用问答工具，而是围绕一门课程、一类教师和一组典型教学任务进行设计：以培养方案、课程大纲、教材章节、班级学情、泛雅课程上下文和教师输入主题为起点，辅助教师完成“课前诊断、课中设计、课后评价、持续改进”的全流程工作。当前应用载体包括网页端原型、本次课运行中心、教学痛点场景库、教学流程图、泛雅第三方入口参数识别和本地后端 Connector。教师可通过浏览器访问系统，也可将部署后的公网 HTTPS 地址作为泛雅第三方链接接入课程。
./scripts/build_competition_materials.py:68:项目已完成新教师痛点清单整理、四阶段教学流程梳理、CoursePilot 网页端原型、本次课运行中心、评审演示路径、泛雅第三方链接接入说明和本地 Connector 开发。以“药学管理中的 SWOT 分析：连锁药店慢病服务决策”为例，教师输入课程主题后，系统可生成课次目标、药学案例导入、课堂提问、Rubric、泛雅发布稿和课后复盘要点。正式参赛前，建议完成公网部署、测试账号配置、1-2 个真实班级或课程组的试运行记录，并补充备课时间变化、学生参与情况、作业质量或教师满意度等量化数据。
./scripts/build_competition_materials.py:71:第一，课程专属性强。系统围绕药学管理课程构建知识与任务，不停留在通用聊天，而是把医学教育场景、课程目标、药学岗位能力和平台执行动作绑定起来。第二，真实问题导向。系统内置二十类新教师痛点，覆盖课前、课中、课后和课程建设全过程，使智能体服务真实教学流程。第三，药学场景深度融合。系统将管理学抽象概念转化为药事服务、医保政策、药品经营和患者安全案例，提升课程的医学专业性和岗位适配度。第四，闭环落地能力突出。系统从目标、内容、互动、评价到复盘形成链路，并通过泛雅入口把 AI 生成内容转化为教学平台中的任务、讨论和作业。第五，安全可控。所有正式发布动作均保留教师确认，敏感配置存放于后端环境变量，评审材料可生成匿名版本，降低数据和身份泄露风险。
./scripts/build_competition_materials.py:74:当前项目已形成可演示、可部署、可迭代的课程智能体原型，沉淀了 20 个教学痛点场景、4 个教学阶段、1 套泛雅接入流程和 1 条 3 分钟评审体验路径。原型验证表明，系统能够把一次药学管理课程从“教师想讲什么”转化为“学生完成什么任务、教师获得什么学习证据、课程平台沉淀什么数据”的结构化方案。对新教师而言，系统降低了备课启动成本，减少材料拼接和口径不一致；对学生而言，药学案例、课堂讨论和 Rubric 让学习任务更清楚；对课程团队而言，系统可沉淀统一标准、共享案例和跨轮次改进记录。后续可推广至药事管理、临床药学服务、医药市场营销、医院药学管理等课程，也可作为医学类课程智能体建设的模板。
./scripts/build_competition_materials.py:82:CoursePilot Agent 药学管理课程智能体面向药学管理与药事服务相关课程，针对新教师首次授课中目标不清、案例转化难、互动评价弱、平台沉淀不足等问题，构建贯穿课前诊断、课中设计、课后评价、持续改进的课程智能体。系统以培养方案、课程大纲、教材章节、班级学情、泛雅课程上下文和教师输入主题为起点，将课程目标拆解为“课程-章节-课次”三级目标，将管理学概念映射到连锁药店慢病服务、医院药房处方审核、医保支付、药品经营与用药安全等药学情境，自动生成教案、PPT 提纲、案例导入脚本、分层提问、Rubric、作业说明和复盘建议。
./scripts/build_competition_materials.py:89:项目已形成可运行原型和完整评审演示路径，沉淀 20 个新教师教学痛点、4 个教学阶段、1 套泛雅接入流程和 1 个本次课运行中心。以“药学管理中的 SWOT 分析：连锁药店慢病服务决策”为例，系统可在一次操作中输出课次目标、药学案例导入、课堂提问、课堂节奏、Rubric、泛雅发布稿和复盘要点，帮助教师从“准备材料”转向“设计学习任务和评价证据”。
./scripts/build_competition_materials.py:97:    ("0:35-1:25", "应用场景说明", "打开 CoursePilot 首页，说明面向药学管理与药事服务课程，服务课前、课中、课后和持续改进闭环。", "突出课程智能体，而非通用问答。"),
./scripts/build_competition_materials.py:98:    ("1:25-2:20", "输入课程主题", "输入“药学管理中的 SWOT 分析：连锁药店慢病服务决策”，展示系统识别药学情境和教学阶段。", "体现课程上下文和药学场景转化。"),
./scripts/build_competition_materials.py:112:        "项目名称：CoursePilot Agent 药学管理课程智能体。",
./scripts/build_competition_materials.py:390:        "视频建议命名为：CoursePilot Agent 药学管理课程智能体.mp4。",
./scripts/build_competition_materials.py:453:        ("学校/医院教务部门意见（盖章）", "该智能体围绕药学管理课程教学真实问题开展设计，具有课程建设价值和推广潜力。建议推荐参赛。\n\n年    月    日"),
./scripts/build_competition_materials.py:507:        "建议演示主题：药学管理中的 SWOT 分析：连锁药店慢病服务决策。",
./scripts/build_competition_materials.py:522:        "本项目是 CoursePilot Agent 药学管理课程智能体，面向药学管理与药事服务相关课程的新教师，"
./scripts/build_competition_materials.py:524:        "“药学管理中的 SWOT 分析：连锁药店慢病服务决策”为例，展示智能体如何把课程主题转化为"
./前端核心/index.html:9:      content="Pharmacopilot 将药学管理课程资料转化为可审校、可复用的教学材料。"
./前端核心/index.html:54:            输入教学目标、上传课程材料、设定课堂约束。Pharmacopilot 会围绕药学管理本科《管理学原理》SWOT 分析课，生成教学导航、课堂任务、评价量规和课后复盘草稿。
./前端核心/index.html:134:                  <p id="homeCoworkPrompt">请基于药学管理本科《管理学原理》课程，设计一节 SWOT 分析课。</p>
./scripts/build_demo_video.py:115:        "title": "从第一次上药学管理课开始",
./scripts/build_demo_video.py:117:        "narration": "本项目是 CoursePilot Agent 药学管理课程智能体，申报课程智能体赛组。它面向药学管理与药事服务相关课程的新教师，解决第一次授课中目标不清、案例转化难、互动评价弱和平台沉淀不足的问题。下面的展示全程使用匿名画面，不出现参赛者姓名、学校和院系信息。",
./scripts/build_demo_video.py:118:        "bullets": ["申报赛道：课程智能体", "应用课程：药学管理 / 药事服务相关课程", "演示主题：连锁药店慢病服务决策中的 SWOT 分析"],
./scripts/build_demo_video.py:132:        "narration": "本次演示以药学管理中的 SWOT 分析为例。教师输入连锁药店慢病服务决策后，智能体会识别药学情境，关联药品经营、患者教育、医保支付和用药安全约束，再把抽象管理学工具转化为学生可以讨论和提交的学习任务。",
./scripts/build_demo_video.py:133:        "bullets": ["课程主题：药学管理中的 SWOT 分析", "药学情境：连锁药店慢病服务、患者教育、医保支付、门店运营", "教学目标：让学生能用证据分析药事服务方案的优势、风险和合规边界"],
./scripts/build_demo_video.py:168:        "narration": "目前项目已经形成可运行原型，沉淀二十个新教师痛点、四个教学阶段、一套泛雅接入流程和一条评审体验路径。它可以帮助新教师降低备课启动难度，让学生获得更清楚的药学情境任务，也让课程团队沉淀统一标准、共享案例和跨轮次复盘记录。后续可推广到药事管理、临床药学服务、医药市场营销和医院药学管理等课程。",
./scripts/build_demo_video.py:178:        ("输入", "药学管理中的 SWOT 分析"),
./scripts/build_demo_video.py:312:    out_mp4 = OUT / "CoursePilot_Agent_药学管理课程智能体_展示视频初稿.mp4"
./后端核心/src/generation.ts:15:  const topic = clean(payload.topic) || "药学管理课程";
./后端核心/src/generation.ts:142:    `你是 Pharmacopilot，面向药学管理与药事服务课程的教学智能体，负责生成${task}。`,
./API版的后端/lib/generation.ts:31:    lessonOverview: "围绕药学管理场景组织一次可执行课堂，兼顾概念理解、案例讨论与形成性评价。",
./API版的后端/lib/generation.ts:35:      chapterObjectives: ["解释核心概念", "将概念迁移到药学管理情境"],
./API版的后端/lib/generation.ts:43:        teacherActions: ["展示药学管理真实情境", "提出驱动问题"],
./API版的后端/lib/generation.ts:76:      homework: "选择一个药学管理情境，写出问题、利益相关者和改进方案。",
./API版的后端/lib/generation.ts:150:    shortSummary: "该教学资产可用于支持药学管理课堂的案例导入、概念讲解和讨论评价。",
./API版的后端/lib/generation.ts:152:    keyConcepts: ["药学管理", "决策分析", "教学评价"],

## node --check 前端核心/app.js
exit=0

## npm run build:static

> pharmacopilot@0.1.0 build:static
> mkdir -p dist/launch dist/flowchart dist/workflow dist/teaching-navigation && cp 前端核心/index.html 前端核心/auth.html 前端核心/teaching-navigation.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/workflow.html 前端核心/app.js 前端核心/styles.css 前端核心/interface-review-improved.html 前端核心/flowchart.html dist/ && cp 前端核心/index.html 前端核心/auth.html 前端核心/teaching-navigation.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/app.js 前端核心/styles.css dist/launch/ && rm -f dist/launch/workflow.html && cp 前端核心/flowchart.html dist/flowchart/index.html && cp 前端核心/workflow.html dist/workflow/index.html && cp 前端核心/teaching-navigation.html dist/teaching-navigation/index.html

exit=0

## npm run build:server

> pharmacopilot@0.1.0 build:server
> tsc -p 后端核心/tsconfig.server.json

exit=0
