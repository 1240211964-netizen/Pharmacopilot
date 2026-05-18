# Checks

- `node --check 前端核心/app.js`：通过。
- `npm run build:static`：通过。
- `npm run typecheck`：通过。
- `git diff --check -- 前端核心/practice.html 前端核心/app.js 前端核心/styles.css`：通过。
- Browser 本地验证 `http://localhost:5173/practice.html`：
  - 右侧显示 `推荐学情分析 Prompt`，不再显示 `课程 ID / 班级 ID / 显示方式 / 接入方式 / 当前状态`。
  - 初始 Prompt 绑定 `STEP 02 · 学情分析与学习起点诊断`。
  - 点击 STEP 10 后，右侧 Prompt 自动更新为 `STEP 10 · 先行组织与经验激活`。
