# 检查记录

- `VITE_WENDAO_DOMAIN=cpu.libsp.net npm run build:wenda`：通过。
- `npm run typecheck`：通过。
- `node --check scripts/build-wenda-embed.cjs && node --check 前端核心/app.js`：通过。
- `VITE_WENDAO_DOMAIN=cpu.libsp.net npm run build:static`：通过。
- `git diff --check`：通过。
- Playwright 本地渲染检查：`http://localhost:5191/teaching-data.html` 能渲染“闻道学术服务平台内嵌工作区”，旧 `academicServiceEmbedPanel` 不存在。
- URL 参数检查：`searchText` 中文可正确编码/解码，`datasetList=["id1","id2"]`，`image_ids=["image_id_1"]`，`file_ids=["file_id_1"]`，`exploreId=explore-7`。
- iframe 检查：`title="闻道学术服务平台"`，路径为 `/api/openAccess/redirect/history`，最小高度为 `720px`，备用“新窗口打开闻道页面”链接存在。
- 截图：`after/wenda-embed-workspace.png`。
