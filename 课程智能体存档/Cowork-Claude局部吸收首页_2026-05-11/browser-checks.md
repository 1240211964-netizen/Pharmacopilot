# Browser Checks

Base URL: http://localhost:5180

Browser: local Google Chrome via Playwright executablePath

## desktop index
```json
{
  "name": "desktop index",
  "route": "/index.html",
  "viewport": {
    "width": 1440,
    "height": 1000
  },
  "title": "Pharmacopilot | 首页",
  "overflow": false,
  "hasHero": true,
  "hasAgentWorkbench": true,
  "hasTaskWorkbench": true,
  "forbiddenCopyAbsent": true,
  "loginRegisterHrefOk": true,
  "ctaHrefOk": true,
  "tabCount": 5,
  "initialActiveTabOk": true,
  "rubricClickOk": true,
  "assetsClickOk": true,
  "agentVisibleInFirstViewport": true,
  "rects": [
    {
      "selector": ".site-header",
      "present": true,
      "left": 0,
      "top": 0,
      "width": 1440,
      "height": 79
    },
    {
      "selector": ".hero-split",
      "present": true,
      "left": 130,
      "top": 79,
      "width": 1180,
      "height": 915
    },
    {
      "selector": ".home-agent-workbench",
      "present": true,
      "left": 685,
      "top": 137,
      "width": 625,
      "height": 803
    },
    {
      "selector": ".home-task-workbench",
      "present": true,
      "left": 130,
      "top": 994,
      "width": 1180,
      "height": 726
    },
    {
      "selector": ".home-task-layout",
      "present": true,
      "left": 187,
      "top": 1204,
      "width": 1066,
      "height": 451
    }
  ]
}
```

## mobile index
```json
{
  "name": "mobile index",
  "route": "/index.html",
  "viewport": {
    "width": 390,
    "height": 920
  },
  "title": "Pharmacopilot | 首页",
  "overflow": false,
  "hasHero": true,
  "hasAgentWorkbench": true,
  "hasTaskWorkbench": true,
  "forbiddenCopyAbsent": true,
  "loginRegisterHrefOk": true,
  "ctaHrefOk": true,
  "tabCount": 5,
  "initialActiveTabOk": true,
  "rubricClickOk": true,
  "assetsClickOk": true,
  "agentVisibleInFirstViewport": true,
  "rects": [
    {
      "selector": ".site-header",
      "present": true,
      "left": 0,
      "top": 0,
      "width": 390,
      "height": 99
    },
    {
      "selector": ".hero-split",
      "present": true,
      "left": 14,
      "top": 99,
      "width": 362,
      "height": 2107
    },
    {
      "selector": ".home-agent-workbench",
      "present": true,
      "left": 14,
      "top": 728,
      "width": 362,
      "height": 1444
    },
    {
      "selector": ".home-task-workbench",
      "present": true,
      "left": 16,
      "top": 2206,
      "width": 358,
      "height": 1366
    },
    {
      "selector": ".home-task-layout",
      "present": true,
      "left": 17,
      "top": 2461,
      "width": 356,
      "height": 1070
    }
  ]
}
```

## route /teaching-navigation.html
```json
{
  "name": "route /teaching-navigation.html",
  "route": "/teaching-navigation.html",
  "status": "complete",
  "title": "Pharmacopilot | 教学导航",
  "bodyLength": 3108,
  "overflow": true
}
```

## route /practice.html
```json
{
  "name": "route /practice.html",
  "route": "/practice.html",
  "status": "complete",
  "title": "Pharmacopilot | 教学实践",
  "bodyLength": 576,
  "overflow": false
}
```

## route /assets.html
```json
{
  "name": "route /assets.html",
  "route": "/assets.html",
  "status": "complete",
  "title": "Pharmacopilot | 教学资产",
  "bodyLength": 720,
  "overflow": false
}
```

## Notes

- `/index.html` desktop and 390px mobile checks passed with no horizontal overflow.
- Agent 工作台在桌面和 390px 移动端首屏内可见。
- 首页任务 tab 点击切换通过：Rubric 与教学资产面板均能更新。
- 禁止文案检查通过：页面正文未出现 `7个核心环节`、`Scheduled Tasks`、`插件体系`、`手机派发`。
- `/teaching-navigation.html` opened successfully but still reports horizontal overflow; this is an existing route-level layout issue outside this home-page iteration.
- `/practice.html` and `/assets.html` opened successfully with no horizontal overflow in this check.
