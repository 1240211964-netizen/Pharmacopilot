## 验证结果

- `node --check 前端核心/app.js`：通过。
- `git diff --check -- 前端核心/app.js`：通过。
- `npm run build`：通过。
- 浏览器验证：
  - `.route-metro-line` 数量仍为 5。
  - `.route-metro-line-olive` 的 `d` 为 `M 9 68 C 12 75 18 80 28 80 L 49 80 L 70 80 C 80 80 84 76 89 80`。
  - 节点 17–20 的实际 style 分别为：
    - 17：`left:28%; top:80%`
    - 18：`left:49%; top:80%`
    - 19：`left:70%; top:80%`
    - 20：`left:89%; top:80%`
