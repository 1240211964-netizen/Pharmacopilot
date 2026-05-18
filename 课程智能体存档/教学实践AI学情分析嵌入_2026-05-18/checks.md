# Checks

- `node --check 前端核心/app.js`：通过。
- `node --check 后端核心/启动入口/server.cjs`：通过。
- `VITE_WENDAO_DOMAIN=cpu.libsp.net WENDAO_DOMAIN=cpu.libsp.net npm run build`：通过。
- `rg -n "stat2-ans|study-ai|AI 学情分析|data-active-step=\"2\"" 前端核心/practice.html dist/practice.html dist/launch/practice.html`：确认源码与构建产物均包含新的 AI 学情分析地址和 STEP 02 默认绑定。

