## 验证结果

- `git diff --check -- 前端核心/teaching-navigation.html`：通过。
- 旧命名检索：
  - `20 环节教学地铁图`：无匹配。
  - `把教学导航升级为教学地铁图`：无匹配。
  - `Teaching metro map`：无匹配。
  - `Pharmacopilot metro`：无匹配。
- `npm run build`：通过。
- `curl http://localhost:5173/teaching-navigation.html` 可见：
  - `新教师教学能力进阶路线图`
  - `20 环节教学能力进阶路线图`
