# 教学导航 v3 泛化补丁

用户要求只做 v3 泛化补丁，不重新设计、不新增页面。使用 `/Users/yandilei/Downloads/teaching-navigation-v3-generalized-patch-final.zip` 中 3 个文件覆盖当前项目同名文件：

- `teaching-navigation.html`
- `teaching-navigation-productized.css`
- `teaching-navigation-productized.js`

禁止修改 `teaching-navigation-contract.js`、`styles.css`、`app.js`、`index.html`、`practice.html`、`teaching-data.html`、`pharmacopilot-design-system.css`、顶部全站导航结构和 10 环节地图基本结构。

本轮目标是将第 1 站“教学定位模拟器”的交互范式泛化到第 2-10 站，统一为“看证据 -> 做判断 -> 生成产物”，并确保每站可选择判断、生成产物、保存资产、进入下一站，浏览器控制台不出现 JS 报错。
