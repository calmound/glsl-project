# Supabase 设置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 记录项目的 URL 和 API Keys

## 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local` 并填入你的 Supabase 项目信息：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的 anon key
SUPABASE_SERVICE_ROLE_KEY=你的 service_role key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. 配置 OAuth 提供商

### Google OAuth
1. 在 [Google Cloud Console](https://console.cloud.google.com/) 创建项目
2. 启用 Google+ API
3. 创建 OAuth 2.0 客户端 ID
4. 添加授权重定向 URI：
   - 开发环境：`http://localhost:3000/auth/callback`
   - 生产环境：`https://你的域名/auth/callback`

### GitHub OAuth
1. 在 GitHub Settings > Developer settings > OAuth Apps 创建应用
2. 设置回调 URL：
   - 开发环境：`http://localhost:3000/auth/callback`
   - 生产环境：`https://你的域名/auth/callback`

## 4. 在 Supabase 中配置 OAuth

1. 进入 Supabase 项目仪表板
2. 转到 **Authentication > Providers**
3. 启用 Google 和 GitHub 提供商
4. 填入对应的 Client ID 和 Client Secret
5. 设置回调 URL

## 5. 设置数据库

在 Supabase SQL 编辑器中执行 `docs/supabase-setup.sql` 中的 SQL 代码来创建必要的表和策略。

## 6. 测试设置

1. 启动开发服务器：`pnpm dev`
2. 访问 `http://localhost:3000/signin`
3. 尝试使用 Google 或 GitHub 登录
4. 成功登录后应该重定向到 `/app`

## 目录结构

```
src/
├── app/
│   ├── signin/           # 登录页面
│   ├── app/              # 用户仪表盘
│   └── auth/callback/    # OAuth 回调路由
├── components/auth/      # 认证相关组件
└── lib/
    └── supabase.ts       # Supabase 客户端配置
```

## 功能特性

- ✅ Google / GitHub OAuth 登录
- ✅ 自动用户资料管理
- ✅ 行级安全 (RLS)
- ✅ 服务端和客户端认证状态管理
- ✅ 中间件路由保护
- ✅ 自动登录重定向
