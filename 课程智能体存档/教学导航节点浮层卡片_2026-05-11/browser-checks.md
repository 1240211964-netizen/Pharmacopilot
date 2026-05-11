# Browser Checks

Local target: `http://127.0.0.1:5175/teaching-navigation.html`

## Headless Chrome CDP

```json
{
  "initial": {
    "width": 1440,
    "overflow": 0,
    "layoutColumns": "1308px",
    "mapNodes": 20,
    "stats": 4,
    "popoverInMap": true,
    "popoverOpen": false,
    "popoverDisplay": "none",
    "mapWidth": 1308
  },
  "summary": {
    "open": true,
    "expanded": false,
    "hidden": "false",
    "title": "教学过程、活动序列与评价量规设计",
    "hasTask": true,
    "hasOutput": true,
    "hasExpand": true,
    "optionCards": 0,
    "aboveStats": true
  },
  "expanded": {
    "open": true,
    "expanded": true,
    "optionCards": 6,
    "hasInsight": true,
    "hasEnter": true,
    "hasConfirm": true
  },
  "selected": {
    "stillOpen": true,
    "stillExpanded": true,
    "selectedPrimary": true,
    "primaryBadge": "主方案 B"
  },
  "confirmed": {
    "open": true,
    "expanded": false,
    "currentTitle": "问题情境创设与学习动机激发",
    "progress": "9 / 20"
  },
  "afterEsc": {
    "open": false,
    "display": "none",
    "contentLength": 0
  },
  "mobile": {
    "width": 390,
    "overflow": 0,
    "layoutColumns": "326px",
    "popoverOpen": true,
    "popoverBottomInsideMap": true,
    "hasExpand": true,
    "detailVisible": true
  }
}
```

## Codex Browser

```json
{
  "title": "Pharmacopilot | 教学导航",
  "hasMap": true,
  "hasNodes": true,
  "hasSummaryCardAfterClick": true,
  "hasExpandAfterClick": true,
  "hasCloseAfterClick": true
}
```

## Result

- Initial desktop render: the former left-side detail card is hidden and the route map expands to a full-width stage.
- Node click: opens the map-contained summary popover with node title, status, core question, task, output, close, and expand action.
- Expand action: shows A-F options, scoring/feedback area, enter training, confirm node, and collapse action.
- Option selection: refreshes the scoring state while keeping the popover open and expanded.
- Confirm action: advances the route and keeps the popover open in summary mode for the next node.
- Escape key closes the popover.
- Mobile viewport has no horizontal overflow and keeps the popover inside the map card.
