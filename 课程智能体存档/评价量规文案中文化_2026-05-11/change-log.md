# Change Log

## Summary
- 将用户可见的英文评价术语统一替换为中文表达：`评价量规`、`评分标准`、`评价维度`。
- 保留内部函数名、数据键、API mode 和 `/api/generate/rubric` 路径，避免破坏现有前后端绑定。
- 额外覆盖 `flowchart.html` 中的可见流程图文本，防止静态构建页仍出现旧术语。

## Files Changed
- `前端核心/index.html`
- `前端核心/navigation.html`
- `前端核心/practice.html`
- `前端核心/assets.html`
- `前端核心/interface-review-improved.html`
- `前端核心/flowchart.html`
- `前端核心/app.js`
- `后端核心/src/generation.ts`

## Validation
- 改造前检查结果见 `before-checks.md`。
- 改造后检查结果见 `after-checks.md`。
- 浏览器与移动端可见文本检查见 `browser-checks.md`。
