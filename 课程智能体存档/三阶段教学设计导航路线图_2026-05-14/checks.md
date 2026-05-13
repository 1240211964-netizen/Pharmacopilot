## 静态检查

- `node --check 前端核心/app.js`：通过。
- `git diff --check -- 前端核心/teaching-navigation.html 前端核心/app.js 前端核心/styles.css`：通过。
- `rg -n "地铁图|站点|当前站点|站点说明|站点详情|轨道|线路|Pharmacopilot Line|metro|Metro|route-metro|routeMetro|metroRoute|getMetro|当前所在" 前端核心/teaching-navigation.html 前端核心/app.js 前端核心/styles.css`：无匹配。

## 构建检查

- `npm run build`：通过。

## 浏览器烟测

本地服务：`http://localhost:5173/teaching-navigation.html`

- 页面标题显示“三阶段教学设计导航路线图”。
- 阶段卡显示 3 个阶段：`01-08`、`09-16`、`17-20`，并显示完成数量。
- SVG 渲染 3 条教学推进路径和 3 条浅色阶段 lane。
- 页面渲染 20 个环节，当前环节为 `06`，并显示“当前环节”。
- 关键坐标确认：`01 left:7% top:27%`，`08 left:90% top:27%`，`09 left:90% top:53%`，`16 left:7% top:53%`，`17 left:18% top:78%`，`20 left:90% top:78%`。
- 页面可见文本未出现“地铁图、站点、轨道、线路、Pharmacopilot Line”。
- 点击第二阶段卡后选中 `09`，右侧环节说明卡更新，浏览态不显示 A-F 方案。
- 点击 `06` 后仍为浏览态，点击“进入本环节设计”后进入 training 模式并显示 A-F 方案区。
- 浏览器 console error：无。
