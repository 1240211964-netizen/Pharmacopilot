# 验证记录

- `node --check 前端核心/app.js`：通过。
- `git diff --check -- 前端核心/app.js 前端核心/styles.css 前端核心/teaching-navigation.html`：通过。
- `npm run build:static`：通过。
- `npm run build`：通过，包含 `build:static`、`build:server`、`build:next`。
- 本地服务：`http://localhost:5188/teaching-navigation.html`。
- 浏览器桌面验证：1280x720 下 20 个 Level 卡片无重叠、无画布溢出、无页面横向溢出；关卡任务简报包含 5 个指定字段；控制台无 error。
- 浏览器训练模式验证：点击开始挑战后显示“方案卡牌选择”、方案卡角色标记、成熟度评分与低分维度、确认通关按钮。
- 浏览器移动验证：390x844 下 20 个 Level 卡片无重叠、无画布溢出、无页面横向溢出；控制台无 error。
