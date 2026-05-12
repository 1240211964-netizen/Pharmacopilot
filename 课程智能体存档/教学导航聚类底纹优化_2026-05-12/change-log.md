# Change Log

## Scope

- `前端核心/styles.css`
- `前端核心/teaching-navigation.html`、`前端核心/app.js`、`package.json` 仅做 before/after 留痕对照，本轮未修改。

## Changes

- 当前代码已具备聚类底纹基础样式，本轮在此基础上收口视觉层级。
- 将 `.route-map-stage-zone` 明确压到路线层下方，避免聚类底纹与主路线抢层级。
- 降低基础路线与未解锁路线透明度，强化已完成/当前主路线。
- 提升 `teachingRouteMapSvg` 与 `teachingRouteMapNodes` 的层级，让主路线和节点始终压过点云底纹。
- 保留三阶段叙事、阶段 pill、节点坐标、节点说明态与训练流程，不改任何节点数据。

## Rollback

如需回滚本轮改造，可将 `before/` 目录下对应文件复制回项目根目录：

- `before/前端核心/styles.css` -> `前端核心/styles.css`
- `before/前端核心/teaching-navigation.html` -> `前端核心/teaching-navigation.html`
- `before/前端核心/app.js` -> `前端核心/app.js`
- `before/package.json` -> `package.json`
