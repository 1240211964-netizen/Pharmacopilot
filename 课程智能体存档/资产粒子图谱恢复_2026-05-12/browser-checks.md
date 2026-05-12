# Browser Checks

Local server: `python3 -m http.server 8765` from `前端核心/`.

Desktop `/assets.html`
- Canvas rendered as the particle graph and was visible in the in-app browser.
- Graph KPI panel rendered: `19 节点 / 40 关系 / 0 知识库`.
- Graph filters rendered: 全部、智能体生成、导航训练、上传知识库、泛雅记录、课程、标签、来源边界.
- Clicking an asset card updated the graph detail panel and the right-side asset manual.
- Clicking the canvas selected the nearest particle node and kept the asset manual synchronized.
- Graph filter button click changed the active graph filter without changing the workbench asset filters.
- Desktop screenshot confirmed nonblank particle rendering, legend, KPI chips, and node detail panel.

Mobile `390 x 844`
- Canvas remained visible.
- KPI panel rendered.
- Asset cards remained clickable.
- Asset manual updated after selecting a card.
- DOM snapshot showed no horizontal scrollbar text; no overlap was observed in the inspected visible DOM state.

Notes
- Hover tooltip code path remains bound to canvas `pointermove`; the in-app browser automation did not reliably trigger a hover tooltip capture.
- Mobile screenshot capture timed out in the browser tool after the DOM checks passed.
