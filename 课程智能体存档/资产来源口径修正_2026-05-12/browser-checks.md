# Browser Checks

Local server: `python3 -m http.server 8765` from `前端核心/`.

Checked `/assets.html` in the in-app browser.

- Source filter rendered as: `全部 / 教学实践 / 教师上传 / 泛雅同步 / 系统示例`.
- Source filter no longer contained `教学导航`.
- First asset card displayed `系统示例` as the source.
- First asset card no longer contained legacy `教学导航` copy from localStorage.
- Hero stats label changed from `教学导航训练报告` to `新手教程记录`.
- Particle graph controls rendered after reload: `全部20 / 智能体生成0 / 新手教程5 / 上传知识库0 / 泛雅记录0 / 课程2 / 标签8 / 来源边界4`.
- Particle graph KPI rendered: `20节点 / 41关系 / 0知识库`.
- Particle graph detail rendered `来源：系统示例` and `节点说明：新手教程 · 系统示例`.
- Browser logs showed no errors.
