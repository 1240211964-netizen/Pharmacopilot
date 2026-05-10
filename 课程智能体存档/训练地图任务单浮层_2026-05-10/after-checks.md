# After Checks

时间：2026-05-10 22:05:00 CST

## node --check 前端核心/app.js
exit=0

## npm run build:static

> pharmacopilot@0.1.0 build:static
> mkdir -p dist/launch dist/flowchart dist/workflow dist/teaching-navigation && cp 前端核心/index.html 前端核心/teaching-navigation.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/workflow.html 前端核心/app.js 前端核心/styles.css 前端核心/interface-review-improved.html 前端核心/flowchart.html dist/ && cp 前端核心/index.html 前端核心/teaching-navigation.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/app.js 前端核心/styles.css dist/launch/ && rm -f dist/launch/workflow.html && cp 前端核心/flowchart.html dist/flowchart/index.html && cp 前端核心/workflow.html dist/workflow/index.html && cp 前端核心/teaching-navigation.html dist/teaching-navigation/index.html

exit=0

## npm run build:server

> pharmacopilot@0.1.0 build:server
> tsc -p 后端核心/tsconfig.server.json

exit=0
