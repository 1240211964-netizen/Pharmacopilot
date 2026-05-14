# Checks

- `node --check 前端核心/app.js`
- `git diff --check -- 前端核心/practice.html 前端核心/styles.css 前端核心/app.js`
- `npm run build:static`
- `npm run build:server`
- 本地浏览器检查 `http://localhost:5173/practice.html?v=agent-log-sidebar`：
  - `.practice-route-layout` 数量为 `1`
  - 20 环节节点数量为 `20`
  - `.agent-state-panel` 数量为 `1`
  - Agent 日志行数量为 `5`
  - 指标卡数量为 `4`
  - 控制台错误数量为 `0`
- 补充生成移动宽度截图：`screenshots/mobile-practice-agent-log.png`
