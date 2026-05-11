# After Checks

## node --check 前端核心/app.js

```text
```

## npm run build:static

```text

> pharmacopilot@0.1.0 build:static
> mkdir -p dist/launch dist/flowchart dist/workflow dist/teaching-navigation && cp 前端核心/index.html 前端核心/teaching-navigation.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/workflow.html 前端核心/app.js 前端核心/styles.css 前端核心/interface-review-improved.html 前端核心/flowchart.html dist/ && cp 前端核心/index.html 前端核心/teaching-navigation.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/app.js 前端核心/styles.css dist/launch/ && rm -f dist/launch/workflow.html && cp 前端核心/flowchart.html dist/flowchart/index.html && cp 前端核心/workflow.html dist/workflow/index.html && cp 前端核心/teaching-navigation.html dist/teaching-navigation/index.html

```

## npm run build:server

```text

> pharmacopilot@0.1.0 build:server
> tsc -p 后端核心/tsconfig.server.json

```
