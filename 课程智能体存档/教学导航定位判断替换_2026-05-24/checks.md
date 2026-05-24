# 检查记录

## Red Check

- `node - <<'NODE' ... NODE`
- 结果：失败，源码缺少 `pp-positioning-lab`、`data-positioning-answer="decision"`、`copyPositioningStatement` 和 `.pp-positioning-lab`。这是本轮替换前的预期失败。

## Source Checks

- `node --check 前端核心/teaching-navigation-productized.js`
  - 结果：通过。
- `node - <<'NODE' ... NODE`
  - 结果：通过，源码包含 `pp-positioning-lab`、`data-positioning-answer=`、`copyPositioningStatement`、`Step 1 · 看证据`、`Step 2 · 作判断` 和对应 CSS 标记。
- `git diff --check -- 前端核心/teaching-navigation-productized.js 前端核心/teaching-navigation-productized.css dist/... 课程智能体存档/教学导航定位判断替换_2026-05-24`
  - 结果：通过。

## Build Checks

- `npm run build:server`
  - 结果：通过。
- `npm run build:static`
  - 结果：未通过。失败原因是当前工作树中既有缺失文件：`前端核心/dashboard.html`、`前端核心/settings.html`、`前端核心/outputs.html`、`前端核心/navigation.html`、`前端核心/interface-review-improved.html`。这与本轮触碰的教学导航 JS/CSS 无关。
- 处理：已手动同步本次触碰文件到 `dist/teaching-navigation-productized.*`、`dist/launch/teaching-navigation-productized.*`、`dist/teaching-navigation/teaching-navigation-productized.*`。

## Browser Smoke

- URL：`http://127.0.0.1:5173/teaching-navigation.html`
- 初始结构：`#positioningLab` 存在，`[data-positioning-answer]` 数量为 3，原独立 `#decisionPanel` 和 `#feedbackPanel` 在第 1 站隐藏。
- 选择 B：反馈为“需要调整...”，`#positioningOutput.hidden === true`，`generateArtifactBtn.disabled === true`。
- 选择 A：`#positioningOutput.hidden === false`，生成按钮可用，保存按钮可用。
- 复制按钮：点击后剪贴板包含“SWOT 定位为药事管理情境中的管理决策训练工具”。
- 桌面宽度 1280：无横向溢出。
- 移动宽度 390：无横向溢出，`#positioningLab` 宽 362，两个 `pp-positioning-panel` 均宽 362。
