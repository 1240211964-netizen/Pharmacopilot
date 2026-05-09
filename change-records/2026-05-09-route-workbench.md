# 2026-05-09 route-workbench

## 目的
- 将 `teaching-navigation.html` 的路线地图与 `app.js` 中已有 20 环节测评系统合流。
- 将右侧静态详情升级为节点测评工作台。
- 保持正式入口为 `teaching-navigation.html`，不维护两套正式导航。

## 修改前备份
- `change-records/backups/2026-05-09-route-workbench/`

## 计划修改文件
- `前端核心/teaching-navigation.html`
- `前端核心/app.js`
- `前端核心/styles.css`

## 已记录变更
- `前端核心/teaching-navigation.html`
  - 更新静态资源版本号为 `route-workbench-20260509`。
- `前端核心/app.js`
  - `initTeachingNavigationPage()` 进入页面时加载已有训练状态，并以 `trainingState.currentStepId` 作为默认路线节点。
  - 新增 `getRouteNodeStatus(stepId)`，路线节点状态从 `trainingState.completedStepIds`、`trainingState.currentStepId` 动态计算。
  - `renderRouteMapPaths()`、`renderMapNode()`、`renderTeachingHeroStatus()`、`renderStageOverview()`、`renderProgressSummary()` 均改为读取动态状态。
  - `renderNodeDetailPanel()` 从静态详情升级为右侧节点测评工作台：
    - 节点头部显示编号、状态、阶段、核心问题。
    - 直接渲染当前环节 A-F 方案。
    - 直接渲染 4 维 Rubric 成熟度诊断、评分条、理论依据和低分维度建议。
    - 保留教师任务、产出物、进入训练和确认本节点操作。
  - 新增 `selectRoutePrimaryOption()`、`toggleRouteSecondaryOption()`、`confirmRouteStep()`。
  - 路线页中的理论来源展开不再触发页面滚动。
  - 暴露路线页调试函数到 `window`。
- `前端核心/styles.css`
  - 扩展右侧工作台布局，适配 A-F 方案卡与 Rubric 诊断内容。
  - 增加工作台 fade + translateY 动效。
  - 增加评分条宽度动画。
  - 增加低分维度卡片轻微高亮。
  - 调整路线地图与右侧工作台桌面比例，移动端保持单列。
- `dist/`
  - 通过构建命令同步生成。

## 验证
- `node --check 前端核心/app.js` 通过。
- 源文件文案扫描通过：无禁用表述命中。
- `npm run build:static` 通过。
- `npm run build:server` 通过。
- `npm run build` 通过。
- `node --check dist/app.js && node --check dist/launch/app.js` 通过。
- 构建产物文案扫描通过：无禁用表述命中。
- `curl http://localhost:5185/teaching-navigation` 返回 200。
- 浏览器烟测通过：
  - 打开正式教学导航入口无 console error。
  - 点击路线节点后，右侧面板局部更新，页面滚动位置不变。
  - 右侧面板显示对应环节 6 个 A-F 方案按钮。
  - 选择主方案后生成 4 张 Rubric 维度卡，成熟度评分显示为数值。
  - 点击确认后，本节点变为已完成，下一节点变为当前节点。
  - 路线统计同步更新。
  - 移动端页面宽度等于视口宽度，无横向溢出。
  - 顶部与页面导航仍指向 `teaching-navigation.html`，旧 `navigation.html` 未作为主入口。
- 视觉检查截图：
  - `change-records/2026-05-09-route-workbench-desktop.png`
  - `change-records/2026-05-09-route-workbench-mobile.png`
  - `change-records/2026-05-09-route-workbench-viewport.png`
