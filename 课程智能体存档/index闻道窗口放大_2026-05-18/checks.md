# 检查记录

## 静态与构建检查

- `node --check 前端核心/app.js`：通过。
- `VITE_WENDAO_DOMAIN=cpu.libsp.net WENDAO_DOMAIN=cpu.libsp.net npm run build:static`：通过。
- `npm run build:server`：通过。
- `git diff --check`：通过。
- `npx tsc -p tsconfig.json --noEmit`：通过。

## 页面验证

使用本地静态预览 `http://127.0.0.1:5173/index.html` 检查首页：

- 首页存在 `.home-task-entry.home-wenda-expanded`。
- 标题为 `闻道科学探索`。
- 旧输入框 `#homeTaskInput` 已移除。
- 旧预设按钮 `.home-task-presets` 已移除。
- 旧提交按钮已移除。
- 旧标题 `一句话发起教学任务` 已移除。
- 桌面视口 `1280 x 720` 下，面板宽度约 `1120px`。
- 闻道 iframe 宽度约 `1076px`，高度约 `680px`。
- iframe 地址指向 `https://cpu.libsp.net/api/openAccess/redirect/home?...select_agent_id=...`。
- 面板 CSS 网格列为 `1 / -1`，已跨首页双列区域。

## 说明

截图保存尝试因浏览器截图命令超时未写入文件；本次以 DOM 与实际布局尺寸读取作为页面验证依据。
