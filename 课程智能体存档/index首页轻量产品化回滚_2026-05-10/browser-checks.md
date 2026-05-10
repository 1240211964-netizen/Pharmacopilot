# Browser Checks

Base URL: http://localhost:5180

Browser: local Google Chrome via Playwright executablePath

## desktop index rollback
```json
{
  "name": "desktop index rollback",
  "route": "/index.html",
  "viewport": {
    "width": 1440,
    "height": 1000
  },
  "title": "Pharmacopilot | 首页",
  "overflow": false,
  "hasRolledBackHero": true,
  "hasCoreFunctions": true,
  "removedProductPreview": true,
  "topLoginRegisterOk": true,
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
      "height": 419
    },
    {
      "selector": ".home-product-preview",
      "present": false
    },
    {
      "selector": ".home-core-functions",
      "present": true,
      "left": 130,
      "top": 498,
      "width": 1180,
      "height": 880
    },
    {
      "selector": ".core-feature-grid",
      "present": true,
      "left": 130,
      "top": 688,
      "width": 1180,
      "height": 631
    }
  ]
}
```

## mobile index rollback
```json
{
  "name": "mobile index rollback",
  "route": "/index.html",
  "viewport": {
    "width": 390,
    "height": 920
  },
  "title": "Pharmacopilot | 首页",
  "overflow": false,
  "hasRolledBackHero": true,
  "hasCoreFunctions": true,
  "removedProductPreview": true,
  "topLoginRegisterOk": true,
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
      "height": 428
    },
    {
      "selector": ".home-product-preview",
      "present": false
    },
    {
      "selector": ".home-core-functions",
      "present": true,
      "left": 16,
      "top": 527,
      "width": 358,
      "height": 1106
    },
    {
      "selector": ".core-feature-grid",
      "present": true,
      "left": 16,
      "top": 719,
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

- `/index.html` desktop and 390px mobile checks confirm rollback hero and core-function section are restored.
- `/teaching-navigation.html` opened successfully but still reports horizontal overflow; this is an existing route-level layout issue outside the rollback target.
- `/practice.html` and `/assets.html` opened successfully with no horizontal overflow in this check.
