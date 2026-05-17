用户说明当前使用 DeepSeek API，并提供了本地测试密钥 `[redacted]`，希望能在本地浏览器查看 Copilot 效果。

处理要求：

- 不把真实密钥提交到 Git。
- 只将真实密钥写入本地 `.env`。
- 让现有 OpenAI SDK 以 OpenAI-compatible 方式调用 DeepSeek。
- 保留 RAG embedding 与 chat generation 的密钥边界，避免把 DeepSeek key 错用于 OpenAI embedding。
- 重启本地 `http://localhost:5187/practice.html` 预览服务。
