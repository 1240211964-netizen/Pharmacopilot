当前项目页面在 Chrome 中频繁出现 “Aw, Snap! 错误代码：5”，疑似前端页面导致浏览器渲染进程崩溃。请系统排查并修复：

1. 检查 React 组件中 useEffect、setState、setInterval、requestAnimationFrame 导致的无限渲染循环或内存泄漏。
2. 检查 Framer Motion 动画，尤其是 repeat: Infinity、whileHover、layout 动画是否过多或未做性能限制。
3. 检查页面中过大的背景视频、大图、复杂 SVG、Canvas、Three.js 或 WebGL 渲染模块。
4. 临时移除或降级高成本 CSS 效果，包括 backdrop-blur、blur-3xl、mix-blend-mode、大面积 shadow、复杂渐变背景。
5. 检查组件卸载时是否清理 interval、timeout、requestAnimationFrame、事件监听器和 WebGL/canvas 资源。
6. 保持当前视觉风格基本不变，但改造成性能安全版本：减少无限动画、压缩资源、拆分重组件、懒加载非首屏模块。
7. 输出具体修改文件、修改原因，并确保 npm run build 可以通过。
