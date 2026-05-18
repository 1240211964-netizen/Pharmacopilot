# Checks

- `node --check 前端核心/app.js`：通过。
- `node --check 前端核心/agent-runtime/action-engine.js`：通过。
- `npm run build:static`：通过。
- `npm run typecheck`：通过。
- `git diff --check -- 前端核心/practice.html 前端核心/app.js 前端核心/agent-runtime/action-engine.js 前端核心/styles.css`：通过。
- Browser 本地验证 `http://localhost:5173/practice.html`：
  - STEP 节点均带有“点击后直接显示超星页面”的可访问入口。
  - 点击 STEP 10 后，未点击刷新按钮，`#chaoxingEditorFrame.src` 直接切到超星 `study-ai` 地址，当前环节更新为 STEP 10。
  - 再点击 STEP 11 后，未点击刷新按钮，当前环节更新为 STEP 11，状态显示 `超星页面已显示`。
