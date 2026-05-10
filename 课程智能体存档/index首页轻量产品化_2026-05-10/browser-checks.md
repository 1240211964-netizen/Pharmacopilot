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
  "hasPreview": true,
  "hasWorkflow": true,
  "loginRegisterHrefOk": true,
  "navTargetsOk": true,
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
      "height": 882
    },
    {
      "selector": ".home-product-preview",
      "present": true,
      "left": 771,
      "top": 137,
      "width": 539,
      "height": 780
    },
    {
      "selector": ".home-core-functions",
      "present": true,
      "left": 130,
      "top": 961,
      "width": 1180,
      "height": 1037
    },
    {
      "selector": ".core-feature-grid",
      "present": true,
      "left": 130,
      "top": 1233,
      "width": 1180,
      "height": 706
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
  "hasPreview": true,
  "hasWorkflow": true,
  "loginRegisterHrefOk": true,
  "navTargetsOk": true,
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
      "height": 1375
    },
    {
      "selector": ".home-product-preview",
      "present": true,
      "left": 14,
      "top": 571,
      "width": 362,
      "height": 869
    },
    {
      "selector": ".home-core-functions",
      "present": true,
      "left": 16,
      "top": 1474,
      "width": 358,
      "height": 1144
    },
    {
      "selector": ".core-feature-grid",
      "present": true,
      "left": 16,
      "top": 1704,
      "width": 358,
      "height": 880
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
- `/teaching-navigation.html` opened successfully but reported horizontal overflow in the automated regression check; this route is outside the home-scoped CSS changed in this iteration.
- `/practice.html` and `/assets.html` opened successfully with no horizontal overflow in the same check.
