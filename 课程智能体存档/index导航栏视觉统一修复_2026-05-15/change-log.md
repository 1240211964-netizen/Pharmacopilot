# index 导航栏视觉统一修复

- 确认 `index.html` 的导航 HTML 结构已经与 `teaching-navigation.html` 一致。
- 定位未统一原因：`前端核心/styles.css` 中 `body[data-page="home"]` 仍覆盖了首页 header、topbar、brand、nav link 和 CTA 的视觉样式。
- 在 CSS 末尾追加首页 header 专项纠偏规则，让首页导航栏使用与站点共享导航一致的 topbar、品牌、导航项、CTA 和移动端菜单样式。
- 保留首页主体区域、hero、任务输入框和三功能展示的原有视觉，不做整页重设计。
