# 验证记录

## 静态检查

- `node --check 前端核心/app.js`：通过
- `npm run build`：通过
  - `npm run build:static`：通过
  - `npm run build:server`：通过
- `git diff --check -- 前端核心/app.js 前端核心/styles.css 课程智能体存档/浏览器渲染崩溃性能修复_2026-05-12`：通过

## 风险扫描

- `rg "useEffect|useState|setState|framer-motion|repeat:\\s*Infinity|whileHover|layout=|<video|<canvas|three|webgl|mix-blend-mode|blur-3xl|backdrop-blur"`：源码未命中高风险 React/Framer/媒体/WebGL/Tailwind blur 项。
- `前端核心` 媒体文件扫描：未发现 `.png/.jpg/.jpeg/.gif/.mp4/.webm/.svg` 大资源文件。

## 浏览器冒烟

本地服务：`http://localhost:5173`

- `index.html`：标题 `Pharmacopilot | 首页`，`body[data-page="home"]` 正常，关键节点 `#homeFeatureTabs/#homeCoworkStage/#homeCoworkOutput` 均存在，控制台错误 0。
- `teaching-navigation.html`：标题 `Pharmacopilot | 教学导航`，关键节点 `#teachingRouteMapNodes/#teachingRouteMapSvg/#teachingNodeDetail` 均存在，控制台错误 0。
- `assets.html`：标题 `Pharmacopilot | 教学资产`，关键节点 `#assetKnowledgeCanvas/#assetGraphKpis/#assetList` 均存在，控制台错误 0。
- `workflow.html`：标题 `Pharmacopilot | 工作流`，关键节点 `#workflowCanvas/#workflowEdges/#workflowNodes` 均存在，控制台错误 0。

## 性能修复确认

- `workflow.html` 中 `.workflow-edge-path` 为 35 条，持续流线 `.workflow-edge-flow` 降为 4 条。
- `assets.html` 中当前关系图未创建 `<canvas>`，只保留 1 个轻量 SVG 关系线图。
