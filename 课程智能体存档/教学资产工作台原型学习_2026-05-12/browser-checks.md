# Browser Checks

Target: `http://127.0.0.1:5174/assets.html`

## Desktop
- Page loaded as `Pharmacopilot | 教学资产`.
- Console error check: no browser console errors.
- Verified visible workbench structure: hero CTA, source stats, four-step asset flow, explainable relation graph, filter panel, asset cards, asset manual, reuse action band.
- Verified import panel opens from `导入课程材料`.
- Verified keyword search with `评分` narrows results to the scoring/rubric asset.
- Verified selecting `多维评分记录` updates both `资产说明书` and the relation graph center.
- Verified temporary metadata upload creates a new upload asset, then deleted that temporary asset to keep local browser state clean.
- Verified `基于该资产生成下一步` writes a reusable prompt to clipboard.

## Mobile Width
- Set browser viewport to `390 x 844`.
- Reloaded `/assets.html`.
- Verified relation graph renders as 4 stacked relation nodes.
- Verified asset cards render and reuse action buttons remain accessible.
- Console error check: no browser console errors.
- Reset browser viewport after the check.

## Notes
- Screenshot capture timed out in the in-app browser, so this round records DOM and interaction checks rather than image evidence.
