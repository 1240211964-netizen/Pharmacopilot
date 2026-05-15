# 检查记录

- 已执行：`rg -n "三阶段教学设计导航路线图|教学导航路线图" 前端核心 package.json 后端核心 2>/dev/null`
  - 结果：当前源码仅在 `前端核心/teaching-navigation.html` 保留新标题“教学导航路线图”。
- 已执行：`npm run build:static`
  - 结果：通过，静态文件已重新生成。
- 已执行：`rg -n "三阶段教学设计导航路线图|教学导航路线图" dist/teaching-navigation/index.html dist/teaching-navigation.html`
  - 结果：构建产物显示新标题“教学导航路线图”。
