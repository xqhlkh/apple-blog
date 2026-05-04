# Apple Blog — 极简苹果风格个人博客

一个带后台管理系统的苹果官网风格个人博客，支持发布文章和图片。

## 功能

- 苹果官网风格的极简设计（SF 字体、圆角卡片、毛玻璃效果、流畅动画）
- 前台：文章列表、文章详情（Markdown 渲染）
- 后台：管理员登录、文章 CRUD、草稿/发布管理、图片上传
- 数据库：本地 SQLite，零配置

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（首次启动自动创建数据库和默认管理员账号）
npm run dev

# 3. 访问
# 前台: http://localhost:3000
# 后台: http://localhost:3000/admin/login
```

## 默认管理员账号

- 用户名: `admin`
- 密码: `admin123`

登录后请尽快修改密码（编辑 `src/lib/auth.ts` 中的 `seedAdmin` 函数）。

## 文章写作

文章使用 Markdown 格式书写，支持：

- 标题、段落、引用
- 图片（可本地上传或使用外链）
- 代码块（带语法高亮样式）
- 标签分类

## 项目结构

```
apple-blog/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 首页
│   │   ├── posts/[slug]/page.tsx # 文章详情
│   │   ├── admin/                # 管理后台
│   │   └── api/                  # API 路由
│   ├── components/               # 组件
│   ├── lib/                      # 数据库 & 认证
│   └── middleware.ts             # 路由保护
├── public/                       # 静态文件
│   └── uploads/                  # 上传的图片
└── data/                         # SQLite 数据库（自动生成）
```

## 部署

### Vercel（推荐）

由于使用了 SQLite，推荐部署到支持本地文件系统的平台：

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 设置环境变量 `JWT_SECRET`（建议使用随机字符串）
4. 部署

> 注意：Vercel 的无服务器函数有一定限制，SQLite 数据库文件在冷启动时可能会丢失。如需持久化，建议使用 Turso（SQLite 云服务）或迁移到 PostgreSQL。

### 本地服务器

```bash
npm run build
npm start
```

## 技术栈

- Next.js 14（App Router）
- TypeScript
- Tailwind CSS
- better-sqlite3
- markdown-it
- bcryptjs + jsonwebtoken
