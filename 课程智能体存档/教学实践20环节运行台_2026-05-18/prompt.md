用户要求改造 Pharmacopilot 的「教学实践 practice 页面」。

核心判断：
- 不要把 20 个教学环节改造成 20 个真实 Agent。
- 20 个环节是教学实践流程中的状态节点，不是 20 个独立智能体。
- 底层只保留少数专业 Agent：Director、Practice Agent、Rubric Agent、Evidence Agent、Asset Agent。

页面目标：
- 改造成「20 环节教学实践运行台」。
- 教师进入页面后应能看清当前 STEP、负责 Agent、证据缺口、教师确认、已形成产物、Director 下一步调度对象。

边界：
- 不新增 20 个真实 Agent。
- 不在左侧放 20 个 Agent 卡片。
- 不改成游戏化地图。
- 不新增左侧导航栏，保留顶部导航。
- 不把 SWOT 泛化到所有模块。
- 不硬编码不适配场景。
- 不大改全站技术栈。
- 不破坏 index / navigation / assets / workflow 等页面。

重点文件：
- 前端核心/practice.html
- 前端核心/app.js
- 前端核心/styles.css

实现约束：
- 优先不新增 JS 文件；如新增必须同步 package.json 的 build:static 复制逻辑。
