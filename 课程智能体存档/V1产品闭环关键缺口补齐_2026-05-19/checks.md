# Checks

- `node --check 前端核心/app.js`：通过。
- `npm run build:static`：通过。
- `npm run build`：通过。
- `npm run typecheck`：通过。
- `git diff --check -- 前端核心/app.js 前端核心/styles.css 前端核心/settings.html 前端核心/practice.html`：通过。
- 浏览器冒烟验证：通过。
  - settings 可保存 mock / 空闻道域名，并可重置演示数据。
  - 首页闻道入口显示“未配置机构域名”并跳转配置服务。
  - auth 登录后跳转 dashboard.html。
  - Dashboard 显示当前教师、课程、进度、资产数和服务状态。
  - 教学导航“开始填写任务单”打开真实弹窗，可生成预览、保存资产、推进下一环节。
  - practice.html 可执行泛雅模拟授权、选择课程、生成单项任务、复制、保存实践任务、生成并保存最终方案。
  - teaching-data.html 可读取教学导航和教学实践保存的真实资产。
  - outputs.html 可集中查看产物，Word 导出保持 disabled。
  - dashboard/settings/outputs/teaching-navigation/practice/teaching-data 页面无 404，控制台无 error。
