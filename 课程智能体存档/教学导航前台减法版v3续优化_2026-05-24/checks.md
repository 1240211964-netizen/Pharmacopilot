# 检查结果

- `node --check 前端核心/teaching-navigation-productized.js`：通过。
- `node --check scripts/verify-navigation-focus-v3.cjs`：通过。
- `node scripts/verify-navigation-focus-v3.cjs`：通过，确认未恢复质量雷达、证据链、Agent 运行状态、资产货架等常驻模块。
- `npm run build:server`：通过。
- `git diff --check -- 前端核心/teaching-navigation.html 前端核心/teaching-navigation-productized.js 前端核心/teaching-navigation-productized.css 后端核心/src/http-utils.ts scripts/verify-navigation-focus-v3.cjs`：通过。
- `npm run build:static`：失败；失败点为旧入口文件缺失：`前端核心/dashboard.html`、`settings.html`、`outputs.html`、`navigation.html`、`interface-review-improved.html`。
- `curl http://localhost:5173/teaching-navigation.html`：200，HTML 包含 `证据图 → 判断题 → 反馈 → 产物 → 保存资产` 和 `scenarioSelect`，未命中后台常驻模块关键 ID。
- `curl http://localhost:5173/teaching-navigation-contract.js`：200，契约脚本可被本地服务访问。
- Browser 桌面 DOM 检查：契约加载正常；四个药事情境 option；十个任务站；无质量雷达/运行状态/证据链/资产货架；无横向溢出。
- Browser 交互检查：初始反馈隐藏、生成/保存/下一站禁用；选择判断后反馈出现且生成启用；生成后产物抽屉打开且保存启用；保存后进度变为 `1 / 10` 且下一站启用。
