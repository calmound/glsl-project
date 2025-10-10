# 🔍 认证状态测试

## 问题分析

从日志看到：
```
codeSource: '练习代码'  // 表示没有从数据库加载代码
hasServerInitialCode: false  // 表示服务端没有预取到用户代码
```

这说明：
1. 用户可能**没有登录**
2. 或者登录了但是**没有保存过代码**

## 测试步骤

### 1. 检查登录状态

打开浏览器控制台，运行以下代码：

```javascript
// 检查当前用户
import { createBrowserClient } from '@supabase/ssr';
const supabase = createBrowserClient(
  'https://fkgudvpbetdsjmtdpkge.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZ3VkdnBiZXRkc2ptdGRwa2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NzAyNzksImV4cCI6MjA3NTA0NjI3OX0.DlfKbscC7VDow5W8L3X-ewbMu-njDMNuOQJkBubR4uY'
);

const { data: { user } } = await supabase.auth.getUser();
console.log('当前用户:', user);
```

### 2. 快速测试（更简单）

在浏览器控制台直接运行：

```javascript
// 检查 localStorage 中的认证信息
const keys = Object.keys(localStorage).filter(k => k.includes('supabase'));
console.log('Supabase 存储的 key:', keys);

// 查看认证 token
keys.forEach(key => {
  console.log(key, ':', localStorage.getItem(key));
});
```

### 3. 查看页面右上角

- ✅ 如果看到用户头像或邮箱 → 已登录
- ❌ 如果看到 "Login" 按钮 → 未登录

## 如果未登录

### 方法 1: 点击登录按钮

1. 点击页面右上角的 "Login" 按钮
2. 使用 Google 账号登录
3. 登录成功后刷新页面

### 方法 2: 直接访问登录页

访问: http://localhost:3000/login

## 登录后测试保存功能

1. 访问教程页面: `http://localhost:3000/learn/basic/basic-color-blend`
2. 打开浏览器控制台 (F12)
3. 修改代码（例如改变颜色）
4. 等待 2 秒，观察日志：

**预期日志**:
```
💾 [客户端] 开始保存代码到数据库...
💾 [客户端] 正在获取用户信息...
💾 [客户端] 用户状态: 已登录 (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
💾 [客户端] 准备保存数据: { formId: 'basic-color-blend', codeLength: xxx, userId: 'xxx' }
💾 [客户端] 发送 upsert 请求...
💾 [客户端] 请求耗时: 123ms
✅ [客户端] 代码保存成功: { formId: 'basic-color-blend', codeLength: xxx, duration: '123ms' }
```

5. 刷新页面 (Ctrl + F5)
6. 观察是否显示:

```
codeSource: '数据库'  // 表示从数据库加载
hasServerInitialCode: true  // 表示服务端预取成功
```

## 常见问题

### Q: 日志显示"未登录，跳过保存"

**A**: 需要先登录
- 方案: 点击页面右上角 "Login" → 使用 Google 登录

### Q: 请求一直没有返回

**A**: 可能是网络问题或 RLS 策略问题
1. 检查 Network 标签，看请求状态
2. 检查是否有红色错误
3. 查看错误详情

### Q: 看到 401 或 403 错误

**A**: 认证问题
1. 清空浏览器缓存和 localStorage
2. 重新登录

## 数据库直接验证

如果登录了但还是不行，在 Supabase SQL Editor 运行：

```sql
-- 查看所有用户代码
SELECT 
  user_id,
  form_id,
  LEFT(code_content, 50) as code_preview,
  LENGTH(code_content) as code_length,
  created_at,
  updated_at
FROM user_form_code
ORDER BY updated_at DESC
LIMIT 10;
```

如果表是空的，说明确实没有保存成功。
