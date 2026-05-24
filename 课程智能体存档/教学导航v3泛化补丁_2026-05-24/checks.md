# 验收记录

## 静态检查

- `node --check 前端核心/teaching-navigation-productized.js`：通过。
- 自定义源码断言：通过。
  - 包含 1-10 站目标标题。
  - 包含 `01 看证据`、`02 做判断`、`03 生成产物`。
  - 包含判断选项绑定、生成、保存、下一站按钮入口。
  - 未发现 `后台质控`、`Agent 分工`、`评分规则`。
- `git diff --check -- 前端核心/teaching-navigation.html 前端核心/teaching-navigation-productized.css 前端核心/teaching-navigation-productized.js`：通过。

## 构建检查

- `npm run build:server`：通过。
- `npm run build:static`：未通过，阻断于既有缺失 legacy 文件：
  - `前端核心/dashboard.html`
  - `前端核心/settings.html`
  - `前端核心/outputs.html`
  - `前端核心/navigation.html`
  - `前端核心/interface-review-improved.html`

该阻断不是本轮 v3 三文件补丁引入。

## 浏览器验收

测试地址：`http://127.0.0.1:5173/teaching-navigation.html`

- 第 1 站显示 `教学定位模拟器`，可选择定位、生成、保存、进入下一站。
- 第 2 站显示 `学情诊断模拟器`，可选择判断、生成、保存、进入下一站。
- 第 3 站显示 `目标证据生成器`，可选择判断、生成、保存、进入下一站。
- 第 4 站显示 `内容问题链生成器`，可选择判断、生成、保存、进入下一站。
- 第 5 站显示 `案例证据筛选器`，可选择判断、生成、保存、进入下一站。
- 第 6 站显示 `课堂时间编排器`，可选择判断、生成、保存、进入下一站。
- 第 7 站显示 `探究任务组织器`，可选择判断、生成、保存、进入下一站。
- 第 8 站显示 `即时反馈触发器`，可选择判断、生成、保存、进入下一站。
- 第 9 站显示 `评价量规校准器`，可选择判断、生成、保存、进入下一站。
- 第 10 站显示 `复盘资产沉淀器`，可选择判断、生成、保存。
- 第 2-10 站均显示 `01 看证据`、`02 做判断`、`03 生成产物`。
- 每站选择判断后，同模块内出现反馈或产物预览状态。
- 每站点击生成后，产物草稿包含依据与后续设计约束。
- 页面可见文本中未出现旧的 `教学判断题`、`系统反馈` 分裂体验。
- 浏览器开发日志未发现 error / exception / TypeError / ReferenceError / SyntaxError。
