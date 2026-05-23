# 修改日志

## 本轮目标

基于 navigation_focus_v3 前台减法版继续优化教学导航页，防止后台说明、质量雷达、证据链、Agent 运行状态、资产货架等模块回流主界面。

## 主要改动

- 将 `前端核心/teaching-navigation.html`、`teaching-navigation-productized.js`、`teaching-navigation-productized.css` 回到 navigation_focus_v3 的减法版结构。
- 主界面只保留三时段路线、十任务站、轻量药事情境 select、证据图、单个教学判断题、选择后反馈、折叠产物、保存资产与下一站。
- 将 what / why / how 保留在 `本站依据` 折叠区，未作为主界面大卡片展示。
- 移除主界面常驻的质量雷达、证据链、Agent 运行状态、资产货架、产物审校预览、摘要导出等后台/审计型面板。
- 调整判断题：选项只展示判断，不提前暴露反馈理由；反馈只在选择后出现。
- 强化交互顺序：未判断不能生成产物；未生成或填写产物不能保存资产；未保存资产不能进入下一站。
- 补回页面级顶部导航、按钮、响应式和 box-sizing 样式，避免 v3 减法后顶部壳和宽度溢出。
- 在 `后端核心/src/http-utils.ts` 增加 `teaching-navigation-contract.js` 静态路由，修复本地服务契约脚本 404。
- 新增 `scripts/verify-navigation-focus-v3.cjs`，守住本轮前台减法约束和契约脚本路由。

## 已知限制

- `npm run build:static` 仍失败，原因是当前工作区已有旧入口文件缺失：`dashboard.html`、`settings.html`、`outputs.html`、`navigation.html`、`interface-review-improved.html`。本轮没有恢复这些入口，以避免把无关页面重新纳入。
- 因上述 build:static 失败，为浏览器复测手动同步了本次导航页相关文件到 `dist/` 预览目录；该目录是生成输出，不作为本轮源码提交重点。
