# Change Log

## 修改范围

- 重构 `前端核心/practice.html`
  - 新增 `practice-workbench-hero`、`practice-agent-workbench`、`practice-artifact-output`、`practice-legacy-tools` 四个主区块。
  - 中央画布改为课前准备、课堂实施、课后评价与沉淀三阶段轨道，初始 20 个节点全部为 `pending`。
  - 右侧审校区拆分为教师确认、证据缺口、评价量规、资产沉淀四个面板。
  - 删除伪运行状态、伪时间戳日志、SWOT 默认章节与开发样例噪音。
  - 旧泛雅模拟工具保留但默认折叠，并弱化旧版 20 环节叙事。

- 重构 `前端核心/agent-runtime/action-engine.js`
  - `practice.create_flow` 改为合并 `artifacts.practiceFlow`、渲染主画布、当前节点详情、教师介入点与产物区。
  - 增强 `rubric.create`、`evidence.flag_gap`、`asset.create_node`、`asset.create_edge`、`user.ask`、`system.complete_stage` 渲染。
  - 新增 Agent 状态、页面状态、三阶段轨道、产物输出的集中渲染能力。

- 重构 `前端核心/agent-runtime/agent-client.js`
  - 启动时清空旧结果并设置 running。
  - 根据 `director_thinking`、`agent_start`、`action`、`agent_end`、`session_state` 同步工作台状态。
  - 正常结束后进入 `ready_for_review`，而不是简单 complete。

- 更新 `前端核心/agent-runtime/state-store.js`
  - 增加 `directorState`，用于前端同步 session 状态。

- 更新 `前端核心/styles.css`
  - 新工作台保持暖色学术风格，主宽度约束为 1280px。
  - 三栏比例为 `240px / 1fr / 320px`，右侧审校面板 sticky。
  - 卡片圆角统一收敛到 16px。

## 未修改范围

- 未重写后端 agent 类型系统。
- 未修改 `/api/agent/run` 主流程。
- 未删除旧泛雅模拟功能，只将其迁移为折叠兼容入口。
