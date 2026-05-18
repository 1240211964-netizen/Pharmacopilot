# 检查记录

## 本地代码检查

- `node --check 前端核心/app.js`：通过。
- `node --check 前端核心/agent-runtime/action-engine.js`：通过。
- `git diff --check -- 前端核心/practice.html 前端核心/app.js 前端核心/styles.css 前端核心/agent-runtime/action-engine.js`：通过。
- `VITE_WENDAO_DOMAIN=cpu.libsp.net WENDAO_DOMAIN=cpu.libsp.net npm run build:static`：通过。
- `npx tsc -p tsconfig.json --noEmit`：通过。
- `npm run build:server`：通过。

## 静态构建验证

对 `dist/` 执行 Node 读取校验：

- `practice.html` 中仍有 20 个 `practice-stage-node`，编号 1-20 完整。
- `practice.html` 中包含超星 `mycourse/tch?courseid=251769346` 平台地址。
- `practice.html` 中包含 `perspectiveType=平台可以提供的ai实践` 的 URL 编码参数。
- `app.js` 中包含 `selectChaoxingPracticeStep` 与 `loadChaoxingAiPracticeEmbed`。
- `app.js` 中包含状态画布 `.practice-stage-node` 的点击事件委托。
- `agent-runtime/action-engine.js` 中动态节点包含 `data-ai-practice-ready="true"` 与 `tabindex="0"`。
- `styles.css` 中包含选中态 `data-ai-practice-selected="true"` 与 `平台 AI 实践` 提示样式。

## 第三方地址检查

- 对用户提供的超星链接执行 GET 跟随跳转，结果为 `302 -> 200`，未在响应头中看到 `X-Frame-Options` 或 `Content-Security-Policy` 的 frame 限制字段。
- 实际嵌入是否显示仍取决于用户浏览器中的超星登录态、第三方 Cookie 策略和超星平台 iframe 白名单。

## 浏览器验证说明

本轮本地静态预览 `http://127.0.0.1:5173/practice.html` 可正常返回 `200 OK`；内置 Codex 浏览器面板本轮不可用，未完成截图式浏览器验证。
