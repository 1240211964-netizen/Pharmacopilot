# 从零申请并发布泛雅第三方链接

目标：获得一个公网 HTTPS 地址，把 CoursePilot 网站本身作为第三方链接导入泛雅。

## 路线选择

### A. 只需要一个可点击的第三方页面

适合先试运行、展示课程辅助工具、让学生或老师从泛雅直接打开页面。

推荐使用 Netlify 免费二级域名，例如：

```text
https://coursepilot-agent.netlify.app/launch?courseId=251769346&clazzId=131807646&cpi=18085305&source=fanya
```

步骤：

1. 注册或登录 Netlify。
2. 把本项目上传到 GitHub，或在 Netlify 新建项目时选择当前仓库。
3. Netlify 会读取 `netlify.toml`：
   - 构建命令：`npm run build:static`
   - 发布目录：`dist`
4. 部署成功后，在 Site settings 里把随机站点名改成容易识别的名称，例如 `coursepilot-agent`。
5. 在泛雅“第三方链接创建”中填写正式入口：

```text
https://你的站点名.netlify.app/launch?courseId=251769346&clazzId=131807646&cpi=18085305&source=fanya
```

### B. 需要真实连接学校/超星泛雅接口

适合后续读取课程、班级、作业、题库、学习数据，或把 Agent 生成的任务同步回泛雅。

推荐使用 Render 这类 Node Web Service，部署后会得到类似地址：

```text
https://coursepilot-agent.onrender.com/launch?courseId=251769346&clazzId=131807646&cpi=18085305&source=fanya
```

步骤：

1. 注册或登录 Render。
2. New Web Service，连接本项目仓库。
3. Render 会读取 `render.yaml`；也可以手动填写：
   - Build Command：留空
   - Start Command：`npm start`
4. 在 Environment 中配置学校或超星提供的接口参数，参考 `.env.example`。
5. 部署成功后，用 `/api/fanya/status` 检查 Connector 是否配置完整。

## 泛雅填写建议

- 工具名称：`CoursePilot 泛雅助手`
- 简介：`辅助新教师完成课程目标拆解、药学场景案例转化、课堂互动设计、过程性评价和课后复盘。`
- 分类：`备课中心` 或 `教学神器`
- 入口链接：使用部署后的 `/launch?...` 地址

## 注意事项

- 不要填写 `localhost`，学生和其他老师无法访问你的本机地址。
- 优先使用 `https://` 链接。
- 如果学校要求内嵌显示，而不是新窗口打开，部署平台不能设置阻止 iframe 的响应头。
- 如果购买自己的域名并使用中国大陆服务器，通常需要按云厂商流程完成备案；免费平台二级域名一般更快。
