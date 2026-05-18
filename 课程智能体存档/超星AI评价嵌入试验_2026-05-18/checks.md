# 检查记录

- `node --check 前端核心/app.js`：通过。
- `VITE_WENDAO_DOMAIN=cpu.libsp.net WENDAO_DOMAIN=cpu.libsp.net npm run build:static`：通过。
- `npm run build:server`：通过。
- Browser 本地验证 `http://localhost:5173/practice.html`：面板存在；初始 iframe 为 `about:blank`；点击“加载内嵌编辑器”后 iframe 指向超星 AI 评价编辑器 URL；当前环境下未按时收到第三方 load 事件，状态进入“可能受到平台嵌入限制”，按钮恢复可用。
