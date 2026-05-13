## 验证结果

- `node --check 前端核心/app.js`：通过。
- `git diff --check -- 前端核心/app.js`：通过。
- `npm run build`：通过。
- 源码检索确认：
  - `routeMetroLineDefinitions.review` path 为 `M 9 68 C 20 76 37 79 52 80 L 64 80 L 76 80 C 82 80 85 76 89 80`。
- 浏览器验证确认：
  - 页面中 `.route-metro-line-olive` 数量为 1。
  - 页面中 `.route-metro-line` 总数为 5。
  - 橄榄色线路 `d` 属性从 `M 9 68` 开始，对应节点 16 坐标。
