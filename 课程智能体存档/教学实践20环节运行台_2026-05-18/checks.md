# Checks

## 静态与构建
- `node --check 前端核心/app.js`：通过
- `node --check 前端核心/agent-runtime/action-engine.js`：通过
- `node --check 前端核心/agent-runtime/agent-client.js`：通过
- `npm run build:static`：通过
- `env VITE_WENDAO_DOMAIN=cpu.libsp.net WENDAO_DOMAIN=cpu.libsp.net npm run build`：通过
- `git diff --check`：通过

## 本地 HTTP
- `http://localhost:5188/practice.html`：200
- `http://localhost:5188/index.html`：200
- `http://localhost:5188/teaching-navigation.html`：200
- `http://localhost:5188/teaching-data.html`：200
- `http://localhost:5188/workflow.html`：200

## 浏览器烟测
- 桌面视口：6 个运行态摘要、5 个专业 Agent、20 个状态节点、20 个节点 Agent 标识，无横向溢出，控制台错误数 0。
- 启动 Copilot 后：可推进到 `STEP 01`，可显示负责 Agent、证据缺口、教师接管点、已形成产物和 Director 下一步调度。
- 移动视口 `390x844`：6 个运行态摘要、5 个专业 Agent、20 个状态节点，无横向溢出，控制台错误数 0。

## 备注
- 浏览器截图接口在本地环境中执行 `Page.captureScreenshot` 超时，未生成截图文件；DOM、运行态和控制台检查已完成。
