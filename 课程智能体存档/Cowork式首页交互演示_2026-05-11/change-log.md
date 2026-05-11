# 修改日志

## 计划

- 存档修改前 `前端核心/index.html`、`前端核心/app.js`、`前端核心/styles.css`、`package.json`。
- 记录修改前检查结果。
- 在首页首屏工作台加入三功能 Tab 与 Cowork 式输入/输出演示。
- 在 `app.js` 新增结构化首页演示数据与渲染逻辑。
- 在 `styles.css` 增加首页 Cowork 演示区、三功能 Tab、附件联动、输出预览和响应式样式。
- 记录修改后检查和浏览器检查，提交并推送 GitHub。

## 结果

- 已将首页首屏右侧 `home-agent-workbench` 改造为 Cowork 式三功能交互演示区。
- 新增 `教学导航 / 教学实践 / 教学资产` 三个功能 Tab，切换时同步刷新 Prompt、Attachments、Agent Activity 与 Output Preview。
- `app.js` 新增 `HOME_FEATURE_DEMOS` 结构化数据与首页演示渲染逻辑，避免把三类演示内容散落硬编码在事件处理中。
- 附件卡支持 hover/focus 联动右侧输出高亮，mouseleave/blur 后恢复默认状态。
- 右侧输出按功能展示三类预览：20 环节导航路线、实践工作台与 Rubric、教学资产库与复用入口。
- CSS 新增 Cowork 演示区、深色输入区、浅色输出区、三功能 Tab、附件联动和移动端单列响应式样式。
- 已复制修改前后代码、记录 prompt、构建检查和浏览器检查。

## 检查

- `node --check 前端核心/app.js`：通过。
- `npm run build:static`：通过。
- `npm run build:server`：通过。
- 浏览器检查 `index.html`：三功能切换、内容同步、附件 hover/focus 联动、CTA 链接保持、桌面/移动端无横向溢出均通过。
