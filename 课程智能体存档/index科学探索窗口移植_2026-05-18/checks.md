# 检查记录

- `node --check 前端核心/app.js`：通过。
- `VITE_WENDAO_DOMAIN=cpu.libsp.net WENDAO_DOMAIN=cpu.libsp.net npm run build:static`：通过。
- `npm run build:server`：通过。
- `npx tsc -p tsconfig.json --noEmit`：通过。
- `git diff --check`：通过。
- Browser 本地验证 `http://localhost:5173/index.html`：首页存在 `data-wenda-variant="home-dialog"` 挂载点，渲染 `闻道科学探索`，iframe 指向 `https://cpu.libsp.net/api/openAccess/redirect/home?...select_agent_id=6f5b49b6-5cb4-11f0-9ae8-fa163f087fa9`。
- Browser 本地验证 `http://localhost:5173/teaching-data.html`：教学数据页完整闻道工作台仍存在，默认激活“科学探索”，课程图谱工作台仍存在。
