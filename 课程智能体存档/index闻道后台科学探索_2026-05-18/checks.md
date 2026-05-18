# 检查记录

- `node --check 前端核心/app.js`：通过。
- `npm run typecheck`：通过。
- `VITE_WENDAO_DOMAIN=cpu.libsp.net WENDAO_DOMAIN=cpu.libsp.net npm run build:static`：通过。
- `npm run build:server`：通过。
- 本地服务：`PORT=5173 npm start`，服务地址 `http://localhost:5173`。
- Headless Chrome 截图：`home-wenda-runner.png`，首页输入区正常显示，文本未发生明显重叠。
- CDP 交互验证：提交中文检索后，`#homeWendaRunnerFrame.src` 与 `#homeWendaRunnerOpen.href` 均为 `https://cpu.libsp.net/api/openAccess/redirect/history?...`；`searchText` 可正确解码，`hd=1,1`，`internet_search=false`。
