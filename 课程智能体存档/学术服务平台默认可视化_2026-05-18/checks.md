# Checks

- `node --check 前端核心/app.js` passed.
- `npm run build:static` passed.
- `git diff --check -- 前端核心/teaching-data.html 前端核心/app.js 前端核心/styles.css` passed.
- Browser check at `http://localhost:5190/teaching-data.html`:
  - The academic service panel is inserted immediately after the teaching-data hero and before the course graph.
  - Default domain is `nju.libsp.net`.
  - Default route is `chat`.
  - Default `searchText` is `影像学检查有哪些辐射风险？`.
  - Generated URL includes `/api/openAccess/redirect/history`, `hd=1,1`, `agentId`, `modelId`, `exploreId=1`, `datasetList`, `image_ids`, and `file_ids`.
  - Visual preview text shows `2 个知识库`, `1 张图片`, `1 个文件`, and `联网检索关闭`.
  - Desktop metrics: `window.innerWidth=1280`, `documentElement.scrollWidth=1280`.
  - Mobile metrics: `window.innerWidth=390`, `documentElement.scrollWidth=390`.
  - Browser console errors/warnings: none.
