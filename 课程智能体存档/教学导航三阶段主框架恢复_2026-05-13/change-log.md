## 修改范围

- `前端核心/app.js`
  - 将顶层 `routeStageDefinitions` 从 5 个地铁分段恢复为 3 个教学阶段：
    - 课前教学设计与准备 01–08
    - 课中教学实施与调控 09–16
    - 课后评价反馈与持续改进 17–20
  - 新增 `routeMetroLineDefinitions`，将 5 条彩色线路独立为视觉分组。
  - 新增 `getTeachingPhaseIdByNodeId()`、`getTeachingPhaseTitle()`、`getTeachingPhaseNodes()`。
  - 顶部状态、阶段 Tab、右侧说明卡、复盘区恢复使用三阶段教学闭环。
  - 保留 `getMetroStageIdByNodeId()` 和 `getMetroStageTitle()`，继续服务 5 条线路分组和节点说明。

- `前端核心/styles.css`
  - 阶段 Tab 栅格从 5 列改为 3 列。
  - 增加 Tab 最小高度，适配三阶段长标题。
  - 降低阶段虚线岛屿填充强度，避免回到厚背景块。

- `前端核心/teaching-navigation.html`
  - 将阶段区 aria 文案从“五阶段教学地铁线路”改为“三阶段教学训练闭环”。

## 交互边界

- 点击阶段 Tab 仍会跳转到该阶段第一个站点。
- 地图浏览态不展示 A-F 方案。
- 点击“开始本环节训练”后才进入现有 training 模式。
- 未改动 localStorage、trainingState、方案选择、生成、确认节点等训练状态逻辑。
