# 教学导航前台减法版 v3 续优化

## 目标

基于 `navigation_focus_v3` 的前台减法版继续优化教学导航页，主界面只围绕当前任务站的一个教学判断推进。

## 本轮边界

- 不恢复质量雷达、证据链、Agent 运行状态、资产货架等常驻模块。
- `contract` 保留完整结构，UI 只取当前任务必要字段。
- 每个任务站只完成一个教学判断。
- 主交互固定为：证据图 → 判断题 → 反馈 → 产物 → 保存资产。
- what / why / how 仅在 `本站依据` 折叠区展示。
- 药事情境使用轻量 select，不做四张大卡。
- 页面不做 dashboard。

## 修改

- 将 `前端核心/teaching-navigation.html`、`teaching-navigation-productized.js`、`teaching-navigation-productized.css` 调整回 `navigation_focus_v3` 的减法版结构，并继续收紧交互顺序。
- 判断题选项只展示判断本身，不提前展示反馈理由；选择后再显示系统反馈。
- 生成、保存、下一站按钮按判断/产物/资产保存状态解锁。
- 补回页面级顶部导航和响应式盒模型样式，修复 dist 预览中的横向溢出。
- 在 `后端核心/src/http-utils.ts` 增加 `teaching-navigation-contract.js` 静态映射，避免本地服务下契约脚本 404。
- 新增 `scripts/verify-navigation-focus-v3.cjs`，用于验证本轮减法边界和服务端契约路由。

## 验证

- `node --check 前端核心/teaching-navigation-productized.js`：通过。
- `node --check scripts/verify-navigation-focus-v3.cjs`：通过。
- `node scripts/verify-navigation-focus-v3.cjs`：通过。
- `npm run build:server`：通过。
- `git diff --check -- 前端核心/teaching-navigation.html 前端核心/teaching-navigation-productized.js 前端核心/teaching-navigation-productized.css 后端核心/src/http-utils.ts scripts/verify-navigation-focus-v3.cjs`：通过。
- `npm run build:static`：失败，原因是当前工作区已有旧入口文件缺失：`dashboard.html`、`settings.html`、`outputs.html`、`navigation.html`、`interface-review-improved.html`。
- Browser：契约加载正常，四个药事情境 option、十个任务站、无后台常驻模块、无横向溢出；主流程从选择判断到反馈、生成产物、保存资产可完成。

## 留痕

完整 before/after、prompt、source zip、检查记录位于：

`课程智能体存档/教学导航前台减法版v3续优化_2026-05-24/`
