# Browser Checks

Date: 2026-05-12

Local server: `PORT=5174 npm start`

## In-App Browser

- Opened `http://localhost:5174/teaching-navigation.html`.
- Confirmed initial map state: 20 route nodes, 3 stage zones, 3 stage pills, and no visible node detail card.
- Clicked a stage pill: node explanation card opened in explanation mode, showing “为什么存在 / 需要输入什么 / 生成什么 / 如何合格”; A-F options were not shown before training.
- Clicked the current node and then “开始本环节训练”: A-F options, AI draft, scoring diagnosis, and confirm action appeared in the same card.
- Clicked “确认本环节”: progress advanced from node 01 to node 02, stats updated to `已完成 1 / 进行中 1 / 可进入 2 / 待解锁 16`, and the card returned to the next node explanation state with a recommendation message.

## Responsive / Rendering Checks

- Captured Chrome headless screenshots:
  - `browser/teaching-navigation-1280.png`
  - `browser/teaching-navigation-768.png`
  - `browser/teaching-navigation-375.png`
  - `browser/teaching-navigation-768-tall.png`
  - `browser/teaching-navigation-375-tall.png`
- CDP viewport smoke check:

```json
[
  {
    "width": 500,
    "height": 2313,
    "scrollWidth": 500,
    "clientWidth": 500,
    "overflowX": false,
    "stageZones": 3,
    "nodes": 20,
    "stageBeforeHasCircleDots": false,
    "detailInitiallyVisible": false
  },
  {
    "width": 768,
    "height": 1713,
    "scrollWidth": 768,
    "clientWidth": 768,
    "overflowX": false,
    "stageZones": 3,
    "nodes": 20,
    "stageBeforeHasCircleDots": false,
    "detailInitiallyVisible": false
  },
  {
    "width": 1280,
    "height": 813,
    "scrollWidth": 1280,
    "clientWidth": 1280,
    "overflowX": false,
    "stageZones": 3,
    "nodes": 20,
    "stageBeforeHasCircleDots": false,
    "detailInitiallyVisible": false
  }
]
```

- Computed style check confirmed `.route-map-stage-zone::before` now renders layered radial contour lines and no longer contains `circle at` particle-dot backgrounds.
