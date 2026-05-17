# PharmacoPilot 设计规范入口

本目录用于约束 `前端核心/` 下所有静态页面的视觉与交互设计。

## 规范优先级

1. `index首页设计规范.md` 是当前全站视觉基准。
2. `全站网页设计约束.md` 说明其他页面如何继承、变体和禁用偏离。
3. `index-design-tokens.css` 是可复用 token 附录，供后续页面迁移或抽取设计变量时使用。

## 使用规则

任何新增页面或页面重构，先打开：

- `设计规范/index首页设计规范.md`
- `设计规范/全站网页设计约束.md`

再决定页面自己的结构和组件。

如果页面确实需要偏离首页风格，必须能说明：

- 偏离的是哪一类规则。
- 为什么该页面场景需要偏离。
- 是否仍保留字体、色彩、导航、按钮、输出面板和四页信息架构的核心识别点。

## 当前受约束页面

- `前端核心/index.html`
- `前端核心/teaching-navigation.html`
- `前端核心/practice.html`
- `前端核心/teaching-data.html`
- `前端核心/auth.html`
- `前端核心/workflow.html`
- `前端核心/flowchart.html`
- `前端核心/navigation.html`
- `前端核心/interface-review-improved.html`
