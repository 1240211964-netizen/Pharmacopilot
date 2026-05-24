# 验证记录

## 文件覆盖

- 覆盖后校验 3 个项目文件与 Downloads 补丁文件 SHA-256 一致。
- 为满足“顶部左侧只显示本页操作/01/02/03”，额外删除 `teaching-navigation.html` 左侧操作区残留的 `pp-nav-eyebrow` 小眉标。

## 静态检查

- `node --check 前端核心/teaching-navigation-productized.js`
  - 通过。
- 内联静态验收脚本：
  - 顶部左侧眉标已移除。
  - 旧说明句已移除。
  - 页面源代码不包含“先读课程目标、药事管理任务和学生产出”。
  - `stationRationale` 与 `activeTask` 由 CSS 隐藏。
  - 第 1 站标题、三个输入标签、三个推荐定位、定位句/定位依据/后续设计约束字段存在。
  - 通过。
- `git diff --check -- 前端核心/teaching-navigation.html 前端核心/teaching-navigation-productized.css 前端核心/teaching-navigation-productized.js 课程智能体存档/教学导航第二轮收敛补丁_2026-05-24`
  - 通过。

## 构建检查

- `npm run build:server`
  - 通过。
- `npm run build:static`
  - 未通过，失败仍来自当前工作区既有缺失文件：
    - `前端核心/dashboard.html`
    - `前端核心/settings.html`
    - `前端核心/outputs.html`
    - `前端核心/navigation.html`
    - `前端核心/interface-review-improved.html`
  - 这些文件不是本轮修改对象。

## 浏览器验收

- 地址：`http://127.0.0.1:5173/teaching-navigation.html?compactPatch=20260524b`
- 页面可见检查：
  - 顶部左侧文本为：`本页操作 01 读依据 02 做判断 03 生成产物`。
  - 顶部标题字号为 `22px`。
  - 页面不再可见“本站依据”。
  - 页面不再可见旧说明句。
  - `.context-drawer`、`#stationRationale`、`#activeTask` 可见数量为 0。
  - 第 1 站标题为“教学定位模拟器”。
  - 第 1 站标题下只显示三个标签：大纲目标、班级画像、案例语境。
  - 控制台 error 数量为 0。
- 交互检查：
  - 切换“考研占优”后，推荐为“证据研究型定位”。
  - 切换“实习就业占优”后，推荐为“服务运营型定位”。
  - 切换“考公监管占优”后，推荐为“政策治理型定位”。
  - 点击定位、点击“生成”后，产物草稿包含定位句、定位依据、后续设计约束。
  - 点击“保存资产”和“下一站”后，页面进入第 2 站“学情侦探局”。
  - 控制台 error 数量为 0。
- 文件选择入口：
  - “示例大纲”按钮存在，隐藏文件 input 存在，accept 为 `.pdf,.doc,.docx,.txt,.md`。
  - 自动化环境不提供 `setInputFiles` 能力；已通过静态代码确认 file input change 后会写入 `loaded: true`、`fileName: file.name` 并显示“大纲已载入”。
