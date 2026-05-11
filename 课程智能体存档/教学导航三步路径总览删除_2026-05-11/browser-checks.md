# Browser Checks

Local server: http://127.0.0.1:4175/

## Teaching navigation page

- Opened `/teaching-navigation.html`.
- Cache-busted desktop check `/teaching-navigation.html?v=delete-stage-overview-20260511`:
  - `三步路径总览`: not present.
  - `20 环节教学训练地图`: present once.
- 390px mobile check:
  - `三步路径总览`: not present after reload.
  - Mobile menu button visible.
  - `20 环节教学训练地图`: present once.

## Notes

- A first desktop read hit a cached copy, so the final desktop verification used a query string to force the updated HTML.
