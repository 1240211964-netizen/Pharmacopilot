# 用户反馈

用户认为首页 Cowork 式视觉改造效果很好，并要求“把这样的设计风格也同步到教学导航”。

# 本轮目标

将当前教学导航入口页 `前端核心/teaching-navigation.html` 的视觉风格同步为首页 Cowork 样式：浅色页面基底、居中产品说明、浅色分段阶段控件、大幅渐变舞台、左侧深色节点工作台、右侧地图/文档式预览。

# 约束

- 不改旧 `navigation.html` 的训练地图任务单逻辑。
- 不改变 20 环节数据结构和训练状态逻辑。
- 不新增后端接口，不引入 React/Tailwind/新框架。
- 保留现有关键 id：`teachingRouteProgress`、`teachingRouteStage`、`teachingRouteNextTask`、`teachingRouteMapSvg`、`teachingRouteMapNodes`、`teachingRouteMapStats`、`teachingNodeDetail`、`teachingProgressSummary`。
- 本轮继续留痕、检查、提交并推送 GitHub。
