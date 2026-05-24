# Checks

## 结果

- `node --check 前端核心/teaching-navigation-productized.js`: passed
- `git diff --check -- 前端核心/teaching-navigation-productized.js`: passed
- `npm run build:server`: passed
- `npm run build:static`: failed on pre-existing missing static entry files

## `build:static` 阻塞原因

命令在复制旧静态入口时失败，缺失文件包括：

- `前端核心/dashboard.html`
- `前端核心/settings.html`
- `前端核心/outputs.html`
- `前端核心/navigation.html`
- `前端核心/interface-review-improved.html`

这些文件在本轮修改前已经处于删除状态，不是本次追加脚本造成的。

## 补充处理

- 已手动同步 `前端核心/teaching-navigation-productized.js` 到 `dist/teaching-navigation-productized.js`、`dist/launch/teaching-navigation-productized.js`、`dist/teaching-navigation/teaching-navigation-productized.js`。
