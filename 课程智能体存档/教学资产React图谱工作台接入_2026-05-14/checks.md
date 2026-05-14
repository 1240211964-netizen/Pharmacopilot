# Checks

## Before

### node --check 前端核心/app.js
```text
exit: 0
```

### npm run build:static
```text

> pharmacopilot@0.1.0 build:static
> mkdir -p dist/launch dist/flowchart dist/workflow dist/teaching-navigation && cp 前端核心/index.html 前端核心/auth.html 前端核心/teaching-navigation.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/workflow.html 前端核心/app.js 前端核心/styles.css 前端核心/interface-review-improved.html 前端核心/flowchart.html dist/ && cp 前端核心/index.html 前端核心/auth.html 前端核心/teaching-navigation.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/app.js 前端核心/styles.css dist/launch/ && rm -f dist/launch/workflow.html && cp 前端核心/flowchart.html dist/flowchart/index.html && cp 前端核心/workflow.html dist/workflow/index.html && cp 前端核心/teaching-navigation.html dist/teaching-navigation/index.html

exit: 0
```

### npm run build:server
```text

> pharmacopilot@0.1.0 build:server
> tsc -p 后端核心/tsconfig.server.json

exit: 0
```

## After

### node --check 前端核心/app.js
```text
exit: 0
```

### npm run build:static
```text

> pharmacopilot@0.1.0 build:static
> mkdir -p dist/launch dist/flowchart dist/workflow dist/teaching-navigation && cp 前端核心/index.html 前端核心/auth.html 前端核心/teaching-navigation.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/workflow.html 前端核心/app.js 前端核心/styles.css 前端核心/interface-review-improved.html 前端核心/flowchart.html dist/ && cp 前端核心/index.html 前端核心/auth.html 前端核心/teaching-navigation.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/app.js 前端核心/styles.css dist/launch/ && rm -f dist/launch/workflow.html && cp 前端核心/flowchart.html dist/flowchart/index.html && cp 前端核心/workflow.html dist/workflow/index.html && cp 前端核心/teaching-navigation.html dist/teaching-navigation/index.html

exit: 0
```

### npm run build:server
```text

> pharmacopilot@0.1.0 build:server
> tsc -p 后端核心/tsconfig.server.json

exit: 0
```

### npm run typecheck
```text

> pharmacopilot@0.1.0 typecheck
> tsc -p 后端核心/tsconfig.server.json --noEmit && tsc -p tsconfig.json --noEmit

exit: 0
```

### npm run build
```text

> pharmacopilot@0.1.0 build
> npm run build:static && npm run build:server


> pharmacopilot@0.1.0 build:static
> mkdir -p dist/launch dist/flowchart dist/workflow dist/teaching-navigation && cp 前端核心/index.html 前端核心/auth.html 前端核心/teaching-navigation.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/workflow.html 前端核心/app.js 前端核心/styles.css 前端核心/interface-review-improved.html 前端核心/flowchart.html dist/ && cp 前端核心/index.html 前端核心/auth.html 前端核心/teaching-navigation.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/app.js 前端核心/styles.css dist/launch/ && rm -f dist/launch/workflow.html && cp 前端核心/flowchart.html dist/flowchart/index.html && cp 前端核心/workflow.html dist/workflow/index.html && cp 前端核心/teaching-navigation.html dist/teaching-navigation/index.html


> pharmacopilot@0.1.0 build:server
> tsc -p 后端核心/tsconfig.server.json

exit: 0
```

### lint / Tailwind scripts
```text
Lifecycle scripts included in pharmacopilot@0.1.0:
  start
    node 后端核心/启动入口/server.cjs
available via `npm run-script`:
  dev
    node 后端核心/启动入口/server.cjs
  build
    npm run build:static && npm run build:server
  build:server
    tsc -p 后端核心/tsconfig.server.json
  start:static
    node 后端核心/启动入口/server.cjs
  build:static
    mkdir -p dist/launch dist/flowchart dist/workflow dist/teaching-navigation && cp 前端核心/index.html 前端核心/auth.html 前端核心/teaching-navigation.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/workflow.html 前端核心/app.js 前端核心/styles.css 前端核心/interface-review-improved.html 前端核心/flowchart.html dist/ && cp 前端核心/index.html 前端核心/auth.html 前端核心/teaching-navigation.html 前端核心/navigation.html 前端核心/practice.html 前端核心/assets.html 前端核心/app.js 前端核心/styles.css dist/launch/ && rm -f dist/launch/workflow.html && cp 前端核心/flowchart.html dist/flowchart/index.html && cp 前端核心/workflow.html dist/workflow/index.html && cp 前端核心/teaching-navigation.html dist/teaching-navigation/index.html
  typecheck
    tsc -p 后端核心/tsconfig.server.json --noEmit && tsc -p tsconfig.json --noEmit

No lint or Tailwind script is defined in package.json; no Tailwind build chain is present in this static page project.
```
