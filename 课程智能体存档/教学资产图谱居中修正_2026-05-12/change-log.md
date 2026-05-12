# Change Log

## Plan

- 归档当前资产图谱版本作为改造前。
- 修复 `.asset-graph-section` 覆盖 `.section-block` 居中 margin 的问题。
- 将图谱内部布局中心点从偏左位置调整为视觉居中。
- 运行构建检查和浏览器检查。

## Result

- 已修复 `.asset-graph-section` 覆盖 `.section-block` 居中样式的问题，将 `margin: 0 0 32px` 改为 `margin: 0 auto 32px`。
- 已将图谱内部布局中心点从 `48%` 调整为 `50%`，避免画布内网络视觉偏左。
- 保留现有粒子交互、筛选、tooltip、节点详情和资产详情联动逻辑。
- 已通过 `node --check 前端核心/app.js`、`npm run build:static`、`npm run build:server`。
- 已完成桌面端与 `390 x 844` 移动端浏览器检查，无控制台错误。
