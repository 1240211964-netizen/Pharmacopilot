# 本次需求

将 `前端核心/practice.html` 与 `前端核心/agent-runtime/action-engine.js` 从“静态 20 环节展示页 + Agent 面板”重构为 PharmacoPilot 多智能体教学实践工作台。

关键要求：
- 保留顶部统一导航栏。
- `main` 只保留工作台 Hero、三栏 Agent 工作台、产物输出、开发与兼容工具四个主区块。
- 初始状态必须为“待启动”，不得硬编码伪运行状态、伪 Agent 日志或 SWOT 默认章节。
- `practice.create_flow` 必须接管三阶段主画布，并渲染当前节点详情、教师介入点、产物输出。
- `rubric.create`、`evidence.flag_gap`、`asset.create_node`、`user.ask`、`system.complete_stage` 分别更新右侧审校面板、Agent 状态和产物区。
- `agent-client.js` 负责启动、SSE 事件解析、Agent 状态同步和最终 `ready_for_review` 状态。
- 旧版泛雅模拟工具保留在默认折叠的“开发与兼容工具”入口中。
