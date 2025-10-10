# 修复 OAuth 重定向到 localhost 的问题

## 问题现象
部署到生产环境 `https://www.shader-learn.com` 后，点击 Google 登录会跳转到 `http://localhost:3000/?code=xxx`

## ⚠️ 根本原因
这不是代码问题，而是 **Supabase 项目配置问题**！

Supabase 的 OAuth 流程会使用项目中配置的 Site URL 和 Redirect URLs，而不是代码中指定的 `redirectTo`。

## ✅ 解决步骤

### 1️⃣ 登录 Supabase Dashboard

访问：https://app.supabase.com/project/fkgudvpbetdsjmtdpkge

### 2️⃣ 修改 Site URL（关键！）

1. 进入 **Authentication** → **URL Configuration**
2. 找到 **Site URL** 字段
3. 将其从 `http://localhost:3000` 修改为：
   ```
   https://www.shader-learn.com
   ```

> ⚠️ **这是最关键的配置！** Site URL 是 Supabase 在 OAuth 流程中使用的默认基础 URL。

### 3️⃣ 添加 Redirect URLs（白名单）

在同一页面的 **Redirect URLs** 部分，添加以下 URL（每行一个）：

```
http://localhost:3000/auth/callback
https://www.shader-learn.com/auth/callback
https://www.shader-learn.com/**
```

> 💡 **说明：**
> - 第一行用于本地开发
> - 第二行是生产环境的回调 URL
> - 第三行允许所有生产域名下的路径（可选）

### 4️⃣ 检查 OAuth Provider 配置

进入 **Authentication** → **Providers**：

#### Google Provider
- 确保 **Enabled** 已开启
- **Redirect URL** 应该显示为：
  ```
  https://fkgudvpbetdsjmtdpkge.supabase.co/auth/v1/callback
  ```
- 这个 URL 需要添加到 Google Cloud Console 的授权重定向 URI 中

#### GitHub Provider（如果使用）
- 同样确保已启用
- 使用相同的 Supabase callback URL

### 5️⃣ Google Cloud Console 配置

访问 [Google Cloud Console](https://console.cloud.google.com/)：

1. 选择您的项目
2. 进入 **APIs & Services** → **Credentials**
3. 找到您的 OAuth 2.0 客户端 ID
4. 在 **授权的重定向 URI** 中添加：
   ```
   https://fkgudvpbetdsjmtdpkge.supabase.co/auth/v1/callback
   ```

### 6️⃣ 验证配置

完成以上步骤后：

1. 等待 1-2 分钟让配置生效
2. 访问 `https://www.shader-learn.com/signin`
3. 点击 Google 登录
4. 应该会跳转到 Google 授权页面
5. 授权后应该跳转回 `https://www.shader-learn.com/auth/callback?code=xxx`
6. 最终跳转到 `https://www.shader-learn.com/`

## 📋 配置检查清单

- [ ] Supabase Site URL 设置为 `https://www.shader-learn.com`
- [ ] Supabase Redirect URLs 包含 `https://www.shader-learn.com/auth/callback`
- [ ] Google OAuth 配置中包含 Supabase 的 callback URL
- [ ] 代码中的环境变量正确（虽然不是主要问题）

## 🔍 为什么会这样？

Supabase 的 OAuth 流程：

1. 用户点击"使用 Google 登录"
2. Supabase 使用 **Site URL** 构建回调地址
3. 跳转到 Google 进行授权
4. Google 授权后跳转回 Supabase 的 callback endpoint
5. Supabase 处理后重定向到配置的 Site URL + 代码中的 redirectTo 路径

**如果 Site URL 是 localhost，即使代码中指定了正确的 redirectTo，最终还是会跳转到 localhost！**

## 🚫 常见错误

### 错误 1：只修改了代码中的环境变量
❌ 修改 `.env.local` 或部署平台的环境变量不会影响 Supabase 的行为
✅ 必须在 Supabase Dashboard 中修改

### 错误 2：只修改了 Redirect URLs
❌ 只添加 Redirect URLs 到白名单不够
✅ 必须同时修改 Site URL

### 错误 3：没有更新 Google OAuth 配置
❌ 如果 Google Console 中没有 Supabase 的 callback URL，会授权失败
✅ 确保 Google Console 中包含正确的 Supabase callback URL

## 📱 测试建议

### 本地测试
```bash
# 访问 localhost
http://localhost:3000/signin
# 应该正常工作（因为 Redirect URLs 包含 localhost）
```

### 生产测试
```bash
# 访问生产域名
https://www.shader-learn.com/signin
# 应该正常工作（因为 Site URL 已设置为生产域名）
```

## 💡 额外提示

### 多环境配置
如果需要支持多个环境（开发、预览、生产），可以：

1. **方案 A**：使用不同的 Supabase 项目
   - 开发项目：Site URL = localhost
   - 生产项目：Site URL = 生产域名

2. **方案 B**：在同一项目中添加所有 URL 到白名单
   - 缺点：Site URL 只能设置一个，其他环境可能需要手动处理

### 检查当前配置
在浏览器控制台运行：
```javascript
console.log(window.location.origin)
// 应该输出: https://www.shader-learn.com
```

### 调试技巧
打开浏览器开发者工具 → Network 标签，观察登录时的请求：
1. 查找 `signInWithOAuth` 相关请求
2. 检查请求中的 `redirect_to` 参数
3. 观察最终的重定向链

## 🎉 完成后
配置正确后，OAuth 登录应该能够在生产环境正常工作，不再跳转到 localhost！
