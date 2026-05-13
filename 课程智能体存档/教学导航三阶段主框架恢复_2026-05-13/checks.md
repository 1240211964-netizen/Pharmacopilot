## 自动验证

- `node --check 前端核心/app.js`：通过。
- `git diff --check -- 前端核心/app.js 前端核心/styles.css 前端核心/teaching-navigation.html`：通过。
- `npm run build`：通过。
- `curl -I http://localhost:5173/teaching-navigation.html`：返回 `HTTP/1.1 200 OK`。

## 浏览器验证

- 阶段 Tab 数量为 3：
  - `课前教学设计与准备 01–08`
  - `课中教学实施与调控 09–16`
  - `课后评价反馈与持续改进 17–20`
- 当前阶段显示为 `课前教学设计与准备`。
- 地图 SVG 中：
  - `.route-metro-line` 数量为 5。
  - `.route-stage-island` 数量为 3。
- 初始右侧说明卡显示 `课前教学设计与准备 · 06`，元信息显示 `线路分组：目标设计`。
- 浏览状态下 `.option-grid` 数量为 0。
- 点击第二阶段 Tab 后，右侧说明卡切换到 `课中教学实施与调控 · 09`，选中节点为 09。
- 返回节点 06 并点击“开始本环节训练”后，右侧出现 `A-F option set / 方案选择区`。
