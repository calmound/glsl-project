# 🚀 快速开始 - Supabase 集成

## 前置要求

- Node.js 18+
- pnpm
- Supabase 账号（已有项目: `glsl`）

## 环境配置

### 1. 复制环境变量模板

创建 `.env.local` 文件：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://fkgudvpbetdsjmtdpkge.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key

# Google OAuth (如果需要登录功能)
GOOGLE_CLIENT_ID=你的_google_client_id
GOOGLE_CLIENT_SECRET=你的_google_client_secret
NEXTAUTH_SECRET=随机生成的密钥
NEXTAUTH_URL=http://localhost:3000
```

### 2. 获取 Supabase Keys

1. 访问 [Supabase Dashboard](https://app.supabase.com/project/fkgudvpbetdsjmtdpkge/settings/api)
2. 复制 `anon/public` key 到 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. 复制 `service_role` key 到 `SUPABASE_SERVICE_ROLE_KEY`

## 安装依赖

```powershell
pnpm install
```

## 验证数据库

数据库迁移已完成，可以验证：

```sql
-- 在 Supabase SQL Editor 中运行
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_form_code', 'user_form_status');
```

应该看到两个表。

## 启动开发服务器

```powershell
pnpm dev
```

访问 http://localhost:3000

## 测试功能

### 测试 1: 未登录用户

1. 访问任意教程页面，例如: http://localhost:3000/learn/basic/hello-world
2. 编辑代码
3. 代码**不会**自动保存（因为未登录）
4. 刷新页面，代码重置为初始练习代码

### 测试 2: 已登录用户 - 自动保存

1. 点击页面右上角 "Login" 使用 Google 登录
2. 登录后访问教程页面
3. 编辑代码
4. 等待 2 秒（打开浏览器 DevTools > Network 标签，观察 `user_form_code` 的 upsert 请求）
5. 刷新页面，应该看到上次编辑的代码（而不是初始代码）

### 测试 3: 提交代码

1. 在已登录状态下，完成一个教程的代码
2. 点击"提交"或"运行"按钮
3. 观察 Network 标签中的 `submit_form` Edge Function 调用
4. 在 Supabase Dashboard 中查看 `user_form_status` 表，应该看到新增的记录

## 数据库查询

在 Supabase SQL Editor 中运行以下查询来查看数据：

```sql
-- 查看所有用户代码
SELECT 
  form_id, 
  LEFT(code_content, 50) as code_preview,
  version,
  created_at,
  updated_at
FROM user_form_code
ORDER BY updated_at DESC;

-- 查看用户提交状态
SELECT 
  form_id,
  has_submitted,
  is_passed,
  attempts,
  last_submitted_at
FROM user_form_status
ORDER BY last_submitted_at DESC;
```

## Edge Function 测试

Edge Function 已部署到 Supabase。可以手动测试：

```bash
# 使用 curl 测试（需要替换 YOUR_JWT_TOKEN）
curl -X POST 'https://fkgudvpbetdsjmtdpkge.supabase.co/functions/v1/submit_form' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"formId": "hello-world"}'
```

## 常见问题

### Q: 代码没有自动保存？

**A:** 检查以下几点：
1. 确保已登录
2. 检查浏览器 Console 是否有错误
3. 确认环境变量配置正确
4. 检查 Network 标签，看是否有 `401 Unauthorized` 错误

### Q: Edge Function 调用失败？

**A:** 检查：
1. `SUPABASE_SERVICE_ROLE_KEY` 是否配置正确
2. Edge Function 是否已部署（在 Supabase Dashboard > Edge Functions 查看）
3. 查看 Edge Function 日志：Supabase Dashboard > Edge Functions > submit_form > Logs

### Q: RLS 策略导致无法读写数据？

**A:** 验证：
1. 用户已登录（`auth.uid()` 不为空）
2. RLS 策略已正确创建（运行上面的 SQL 验证脚本）
3. 尝试在 SQL Editor 中直接查询（使用 service_role 权限）

## 下一步

- [ ] 实现 Edge Function 的真实判题逻辑
- [ ] 创建用户进度仪表板页面
- [ ] 添加代码历史版本功能
- [ ] 优化性能和安全性

## 相关文档

- [详细实施报告](./IMPLEMENTATION_REPORT.md)
- [详情页设计指南](./detail.md)
- [Supabase 设置指南](./supabase-auth-setup.md)

## 技术支持

遇到问题？查看：
1. [Supabase 文档](https://supabase.com/docs)
2. [Next.js 文档](https://nextjs.org/docs)
3. 项目 GitHub Issues
