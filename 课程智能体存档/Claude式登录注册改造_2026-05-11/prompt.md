# Prompt

用户要求：

> 登陆注册也学习一下calude

解释：按上下文将 `calude` 理解为 Claude。参考 Claude 当前登录入口的低噪声账号页结构，但不复制 Claude 文案、品牌或图片。

本轮处理范围：

- 将独立登录/注册页改成更接近 Claude 的克制账号入口：短标题、第三方/SSO 风格入口、邮箱继续、轻量边界说明。
- 保留 Pharmacopilot 的药学教学语境和本地会话边界。
- 保留现有 `loginForm`、`registerForm`、`authStatusPanel`、`data-auth-mode` 等 JS 绑定。
- 验证登录、注册、模式切换和本地会话状态。
