# Checks

- `npm run build:server`：通过。
- `npm run typecheck`：通过。
- `git diff --check`：通过。
- `.env` 脱敏检查：确认存在 `DEEPSEEK_API_KEY=sk-...1da8`，`DEEPSEEK_BASE_URL=https://api.deepseek.com`，`DEEPSEEK_MODEL=deepseek-chat`。
- 本地服务已重启：`http://localhost:5187/practice.html`。
- 真实 DeepSeek SSE 验证：
  - `POST /api/agent/run` 返回 `director_thinking`。
  - `practice-agent` 返回 `text_delta`。
  - `practice-agent` 返回 `practice.create_flow` action。
  - response usage 显示 DeepSeek 调用已完成。

## 备注

- 本次仅做一次真实 DeepSeek agent 验证，避免消耗过多额度。
- RAG embedding 仍需要 OpenAI embedding key 或单独的 `OPENAI_EMBEDDING_API_KEY`。
