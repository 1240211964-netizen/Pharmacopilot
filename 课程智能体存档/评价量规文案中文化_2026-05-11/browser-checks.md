# Browser Checks

Local server: http://127.0.0.1:4175/

## Desktop visible text checks

- /index.html: loaded, visible text contains `评价量规`, visible text does not contain the English evaluation term.
- /navigation.html: loaded, visible text contains `评价量规`, visible text does not contain the English evaluation term.
- /teaching-navigation.html: loaded, visible text contains `评价量规`, visible text does not contain the English evaluation term.
- /practice.html: loaded, visible text contains `评价量规`, visible text does not contain the English evaluation term.
- /assets.html: loaded, visible text contains `评价量规`, visible text does not contain the English evaluation term.
- /interface-review-improved.html: loaded, visible text contains `评价量规`, visible text does not contain the English evaluation term.

## Interaction checks

- 首页任务 tab `配置评价量规` 可点击。
- 切换后的任务面板显示 `评价量规草稿`，可见文本不含英文评价术语。
- 顶部登录链接: `./practice.html#fanyaAuthForm`。
- 顶部注册链接: `./practice.html#fanyaAuthForm`。

## Mobile 390px checks

- /index.html: 390x844 viewport loaded, mobile menu button visible, visible text contains `评价量规` and no English evaluation term.
- /practice.html: 390x844 viewport loaded, mobile menu button visible, visible text contains `评价量规` and no English evaluation term.
- /assets.html: 390x844 viewport loaded, mobile menu button visible, visible text contains `评价量规` and no English evaluation term.

## Source text scan

- `rg -n "Rubric" 前端核心/*.html 后端核心/src/generation.ts`: no matches.
- `前端核心/app.js` still contains internal compatibility names such as function names, object keys, and route state names by design; user-visible strings have been converted.
