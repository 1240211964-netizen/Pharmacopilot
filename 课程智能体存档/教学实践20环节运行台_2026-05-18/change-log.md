# 教学实践 20 环节运行台改造

## 修改范围
- `前端核心/practice.html`
- `前端核心/app.js`
- `前端核心/styles.css`
- `前端核心/agent-runtime/action-engine.js`
- `前端核心/agent-runtime/agent-client.js`

## 主要变化
- 将 practice 首屏改为「20 环节教学实践运行台」，明确 20 个教学环节是流程状态节点，不是 20 个真实 Agent。
- 新增 6 个运行态摘要：当前 STEP、负责 Agent、证据缺口、教师确认、已形成产物、Director 下一步调度。
- 保留顶部导航与旧版泛雅/兼容流程折叠区，不新增左侧导航栏。
- Agent 调度区只保留 Director、Practice Agent、Rubric Agent、Evidence Agent、Asset Agent 五类专业 Agent。
- 20 个状态节点增加负责 Agent 标识，当前节点详情增加负责 Agent、证据、教师接管点和 Director 下一步。
- 修复 `SESSION_STATE` 覆盖前端已渲染 artifacts 的问题，避免运行后顶部状态回退。
- 将 practice 默认模拟课程从 SWOT 示例改为药品政策与机构管理案例分析，避免把 SWOT 泛化为 practice 默认主题。

## 构建说明
- 未新增 JS 文件。
- `package.json` 的 `build:static` 已有 `agent-runtime` 目录复制逻辑，本轮无需修改。
