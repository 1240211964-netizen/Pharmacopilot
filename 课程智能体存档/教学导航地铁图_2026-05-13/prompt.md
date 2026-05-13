本轮需求：

- 基于当前 Pharmacopilot 项目最新教学导航页代码，把教学导航地图重构为高保真“教学地铁图”风格。
- 保留 teachingRouteMapSvg、teachingRouteMapNodes、teachingNodeDetail 等现有 DOM 入口。
- 不新建 React 页面，不引入新框架，不破坏训练状态、localStorage、A-F 方案选择和确认节点逻辑。
- 视觉目标为暖米色 Pharmacopilot 品牌风格、5 阶段地铁线路、20 个站点、右侧 StoryMaps 式节点说明卡。
