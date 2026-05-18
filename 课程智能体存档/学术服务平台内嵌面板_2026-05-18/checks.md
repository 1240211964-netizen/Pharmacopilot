# Checks

- `node --check 前端核心/app.js` passed.
- `npm run build:static` passed.
- `git diff --check -- 前端核心/teaching-data.html 前端核心/app.js 前端核心/styles.css` passed.
- Browser check at `http://localhost:5189/teaching-data.html`:
  - 学术服务平台内嵌面板 rendered.
  - Input `demo.libsp.net` generated `/api/openAccess/redirect/history` URL with `agentId`, `modelId`, `searchText`, `internet_search=false`, `datasetList`, and `hd=1,1`.
  - Switching to DeepResearch generated `/api/openAccess/redirect/deep_research_history` URL with `applicationId`, `searchText`, `modeType=exploration`, `retrievalSources`, `promptId`, and `hd=0,1,1`.
  - Desktop metrics: `window.innerWidth=1280`, `documentElement.scrollWidth=1280`.
  - Mobile metrics: `window.innerWidth=390`, `documentElement.scrollWidth=390`.
  - Browser console errors/warnings: none.
- Browser screenshot capture was attempted but timed out in the in-app browser CDP screenshot command; DOM and layout metrics were used for verification.

