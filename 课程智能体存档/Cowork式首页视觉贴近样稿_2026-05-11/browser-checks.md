# Browser Checks

Local target: `http://127.0.0.1:5175/index.html`

## Codex Browser

- Opened the local homepage in the in-app Browser.
- Verified page title: `Pharmacopilot | 首页`.
- Verified the three feature tabs and default output preview are present in the DOM.

## Headless Chrome CDP

```json
{
  "desktop": {
    "width": 1440,
    "overflow": 0,
    "tabCount": 3,
    "stageFeature": "navigation",
    "stageTop": 818,
    "stageWidth": 1240,
    "heroColumns": "1392px",
    "layoutColumns": "430px 700px",
    "outputTitle": "新手教师 20 环节训练路线",
    "leftCardCount": 3,
    "attachmentCount": 3,
    "activityCount": 4
  },
  "practice": {
    "feature": "practice",
    "title": "SWOT 分析授课工作台"
  },
  "assets": {
    "feature": "assets",
    "title": "SWOT 单元教学资产库",
    "assets": 6
  },
  "highlight": {
    "duringMouseEnter": 2,
    "afterMouseLeave": 0,
    "duringFocus": 2,
    "afterBlur": 0
  },
  "mobile": {
    "width": 390,
    "overflow": 0,
    "tabsColumns": "346px",
    "layoutColumns": "326px",
    "attachmentColumns": "284px",
    "outputVisible": true,
    "ctaCount": 2
  }
}
```

## Result

- Desktop: hero becomes centered product statement, three-function tabs become a light segmented control, and the Cowork demo becomes a wide gradient stage with left dark input cards and right document-style output preview.
- Interactions: `教学导航 / 教学实践 / 教学资产` tabs switch prompt, attachments, activity steps and output preview correctly.
- Attachment linkage: `mouseenter / mouseleave / focus / blur` updates and clears highlighted output cards correctly.
- Mobile: layout collapses to a single column with no horizontal overflow.
