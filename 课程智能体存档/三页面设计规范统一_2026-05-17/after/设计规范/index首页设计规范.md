# Index 首页设计规范

> 适用范围：PharmacoPilot 首页，以及后续希望沿用首页气质的教学产品页面。
>
> 设计关键词：温暖纸面感、Claude Artifact 式工作台预览、高校教学产品语气、可审校、可阅读。
>
> 规范地位：本文件是全站网页设计的视觉母版；其他页面的继承、变体和禁用偏离规则见 `设计规范/全站网页设计约束.md`。

## 1. 设计定位

首页不是普通营销页，而是一个“任务发起 + Agent 工作台预览”的产品入口。

核心表达应始终围绕教师的真实工作流：

- 输入教学目标、课程材料、课堂约束。
- 系统生成教学导航、课堂任务、评价量规、课后复盘草稿。
- 用户在白色 Artifact 式输出面板中审校、修改、复用。

后续页面如果复用首页风格，应优先回答三个问题：

- 教师现在要完成什么任务？
- 系统正在推进什么过程？
- 输出在哪里被审校、修改和沉淀？

避免把页面做成纯宣传页、数据大屏或通用 SaaS 控制台。

## 2. 信息架构

当前全站主导航保留四页结构：

- 首页
- 教学导航
- 教学实践
- 教学数据

首页右侧/下方三功能演示应继续对应真实产品主线：

- 教学导航：20 环节训练地图。
- 教学实践：泛雅模拟实践、课堂活动、随堂测验、评价量规。
- 教学数据：教案、案例、反馈模板、复盘记录的数据中枢。

可见名称使用“教学数据”；内部兼容代码里仍可能保留 `assets` 作为历史 key。

## 3. 字体系统

### 正文与 UI 字体

使用系统无衬线，保持清晰、现代、低干扰：

```css
--font-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, "SF Pro Text",
  "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
```

适用：

- 正文段落
- 导航
- 按钮
- 表单
- 卡片说明
- 小标签

### 标题与品牌字体

使用编辑感 serif 字体，形成“教学文档 / 学术编辑”气质：

```css
--font-serif: ui-serif, "Iowan Old Style", "Songti SC", "STSong",
  "Noto Serif SC", Georgia, serif;
--editorial: var(--font-serif);
```

适用：

- 品牌 `PharmacoPilot`
- 品牌首字母 `P`
- 首页 H1
- 大型功能标题
- 重要输出标题

### 等宽字体

仅用于代码、日志、运行状态等技术感内容：

```css
--font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
```

不要在正文或教学说明里滥用等宽字体。

## 4. 字号与层级

首页的标题层级应保持“少层级、大留白、强主次”。

### 桌面端

- H1：`5.05rem`，`line-height: 1.02`，serif，居中。
- lede：`18px`，`line-height: 1.82`，最大宽度约 `780px`。
- 导航文字：`14px`，`font-weight: 600`。
- 顶部按钮：`14px`，`font-weight: 700`。
- 功能 tab 标题：约 `0.95rem`。
- 功能 tab 说明：约 `0.74rem`。
- 输出面板标题：约 `1.9rem`。

### 移动端

- H1 降到约 `2.42rem`。
- 工作台功能标题降到约 `2.35rem`。
- 输出面板标题降到约 `1.35rem`。
- 首屏由居中排版改为左对齐，提高移动阅读效率。

## 5. 字距与文字气质

默认保持：

```css
letter-spacing: 0;
```

只有 eyebrow、表单 label、小型分类标签允许使用少量字距：

```css
font-size: 12px;
font-weight: 800;
letter-spacing: 0.14em;
text-transform: uppercase;
```

中文文案应保持高校教学语气，不使用过度互联网化、游戏化、K12 化表达。

推荐表达：

- 可审校
- 可复用
- 教学导航
- 教学实践
- 教学数据
- 评价量规
- 课后复盘
- 20 环节训练地图

避免表达：

- 一键搞定全部教学
- 超级智能课堂神器
- 学生画像
- 数据大屏
- AI 黑盒生成

## 6. 色彩系统

### 全局底色

首页使用暖纸面底色，而不是纯白或冷灰：

```css
--bg: #fbf7ee;
--bg-soft: #f7efe3;
--bg-muted: #f1e5d5;
--surface: #fffaf2;
--surface-muted: #f6eadc;
```

页面背景可叠加非常轻的暖色、鼠尾草色径向渐变，以及低透明度网格纹理，营造纸面工作台感。

### 文字

```css
--text-main: #2f2923;
--text-soft: #5f554c;
--text-muted: #887b6c;
```

主文字偏深褐，不用纯黑。辅助文字偏灰褐，保持温和。

### 品牌与操作色

顶部导航与主入口使用深棕：

```css
--accent-brown: #8a4f24;
--accent-brown-dark: #6f3f1d;
--accent-amber: #c98a3a;
```

任务执行按钮使用绿蓝渐变：

```css
--sage: #73816b;
--blue-muted: #526a87;
```

这样可以区分：

- 棕色：品牌、导航、账户、页面主入口。
- 绿蓝：系统执行、开始生成、工作流推进。
- 橙色：首页工作台舞台与重点高亮。

### 功能舞台色

三个功能演示使用不同舞台色：

- 教学导航：橙色舞台 `#d97453 -> #c66748`
- 教学实践：灰蓝舞台 `#4f6f7a -> #35535f`
- 教学数据：棕灰舞台 `#7a644f -> #594537`

不要把全站做成单一紫色、蓝色或纯科技黑风格。

## 7. 页面布局

### 首页整体

当前首页采用单列首屏：

```css
body[data-page="home"].anthropic-inspired-home .hero-split.home-landing {
  width: min(calc(100% - 48px), 1440px);
  grid-template-columns: 1fr;
  gap: 34px;
  padding-top: 46px;
  padding-bottom: 58px;
}
```

首屏结构：

1. 顶部导航。
2. 居中 hero 文案。
3. 一句话任务输入框。
4. 主要 CTA。
5. 三功能 Agent 工作台演示。

### 内容宽度

- 顶部导航最大宽：`1240px`。
- hero 文案最大宽：约 `980px`。
- H1 最大宽：约 `900px`。
- lede 最大宽：约 `780px`。
- 工作台最大宽：约 `1240px`。
- 整页最大宽：约 `1440px`。

## 8. 顶部导航规范

顶部导航是首页的重要视觉基准，后续页面的账号按钮也应以它为参照。

### 顶部容器

```css
min-height: 68px;
padding: 0 24px;
border-radius: 16px;
background: rgba(255, 253, 248, 0.78);
backdrop-filter: blur(18px);
box-shadow: 0 12px 40px rgba(43, 33, 24, 0.06);
```

布局：

- 左：品牌。
- 中：四页导航。
- 右：操作入口。

### 导航项

```css
min-height: 36px;
padding: 0 13px;
border-radius: 13px;
font-size: 14px;
font-weight: 600;
```

active 状态：

```css
background: rgba(201, 138, 58, 0.14);
color: #6f3f1d;
```

### 顶部按钮

描边按钮：

- 白色/透明纸面底。
- 深棕文字。
- 浅米色边框。

主按钮：

- 深棕实心。
- 暖白文字。
- 轻阴影。

不要把顶部按钮改成强渐变、强阴影或大圆 pill；首页基准是 `13px` 圆角的紧凑按钮。

## 9. 任务输入框规范

任务输入框是首页核心交互，不是普通搜索框。

外层：

```css
width: min(100%, 780px);
margin-top: 30px;
padding: 12px;
border-radius: 28px;
background: linear-gradient(135deg, rgba(255, 250, 242, 0.88), rgba(255, 253, 248, 0.74));
box-shadow: 0 22px 58px rgba(70, 51, 34, 0.12);
```

输入行：

```css
display: grid;
grid-template-columns: minmax(0, 1fr) auto;
min-height: 50px;
border-radius: 22px;
background: #fffdf8;
```

提交按钮：

```css
min-height: 46px;
border-radius: 999px;
background: linear-gradient(135deg, var(--sage), color-mix(in srgb, var(--blue) 78%, var(--sage)));
font-weight: 840;
```

预设任务按钮使用小 pill，active 状态用淡绿底和成功色文字。

## 10. Agent 工作台演示规范

工作台演示是首页最重要的产品感来源，应保持“输入过程 + 输出预览”的结构。

### 三功能 tab

外层：

```css
width: min(100%, 980px);
padding: 7px;
border-radius: 24px;
background: rgba(238, 235, 228, 0.86);
box-shadow: 0 16px 38px rgba(57, 42, 25, 0.08);
```

单个 tab：

```css
grid-template-columns: 42px minmax(0, 1fr);
min-height: 66px;
padding: 12px 14px;
border-radius: 18px;
```

active tab：

```css
background: rgba(255, 250, 242, 0.95);
box-shadow: 0 12px 28px rgba(57, 42, 25, 0.08);
```

### 大舞台

```css
min-height: 680px;
padding: 42px;
border-radius: 36px;
box-shadow: 0 34px 84px rgba(57, 42, 25, 0.16);
```

舞台中可以有轻微网格与斜线高光，但透明度必须低，不能抢内容。

### 输入过程卡片

输入侧用深色卡，形成“Agent 正在工作”的感受：

```css
padding: 20px;
border-radius: 22px;
background: #151311;
box-shadow: 0 20px 42px rgba(17, 13, 10, 0.18);
```

内容包括：

- Prompt
- Attachments
- Agent Activity

### 输出预览面板

输出侧是白色 Artifact 面板：

```css
min-height: 560px;
padding: 26px;
border-radius: 29px;
background: #fffdf8;
box-shadow: 0 30px 70px rgba(17, 13, 10, 0.22);
```

输出区域应像可审校文档，不应像统计大屏。

推荐包含：

- 标题与简短说明。
- 阶段切换。
- 结构化任务卡。
- 节点路径。
- 量规或复用记录。
- 预览 / 编辑等轻操作。

## 11. 圆角、阴影与边框

全局圆角 token：

```css
--radius-xl: 34px;
--radius-lg: 24px;
--radius-md: 18px;
--radius-sm: 12px;
--radius-xs: 10px;
```

首页常用规则：

- 顶部导航：16px。
- 顶部导航按钮：13px。
- 任务输入框外层：28px。
- 任务输入行：22px。
- 工作台舞台：36px。
- 输出面板：29px。
- 深色 Agent 卡：22px。
- 小卡片：16px-18px。
- 状态/编号/标签：999px pill。

阴影要轻、宽、暖，不要黑重阴影：

```css
--shadow-soft: 0 22px 70px rgba(93, 70, 46, 0.1);
--shadow-card: 0 12px 38px rgba(70, 51, 34, 0.08);
```

## 12. 交互状态

首页交互动效克制，主要使用：

- 颜色变化。
- 边框变化。
- 轻微阴影。
- `translateY(-1px)` 或 `translateY(-2px)`。
- 180ms 左右过渡。

避免：

- 大幅缩放。
- 复杂弹跳。
- 高频无限动画。
- 影响阅读的背景动效。

## 13. 响应式规范

断点原则：

- `1080px` 以下：顶部导航切换为移动菜单。
- `1020px` 以下：工作台从左右结构变为单列。
- `760px` 以下：hero 左对齐，工作台内网格压成单列。
- `640px` 以下：顶部导航收紧宽度与品牌字号。

移动端重点：

- 不要让按钮文字挤压。
- 输入框按钮应占满整行。
- 功能 tab 单列展示。
- 输出面板取消固定高度，避免首屏过长或内容被裁切。

## 14. 可复用组件清单

后续页面优先复用这些模式：

- `site-header` + `topbar`：首页式顶部导航。
- `brand` / `brand-mark` / `brand-lockup`：品牌结构。
- `nav-outline-action` + `nav-primary-action`：顶部操作按钮。
- `hero-copy` + `eyebrow` + `lede`：首屏叙事结构。
- `home-task-entry`：一句话任务入口。
- `home-feature-tabs`：三段式功能切换。
- `home-cowork-stage`：大工作台舞台。
- `agent-dark-card`：Agent 输入/活动卡。
- `home-cowork-output`：Artifact 输出预览面板。

## 15. 新页面复用检查清单

新增页面或重构页面时，先检查：

- 是否仍然服务 `首页 / 教学导航 / 教学实践 / 教学数据` 四页结构？
- 标题是否使用教学产品语气，而不是泛 SaaS 文案？
- 首屏是否让用户看到任务、过程、输出？
- 是否保留暖纸面底色、深褐文字、棕色主操作？
- 是否把 AI 输出放在可审校面板里，而不是只放聊天框？
- 是否避免了过多卡片堆叠和数据看板化？
- 移动端标题、按钮、tab 是否不挤压、不重叠？

## 16. 主要源码位置

- 首页结构：`前端核心/index.html`
- 首页样式：`前端核心/styles.css`
- 首页三功能演示数据与渲染：`前端核心/app.js`
- 可复用 token 附录：`设计规范/index-design-tokens.css`
