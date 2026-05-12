# Browser Checks

Local server: `python3 -m http.server 8765` from `前端核心/`.

Checked `/assets.html` in the in-app browser.

Desktop stability
- Before simulated drag/pointer movement, graph KPI rendered: `20节点 / 41关系 / 0知识库`.
- Before simulated drag/pointer movement, graph filters rendered: `全部20 / 智能体生成0 / 新手教程5 / 上传知识库0 / 泛雅记录0 / 课程2 / 标签8 / 来源边界4`.
- Simulated repeated pointer movement across the graph area.
- After simulated drag/pointer movement, graph KPI and filters stayed unchanged.
- Graph detail stayed synchronized with the selected asset: `新手教程 · 系统示例`.
- Browser logs showed no errors.

Responsive check
- Temporarily set viewport to `390 x 844`.
- Canvas remained visible.
- Graph KPI rendered at mobile width.
- First graph filters rendered at mobile width.
- Reset browser viewport after check.

Visual note
- Desktop screenshot after the change showed the graph no longer accumulating dragged-out selected labels; selected-node information stays in the right inspector.
