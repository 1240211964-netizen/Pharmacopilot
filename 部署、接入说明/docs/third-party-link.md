# 泛雅第三方链接创建配置

当前方案是把 CoursePilot 网站本身作为泛雅第三方入口，不依赖扣子或其他外部智能体页面。

从零申请网址和部署步骤见 [`deploy-url-guide.md`](./deploy-url-guide.md)。

当前课程页可用的泛雅上下文参数：

- `courseId`: `251769346`
- `clazzId`: `131807646`
- `cpi`: `18085305`

## 本地测试链接

```text
http://localhost:5173/launch?courseId=251769346&clazzId=131807646&cpi=18085305&source=fanya
```

这个链接只适合在当前电脑测试。学生或其他老师无法访问你的 `localhost`。

## 正式链接模板

部署到公网 HTTPS 后，在泛雅“第三方链接创建”中填写：

```text
https://你的域名/launch?courseId=251769346&clazzId=131807646&cpi=18085305&source=fanya
```

如果学校允许泛雅动态传参，建议配置为：

```text
https://你的域名/launch?courseId=${courseId}&clazzId=${clazzId}&cpi=${cpi}&source=fanya
```

实际占位符格式需要以泛雅第三方链接创建表单说明为准。

## 建议填写项

- 工具名称：`CoursePilot 泛雅助手`
- 简介：`辅助新教师完成课程目标拆解、药学场景案例转化、课堂互动设计、过程性评价和课后复盘。`
- 分类：`备课中心` 或 `教学神器`
- 入口链接：使用上面的正式 HTTPS 链接

## 重要限制

- 第三方链接只能把 Agent 挂到泛雅入口中。
- 如果要读取学生名单、作业、成绩、学习记录，需要另行获得学校/超星 API 或 SSO 授权。
- 正式使用不要填写 `localhost`，否则只有当前电脑能打开。
