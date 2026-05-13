本轮变更记录：

- 修改 `前端核心/teaching-navigation.html`：更新教学导航页标题、副标题、地图说明文案和地图卡片文案，保留 `teachingRouteMapSvg`、`teachingRouteMapNodes`、`teachingRouteMapStats`、`teachingNodeDetail` 等核心挂载点。
- 修改 `前端核心/app.js`：新增 5 阶段地铁映射、20 站点固定坐标、5 条 SVG 地铁线路、5 阶段 Tabs、地铁站点渲染、StoryMaps 式右侧说明卡，并保留 explain/training 两态和 A-F 方案选择/确认逻辑。
- 修改 `前端核心/styles.css`：追加教学地铁图视觉覆盖层，使用现有 Pharmacopilot 变量体系完成暖米色纸感背景、多色地铁线路、当前站点、完成站点、弱化锁定站点、右侧 410px 说明卡和移动端横向地图。
