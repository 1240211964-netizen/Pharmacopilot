# 检查记录

- `rg -n "课程主干：管理学原理|示例位置：计划与决策 / SWOT|教师确认：来源边界与质量诊断|course-asset-hero-meta" 前端核心/teaching-data.html`：无匹配。
- `npm run build:static`：通过。
- `rg -n "课程主干：管理学原理|示例位置：计划与决策 / SWOT|教师确认：来源边界与质量诊断|course-asset-hero-meta" dist/teaching-data.html dist/assets.html dist/launch/assets.html`：无匹配。
- `git diff --check -- 前端核心/teaching-data.html`：通过。
