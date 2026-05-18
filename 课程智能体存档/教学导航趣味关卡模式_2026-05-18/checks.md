# 验证记录

- `node --check 前端核心/app.js`：通过。
- `git diff --check -- 前端核心/app.js 前端核心/styles.css 前端核心/teaching-navigation.html`：通过。
- `npm run build:static`：通过。
- `npm run build`：通过，包含 `build:static`、`build:server`、`build:next`。
- 本地服务：`PORT=5188 npm start`，访问 `http://localhost:5188/teaching-navigation.html`。
- 浏览器验证：默认 1280x720 视口下 20 个关卡卡片无重叠、无画布溢出、无页面横向溢出，右侧关卡说明可见，控制台无 error。
- 浏览器验证：390x844 移动视口下 20 个关卡卡片无重叠、无画布溢出、无页面横向溢出，控制台无 error。
