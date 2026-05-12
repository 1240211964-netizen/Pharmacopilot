# Change Log

## Scope

- `前端核心/teaching-navigation.html`
- `前端核心/app.js`
- `前端核心/styles.css`
- `package.json` 仅存档对照，本轮未修改。

## Changes

- 将教学导航页主标题拆出 `teaching-title-tail`，提升移动端换行可控性。
- 在 `renderRouteMapPaths()` 中增加 `route-path-base` 基础路线层，让 20 节点推进路线更清晰。
- 将三阶段概览卡改成可点击 `route-stage-pill`，点击后定位到对应阶段第一个节点并打开说明态卡片。
- 新增 `selectRouteStagePill()`，复用既有节点选择状态，不改 20 环节数据结构。
- 保留并继续复用“说明态 -> 开始本环节训练 -> A-F 方案选择 -> 智能生成草稿 -> 评分诊断 -> 确认推进”流程。
- 锁定节点仍可查看说明，但禁用训练入口，并将提示收敛为“完成前序节点后进入本环节训练流程”。
- 追加教学导航旅程式视觉覆盖层：暖米色背景、sage 绿、muted blue、terracotta 点缀、轻量阶段椭圆、主路线与圆形里程碑节点。
- 将地图内浮层卡片从深色压迫感调整为浅色右侧说明卡，保持卡片内训练态可滚动。
- 补充窄屏标题、状态卡和阶段卡文本约束，降低横向溢出风险。

## Rollback

如需回滚本轮改造，可将 `before/` 目录下对应文件复制回项目根目录：

- `before/前端核心/teaching-navigation.html` -> `前端核心/teaching-navigation.html`
- `before/前端核心/app.js` -> `前端核心/app.js`
- `before/前端核心/styles.css` -> `前端核心/styles.css`
- `before/package.json` -> `package.json`
