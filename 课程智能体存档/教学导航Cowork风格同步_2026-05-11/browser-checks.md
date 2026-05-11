# Browser Checks

Local target: `http://127.0.0.1:5175/teaching-navigation.html`

## Headless Chrome CDP

```json
{
  "desktop": {
    "width": 1440,
    "overflow": 0,
    "title": "把教学导航变成可执行的 20 环节训练路线",
    "stageCards": 3,
    "mapNodes": 20,
    "stats": 4,
    "layoutColumns": "430px 852px",
    "detailOrder": "-1",
    "stageBg": true,
    "mapHeight": 720,
    "detailBg": "rgb(21, 19, 17)"
  },
  "clickNode": {
    "selected": true,
    "detailTitle": "教学过程、活动序列与评价量规设计",
    "optionCards": 6
  },
  "mobile": {
    "width": 390,
    "overflow": 0,
    "stageCards": 3,
    "layoutColumns": "326px",
    "tabsColumns": "346px",
    "mapHeight": 1250,
    "mapNodes": 20,
    "detailVisible": true
  }
}
```

## Codex Browser

```json
{
  "title": "Pharmacopilot | 教学导航",
  "hasHero": true,
  "hasStageOverview": true,
  "hasMap": true,
  "hasDetail": true
}
```

## Result

- Desktop: teaching navigation now uses the same centered hero, segmented stage overview, and large gradient Cowork stage as the updated homepage.
- Layout: the selected-node workbench is the left dark panel, and the 2.5D map is the right main preview.
- Interaction: clicking a route node updates selected state and the detail workbench.
- Mobile: the page collapses to one column with no horizontal overflow.
