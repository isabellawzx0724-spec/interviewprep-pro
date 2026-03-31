# Interview Navigator 部署指南（给完全不懂部署的人）

这是最稳、最容易成功的方案：
- 前端：Vercel
- 后端 API：Render
- AI：OpenAI API

> 先上线 MVP，暂时不要打开小红书 / 牛客实时抓取。先保证网站能用，再处理抓取与合规。

---

## 一、你最终会得到什么

部署完成后，你会有两个网址：
1. 一个前端网址（用户打开的网站）
2. 一个后端网址（给前端调用的 API）

---

## 二、你要先准备的 4 样东西

1. **GitHub 账号**
2. **Vercel 账号**
3. **Render 账号**
4. **OpenAI API Key**

如果没有，就先注册：
- GitHub
- Vercel
- Render
- OpenAI Platform

---

## 三、先解压这个项目

1. 下载 zip
2. 双击解压
3. 你会看到一个文件夹：`interviewprep-pro`

---

## 四、把项目上传到 GitHub

### 方法 A：最简单的方法（推荐）

1. 打开 GitHub
2. 点击右上角 `+`
3. 选择 **New repository**
4. Repository name 填：`interviewprep-pro`
5. 选择 **Public** 或 **Private** 都可以
6. 点击 **Create repository**

然后把本地文件夹上传进去：

#### 如果你不会命令行
最简单方法是：
- 打开新建好的 GitHub 仓库页面
- 选择 **uploading an existing file**
- 把整个项目里的文件拖进去

注意：
- 不是把 zip 直接上传
- 是把 **解压后的文件内容** 上传

你应该上传这些：
- `backend/`
- `frontend/`
- `.env.example`
- `README.md`
- `render.yaml`
- `DEPLOYMENT_GUIDE.md`

---

## 五、先部署后端（Render）

### 1）登录 Render

进入 Render Dashboard。

### 2）新建 Web Service

1. 点击 **New +**
2. 选择 **Web Service**
3. 连接你的 GitHub
4. 选择仓库：`interviewprep-pro`

### 3）填写部署信息

按下面填：

- **Name**: `interview-navigator-api`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4）配置环境变量

在 Render 的 Environment Variables 里添加：

- `OPENAI_API_KEY` = 你的 OpenAI key
- `ALLOW_LIVE_SCRAPE` = `false`
- `ALLOWED_ORIGIN` = 先随便填 `*`，等前端上线后再改成前端正式网址
- `NODE_VERSION` = `22`

### 5）点击 Deploy

部署成功后，你会拿到一个后端地址，例如：

`https://interview-navigator-api.onrender.com`

### 6）测试后端是否正常

浏览器打开：

`https://你的-render-网址/api/health`

如果看到类似：

```json
{"ok":true,"product":"Interview Navigator API"}
```

就说明后端正常。

---

## 六、再部署前端（Vercel）

### 1）登录 Vercel

进入 Vercel Dashboard。

### 2）导入 GitHub 项目

1. 点击 **Add New...**
2. 选择 **Project**
3. 选择你的 GitHub 仓库 `interviewprep-pro`

### 3）设置 Root Directory

非常重要：
- **Root Directory** 选 `frontend`

### 4）配置环境变量

添加：

- `VITE_API_BASE_URL` = 你的 Render 后端地址

例如：

`https://interview-navigator-api.onrender.com`

### 5）点击 Deploy

部署完成后，你会拿到一个前端网址，例如：

`https://interviewprep-pro.vercel.app`

---

## 七、把后端的跨域限制改正确

前端上线后，回到 Render。

把后端环境变量里的：

- `ALLOWED_ORIGIN`

从 `*` 改成你的前端正式网址，例如：

`https://interviewprep-pro.vercel.app`

然后点击 **Manual Deploy** / **Redeploy**。

这一步做完更安全。

---

## 八、正式测试整个网站

打开你的前端网址，测试这 3 件事：

### 测试 1：页面是否正常打开
- 能看到首页
- 能切换中英文
- 输入公司、岗位、JD、简历

### 测试 2：是否能生成 Prep Pack
点击生成按钮后，右边应该出现：
- 面经摘要
- JD 题目
- 简历深挖题
- 公司文化适配
- 一页纸小抄

### 测试 3：反馈功能能否提交
在页面底部提交一条面试反馈。

---

## 九、你现在要知道的两个现实问题

### 问题 1：反馈数据目前是文件存储
现在这版是把反馈写到服务器文件里。
这适合 MVP 测试，但不适合长期商用。

真正商用建议下一步改成：
- Supabase Postgres
- 或 Render Postgres

### 问题 2：小红书 / 牛客抓取默认关闭
这是故意的。
因为这些站点的实时抓取通常会涉及：
- 登录态
- cookie
- 反爬
- 平台规则
- 法律与合规风险

所以现在先让主产品上线，再决定是否启用抓取层。

---

## 十、你现在最推荐的上线顺序

请严格按这个顺序：

1. 上传 GitHub
2. 部署 Render 后端
3. 测试 `/api/health`
4. 部署 Vercel 前端
5. 填 `VITE_API_BASE_URL`
6. 回 Render 把 `ALLOWED_ORIGIN` 改成前端域名
7. 整站测试
8. 再决定要不要做数据库 / 登录 / 支付 / 抓取

---

## 十一、如果你卡住，最常见错误是这 5 个

### 1. 前端打不开生成功能
通常是 `VITE_API_BASE_URL` 没填对。

### 2. 浏览器报 CORS 错误
通常是 Render 里的 `ALLOWED_ORIGIN` 没设置成前端网址。

### 3. Render 部署失败
通常是 Root Directory 没填 `backend`。

### 4. Vercel 部署失败
通常是 Root Directory 没填 `frontend`。

### 5. 页面能开，但没有 AI 内容
通常是 `OPENAI_API_KEY` 没填，或者 key 无效。

---

## 十二、真正商业化之前，你下一步最该加什么

优先级建议：
1. 数据库（保存反馈、公司、岗位、面经）
2. 登录系统
3. 历史项目保存
4. Stripe 支付
5. 管理后台
6. 抓取任务调度
7. 面经去重和可信度打分

