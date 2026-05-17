# Checks

- `rg -n "Copilot 运行中|20 环节路线可见|章节 SWOT 分析|当前节点 STEP 12|STEP 14 待确认|HBS Case Collection|管理学原理第 3 章：组织结构|09:42:11|SWOT|真实课程|20 环节" 前端核心/practice.html 前端核心/agent-runtime`
  - 结果：无命中。

- `node --check 前端核心/agent-runtime/action-engine.js && node --check 前端核心/agent-runtime/agent-client.js && node --check 前端核心/agent-runtime/state-store.js`
  - 结果：通过。

- `npm run build:static`
  - 结果：通过。

- `npm run build:server`
  - 结果：通过。

- `git diff --check`
  - 结果：通过。

- 浏览器验证 `http://localhost:5187/practice.html`
  - 初始状态：`#practice-runtime-status` 为“待启动”。
  - 主区块：`practice-workbench-hero`、`practice-agent-workbench`、`practice-artifact-output`、`practice-legacy-tools`。
  - Agent 卡片：Director / Practice / Rubric / Evidence / Asset 初始均为 waiting。
  - 三阶段轨道：20 个节点全部 pending。
  - 旧工具：默认折叠。
  - 启动后：SSE 可运行，Agent 状态发生变化，`practice.create_flow` 更新中央画布并展开当前节点详情，Rubric 与 Evidence 进入右侧审校区，页面最终进入“待审校”。
