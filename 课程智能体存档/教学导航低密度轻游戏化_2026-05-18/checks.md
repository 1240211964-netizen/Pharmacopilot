# Checks

- `node --check 前端核心/app.js`：通过。
- `node --check 后端核心/启动入口/server.cjs`：通过。
- `npm run build`：通过。
- `rg -n "route-progress-strip|route-more-options|route-generated-summary" dist/app.js dist/styles.css`：确认构建产物包含 summary strip、更多方案折叠与生成摘要。
- Chrome headless 截图：`after/teaching-navigation-preview.png`。截图确认首屏可看到路线区，节点默认不显示 reward/progress，页面密度下降。
- Chrome CDP 交互检查：训练态 `moreOptionsClosed=true`，`visibleRewardCount=0`，`visibleMeterCount=0`，`hasInsightExpandedByDefault=false`，`progressStrip=true`。

