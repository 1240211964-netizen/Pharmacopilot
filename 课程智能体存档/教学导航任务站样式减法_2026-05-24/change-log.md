# 修改日志

## 变更范围

- 更新 `前端核心/teaching-navigation-productized.css`：
  - 增加 `.context-drawer { display: none !important; }` 防回归规则。
  - 将任务站封面改为单列、`20px 22px` 内距，并收敛当前任务站标题字号、行高和上边距。
  - 将 `station-input-chips` 收束为紧凑标签样式。
  - 增加 `.pp-positioning-simulator`、`.pp-sim-grid`、`.pp-sim-card`、`.pp-sim-feedback`、`.pp-career-bar` 样式。
  - 补充 1180px 与 680px 断点，保证模拟器在窄屏下单列且无横向溢出。
- 更新 `前端核心/teaching-navigation-productized.js`：
  - 给教学定位模拟器追加新类名，并用 `.pp-sim-grid` 包住三张主体卡。
  - 将学生去向分布条改为 `i > b` 结构，匹配新版分布条 CSS。
  - 给反馈卡追加 `.pp-sim-feedback`，保留原有 `.pp-feedback-box` 行为。
- 更新 `scripts/verify-navigation-focus-v3.cjs`：
  - 增加本轮 CSS/DOM 回归检查，覆盖旧抽屉隐藏、任务站封面、标签、模拟器三栏、推荐状态和分布条结构。
- 已手动同步教学导航相关静态文件到 `dist/`、`dist/launch/`、`dist/teaching-navigation/`，用于当前本地服务预览。

## 未改动

- 未修改四页信息架构。
- 未恢复或删除当前工作区里既有的其他未提交文件。
- 未更改后端接口或第三方平台行为。
