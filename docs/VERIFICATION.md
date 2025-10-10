# 🧪 Supabase 集成验证脚本

本文档提供了验证 Supabase 集成是否正确工作的 SQL 查询和测试步骤。

## 数据库验证

在 [Supabase SQL Editor](https://app.supabase.com/project/fkgudvpbetdsjmtdpkge/sql/new) 中运行以下查询：

### 1. 验证表已创建

```sql
SELECT 
  tablename,
  schemaname
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_form_code', 'user_form_status')
ORDER BY tablename;
```

**预期结果**: 应返回 2 行（`user_form_code` 和 `user_form_status`）

### 2. 验证 RLS 已启用

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_form_code', 'user_form_status');
```

**预期结果**: 两个表的 `rls_enabled` 都应该是 `true`

### 3. 验证 RLS 策略

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_form_code', 'user_form_status')
ORDER BY tablename, policyname;
```

**预期结果**: 
- `user_form_code`: 3 个策略（select_own, insert_own, update_own）
- `user_form_status`: 1 个策略（select_own）

### 4. 验证触发器

```sql
SELECT 
  trigger_schema,
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table IN ('user_form_code', 'user_form_status');
```

**预期结果**: 2 个触发器
- `trig_user_form_code_upd` on `user_form_code`
- `trig_user_form_status_upd` on `user_form_status`

### 5. 验证函数

```sql
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('set_updated_at_and_bump_version', 'ensure_user_form_code');
```

**预期结果**: 2 个函数，都应该是 `DEFINER`

### 6. 验证索引

```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('user_form_code', 'user_form_status')
AND indexname LIKE 'idx_%';
```

**预期结果**: 2 个索引
- `idx_user_form_code_form` on `user_form_code(form_id)`
- `idx_user_form_status_form` on `user_form_status(form_id)`

## Edge Function 验证

### 1. 检查 Edge Function 状态

访问: [Edge Functions Dashboard](https://app.supabase.com/project/fkgudvpbetdsjmtdpkge/functions)

**预期结果**: 应该看到 `submit_form` 函数，状态为 ACTIVE

### 2. 查看 Edge Function 日志

点击 `submit_form` > Logs 标签

**测试方法**: 
1. 在应用中触发一次提交
2. 刷新日志页面
3. 应该看到新的日志条目

### 3. 手动测试 Edge Function

```bash
# 在本地终端运行（需要替换 JWT token）
# 获取 JWT: 登录后在浏览器 DevTools > Application > Storage > supabase.auth.token

curl -X POST \
  'https://fkgudvpbetdsjmtdpkge.supabase.co/functions/v1/submit_form' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"formId": "test-tutorial"}'
```

**预期响应**:
```json
{
  "passed": false,
  "attempts": 1,
  "lastResult": {
    "message": "Placeholder validation - please implement actual judging logic",
    "timestamp": "2025-10-08T..."
  },
  "firstPassedAt": null,
  "isPassed": false
}
```

## 应用功能测试

### 测试 1: 数据隔离（RLS）

**目的**: 验证用户只能看到自己的数据

**步骤**:
1. 用账号 A 登录，提交代码
2. 登出，用账号 B 登录
3. 访问同一个教程

**预期结果**: 账号 B 看不到账号 A 的代码

**SQL 验证**:
```sql
-- 以 service_role 权限查看所有数据
SELECT user_id, form_id, LEFT(code_content, 20) as code_preview
FROM user_form_code;

-- 应该看到不同 user_id 的记录
```

### 测试 2: 自动保存

**目的**: 验证代码会自动保存

**步骤**:
1. 登录
2. 打开一个教程
3. 修改代码
4. 等待 2 秒
5. 打开 DevTools > Network > 筛选 "user_form_code"
6. 应该看到 PATCH/POST 请求

**SQL 验证**:
```sql
SELECT 
  form_id,
  version,
  updated_at,
  LEFT(code_content, 50) as code
FROM user_form_code
WHERE user_id = 'YOUR_USER_ID'
ORDER BY updated_at DESC;
```

### 测试 3: 版本递增

**目的**: 验证 version 字段自动递增

**步骤**:
1. 记录当前 version（通过上面的 SQL）
2. 修改代码并保存
3. 再次运行 SQL 查询

**预期结果**: version 应该 +1

### 测试 4: 提交状态

**目的**: 验证提交会更新状态表

**步骤**:
1. 完成并提交一个教程
2. 运行下面的 SQL

**SQL 验证**:
```sql
SELECT 
  form_id,
  has_submitted,
  is_passed,
  attempts,
  last_submitted_at,
  last_result
FROM user_form_status
WHERE user_id = 'YOUR_USER_ID'
ORDER BY last_submitted_at DESC;
```

**预期结果**: 
- `has_submitted` = true
- `attempts` >= 1
- `last_result` 包含判题信息

### 测试 5: 服务端预取

**目的**: 验证刷新页面后代码保持不变

**步骤**:
1. 修改代码并等待自动保存
2. 硬刷新页面（Ctrl+F5）
3. 代码应该还是修改后的版本

**验证**: 查看 Network > 页面请求 > Response，应该包含你的代码

## 性能和安全审计

### 1. 检查 Security Advisors

```sql
-- 不应该有严重的安全警告
-- 在 Supabase Dashboard > Database > Advisors 查看
```

**预期结果**: 
- ✅ RLS 策略已优化（使用 `(select auth.uid())`）
- ✅ 函数 search_path 已设置
- ⚠️ 密码泄露保护未启用（可选）

### 2. 检查 Performance Advisors

```sql
-- 索引应该被正确创建
-- 暂时可能显示"未使用"，因为数据量少
```

## 常见问题排查

### 问题: RLS 策略阻止了访问

**检查**:
```sql
-- 1. 验证用户已登录
SELECT auth.uid();  -- 不应该是 null

-- 2. 检查策略定义
SELECT * FROM pg_policies WHERE tablename = 'user_form_code';
```

**解决**: 确保 `auth.uid()` 返回有效的 UUID

### 问题: 自动保存失败

**检查**:
1. 浏览器 Console 是否有错误
2. Network 标签是否有 401/403 错误
3. 环境变量是否正确配置

**SQL 调试**:
```sql
-- 尝试手动插入（应该失败，因为 RLS）
INSERT INTO user_form_code (user_id, form_id, code_content)
VALUES ('00000000-0000-0000-0000-000000000000', 'test', 'test');
-- 预期: 权限拒绝

-- 使用当前用户插入（应该成功）
INSERT INTO user_form_code (user_id, form_id, code_content)
VALUES (auth.uid(), 'test-form', 'test code');
```

### 问题: Edge Function 调用失败

**检查 Logs**:
1. 访问 Supabase Dashboard > Edge Functions > submit_form > Logs
2. 查找错误信息

**常见错误**:
- `Missing authorization header`: JWT token 未传递
- `Unauthorized`: JWT token 无效或过期
- `Missing formId`: 请求体格式错误

## 数据清理（开发环境）

如果需要重置测试数据：

```sql
-- ⚠️ 警告: 这会删除所有用户数据！
-- 仅在开发环境使用

-- 删除所有用户代码
DELETE FROM user_form_code;

-- 删除所有提交状态
DELETE FROM user_form_status;

-- 重置序列（如果有）
-- ALTER SEQUENCE ... RESTART WITH 1;
```

## 验证清单

- [ ] 数据库表已创建
- [ ] RLS 已启用
- [ ] RLS 策略已创建并优化
- [ ] 触发器正常工作
- [ ] Edge Function 已部署且可访问
- [ ] 自动保存功能正常
- [ ] 服务端预取功能正常
- [ ] 提交到 Edge Function 正常
- [ ] 数据隔离（不同用户看不到彼此的数据）
- [ ] 版本控制自动递增
- [ ] 安全和性能警告已处理

全部完成后，您的 Supabase 集成就可以投入使用了！🎉
