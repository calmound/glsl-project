# 认证系统设置指南

本项目使用 NextAuth.js + Supabase 实现用户认证和数据管理。

## 🚀 快速开始

### 1. 环境变量配置

复制 `.env.local` 文件并填入以下配置：

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth (可选)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 2. Supabase 设置

1. 访问 [Supabase](https://supabase.com) 创建新项目
2. 在项目设置中获取 URL 和 API Keys
3. 在 SQL Editor 中执行 `database/schema.sql` 文件创建数据表
4. 在 Authentication > Settings 中配置认证提供商

### 3. Google OAuth 设置（可选）

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID
5. 添加授权重定向 URI：`http://localhost:3000/api/auth/callback/google`

### 4. 邮箱认证设置（可选）

如需启用邮箱登录，需要配置 SMTP 服务器：

```bash
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

## 📁 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth API 路由
│   │   └── user/                   # 用户相关 API
│   └── auth/                       # 认证页面
├── components/
│   └── ui/
│       └── user-menu.tsx          # 用户菜单组件
├── contexts/
│   └── AuthContext.tsx            # 认证上下文
├── lib/
│   └── auth.ts                     # NextAuth 配置
└── types/
    └── auth.ts                     # 类型定义
```

## 🔧 功能特性

### 已实现功能

- ✅ Google OAuth 登录
- ✅ 邮箱链接登录
- ✅ 用户会话管理
- ✅ 用户资料管理
- ✅ 学习进度跟踪
- ✅ 路由保护中间件
- ✅ 响应式用户菜单

### 数据库表结构

- **users**: 用户基础信息
- **user_progress**: 学习进度记录
- **user_projects**: 用户项目/作品
- **project_likes**: 项目点赞
- **project_comments**: 项目评论
- **user_follows**: 用户关注关系

## 🛡️ 安全特性

- 行级安全策略 (RLS)
- JWT 会话管理
- CSRF 保护
- 路由级权限控制
- 数据库访问权限控制

## 📖 使用方法

### 在组件中使用认证

```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { session, status } = useAuth()

  if (status === 'loading') {
    return <div>加载中...</div>
  }

  if (status === 'unauthenticated') {
    return <div>请先登录</div>
  }

  return <div>欢迎，{session?.user?.name}！</div>
}
```

### 保护页面路由

受保护的路由已在 `middleware.ts` 中配置：
- `/dashboard` - 用户仪表板
- `/profile` - 用户资料
- `/projects` - 用户项目

### API 调用示例

```tsx
// 获取用户信息
const response = await fetch('/api/user')
const { user } = await response.json()

// 更新学习进度
const response = await fetch('/api/user/progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tutorial_id: 'basic-01',
    category: 'basic',
    status: 'completed',
    completion_percentage: 100
  })
})
```

## 🚀 部署注意事项

1. **生产环境变量**：确保在生产环境中设置正确的环境变量
2. **NEXTAUTH_SECRET**：生产环境必须设置强密码
3. **回调 URL**：更新 Google OAuth 和 Supabase 的回调 URL
4. **数据库迁移**：确保生产数据库已执行 schema.sql

## 🔄 未来扩展

- [ ] 社交媒体登录（GitHub, Discord）
- [ ] 两步验证
- [ ] 用户角色和权限系统
- [ ] 订阅和付费功能
- [ ] 用户活动日志
- [ ] 管理员面板

## 🐛 故障排除

### 常见问题

1. **登录后重定向失败**
   - 检查 `NEXTAUTH_URL` 是否正确
   - 确认回调 URL 配置

2. **数据库连接失败**
   - 验证 Supabase 环境变量
   - 检查数据库表是否已创建

3. **Google 登录失败**
   - 确认 Google OAuth 配置
   - 检查重定向 URI 设置

### 调试模式

在开发环境中启用 NextAuth 调试：

```bash
NEXTAUTH_DEBUG=true
```

## 📞 支持

如有问题，请查看：
- [NextAuth.js 文档](https://next-auth.js.org/)
- [Supabase 文档](https://supabase.com/docs)
- [项目 Issues](https://github.com/your-repo/issues)