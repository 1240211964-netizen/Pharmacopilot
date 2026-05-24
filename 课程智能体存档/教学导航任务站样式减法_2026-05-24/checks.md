# 验证记录

## TDD / 回归检查

- `node scripts/verify-navigation-focus-v3.cjs`
  - 先失败，缺少本轮新增的 `.context-drawer` 强制隐藏、`.pp-positioning-simulator`、`.pp-sim-grid`、`.pp-career-bar`、分布条 DOM 等检查项。
  - 修改后通过：`Navigation focus v3 verification passed.`

## 静态与语法检查

- `node --check 前端核心/teaching-navigation-productized.js`
  - 通过。
- `git diff --check -- 前端核心/teaching-navigation-productized.css 前端核心/teaching-navigation-productized.js scripts/verify-navigation-focus-v3.cjs 课程智能体存档/教学导航任务站样式减法_2026-05-24`
  - 通过。
- `npm run build:server`
  - 通过。
- `npm run build:static`
  - 未通过，失败点为当前工作区既有缺失文件：
    - `前端核心/dashboard.html`
    - `前端核心/settings.html`
    - `前端核心/outputs.html`
    - `前端核心/navigation.html`
    - `前端核心/interface-review-improved.html`
  - 这些文件在本轮开始前已处于删除状态，失败不由本轮 CSS/JS 修改引入。

## 静态产物同步

- 手动同步：
  - `前端核心/teaching-navigation.html` -> `dist/teaching-navigation.html`、`dist/launch/teaching-navigation.html`、`dist/teaching-navigation/index.html`
  - `前端核心/teaching-navigation-productized.css` -> `dist/teaching-navigation-productized.css`、`dist/launch/teaching-navigation-productized.css`、`dist/teaching-navigation/teaching-navigation-productized.css`
  - `前端核心/teaching-navigation-productized.js` -> `dist/teaching-navigation-productized.js`、`dist/launch/teaching-navigation-productized.js`、`dist/teaching-navigation/teaching-navigation-productized.js`
- `rg` 验证同步后的 `dist` 文件包含：
  - `.context-drawer`
  - `.pp-positioning-simulator`
  - `.pp-sim-grid`
  - `.pp-career-bar`
  - `station-input-chips span`

## 浏览器检查

- 地址：`http://127.0.0.1:5173/teaching-navigation.html?codexCssCheck=20260524b`
- 桌面视口检查结果：
  - 页面正文不包含“本站依据”。
  - `.context-drawer` 数量为 0。
  - 当前任务站标题为“教学定位模拟器”。
  - 标题计算样式：`font-size: 23.2px`、`line-height: 27.376px`、`margin-top: 10px`。
  - `.station-cover` 计算内距为 `20px 22px`。
  - 输入标签数量为 7。
  - `.pp-positioning-simulator` 已渲染。
  - `.pp-sim-grid` 桌面列宽为 `260px 260px 300px`。
  - `.pp-career-bar` 数量为 3，首条分布条宽度为 `34%`。
  - 推荐状态显示“系统推荐”。
- 移动视口 `390 x 844` 检查结果：
  - `documentScrollWidth: 390`
  - `hasHorizontalOverflow: false`
  - `.pp-sim-grid` 单列宽度为 `362px`
