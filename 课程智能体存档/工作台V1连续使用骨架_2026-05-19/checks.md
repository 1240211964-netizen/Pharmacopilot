# Checks

- `node --check 前端核心/app.js` passed.
- `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package json ok')"` passed.
- `npm run build:static` passed.
- `npm run build:server` passed.
- `npm run build` passed.
- `npm run typecheck` passed.
- `git diff --check -- 前端核心/app.js 前端核心/styles.css 前端核心/index.html 前端核心/auth.html 前端核心/practice.html 前端核心/teaching-data.html 前端核心/dashboard.html 前端核心/settings.html 前端核心/outputs.html 后端核心/src/http-utils.ts package.json` passed.

## Browser Smoke

Local server: `http://localhost:5188`

- Home: shared nav shows 首页 / 工作台 / 教学导航 / 教学实践 / 教学数据; “查看工作台” CTA exists; 未配置闻道提示 visible.
- Auth: local demo login redirects to `dashboard.html`; dashboard shows current teacher, course, progress, practice status, service status, and four primary actions.
- Teaching navigation: “开始填写任务单” opens a fillable task sheet; save shows saved task sheet state and教学资产 message.
- Teaching data: course graph loads; 闻道未配置提示 visible; empty iframe hidden; node panel can show saved navigation/practice assets or empty action state.
- Practice: V1 section exists; generated classroom task, rubric, final plan; 泛雅 boundary states no real write; save-to-asset button available.
- Outputs: output summary page lists generated results; detail supports copy/download Markdown/save-to-assets; Word export is disabled.
- Layout smoke at 1280px: dashboard, teaching-navigation, practice, teaching-data, outputs, settings all reported no horizontal overflow and 5 shared nav links.
- Browser console smoke: no severe errors captured during the checked pages.
