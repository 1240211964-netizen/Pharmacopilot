# OpenMAIC Clean-Room Notes

参考仓库：THU-MAIC/OpenMAIC。

本轮只记录架构思想，不复制 OpenMAIC 源码、样式、组件、提示词或具体实现。

## 结构观察

- 首页是生成入口：围绕输入主题/材料、选择生成模式、触发课堂生成，而不是普通宣传页。
- API 按生成阶段拆分：基础生成、课堂生成、媒体/语音/测验等辅助端点分离。
- 核心业务层集中在 `lib`：generation、orchestration、playback、action、export、types 等按职责拆开。
- generation 是两阶段：先生成结构化大纲，再生成可运行场景内容。
- orchestration 负责多角色智能体轮次和状态，不直接耦合到页面视觉组件。
- playback 是课堂运行状态机，让课堂内容从静态材料变成可推进、可暂停、可互动的运行时。
- action engine 把课堂动作抽象为可执行指令。
- scene renderers 按场景类型分发渲染。
- export 是核心产物路径，不是附属下载按钮。

## PharmacoPilot 对照

- 首页改为课程生成控制台：课程任务输入、模式选择、生成管线预览、运行/导出状态。
- 生成管线改为 PharmacoPilot 自有命名：course-outline-generator、teaching-scene-generator、evidence-rule-generator、asset-pack-generator、pipeline-runner。
- 编排角色采用教学语境：教学设计导师、评价证据助理、模拟学生、课程资产整理 agent。
- 实践页指向 20 环节 teaching scene runtime，而非静态卡片集合。
- action engine 采用教学动作：generate_objective、generate_case、generate_question、simulate_student_response、evaluate_task、generate_rubric、collect_evidence、export_asset。
- 场景渲染器采用教学类型：DesignSceneRenderer、PracticeSceneRenderer、EvaluationSceneRenderer、AssetGraphRenderer、ReflectionSceneRenderer。
- 导出产物覆盖：教案、PPT、课堂活动单、rubric、评价证据链、教学反思报告。
