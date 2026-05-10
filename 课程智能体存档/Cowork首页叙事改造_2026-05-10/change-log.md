# 修改日志

## 计划

- 归档修改前 `前端核心/index.html`、`前端核心/styles.css`、`前端核心/app.js`。
- 首页首屏改为 Cowork 式任务执行叙事，保留现有导航、登录和注册链接。
- 新增任务执行面板：Prompt、Attachments、Agent Activity、Output Preview。
- 首页中段改为“教师日常教学任务工作台”，提供可切换任务卡。
- 首页下段新增可信边界与规划中能力提示。
- 首页样式全部限制在 `body[data-page="home"]` 下。
- 修改后运行 `node --check`、`npm run build:static`、`npm run build:server`，并做浏览器检查。

## 结果

- 已将首页首屏改造为 Cowork 式任务派发与执行预览，保留顶部导航、登录和注册链接。
- 已新增 Prompt、Attachments、Agent Activity、Output Preview 四块任务执行面板。
- 已将首页中段改为“教师日常教学任务工作台”，支持 5 类任务切换：教学导航、课程资源、评价量规、复盘报告、教学资产。
- 已新增可信边界区域，明确泛雅模拟、教师确认、来源边界和教学资产沉淀。
- 已将周期性复盘、移动端任务派发和教学插件体系标注为规划中能力，不作为当前已实现承诺。
- 首页新增样式全部限制在 `body[data-page="home"]` 作用域内；没有新增后端接口或独立页面。
- 修改后检查通过：`node --check 前端核心/app.js`、`npm run build:static`、`npm run build:server`。
- 已完成本地浏览器烟测和路由回归检查，并归档修改前后代码。
