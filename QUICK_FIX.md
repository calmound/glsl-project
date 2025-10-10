# 🚀 快速修复：3 步解决 OAuth 重定向问题

## 问题
点击 Google 登录后跳转到 `http://localhost:3000/?code=xxx`

## ⚡ 3 步快速修复

### 第 1 步：访问 Supabase Dashboard
```
https://app.supabase.com/project/fkgudvpbetdsjmtdpkge/auth/url-configuration
```

### 第 2 步：修改 Site URL
找到 **Site URL** 字段，修改为：
```
https://www.shader-learn.com
```

### 第 3 步：添加 Redirect URLs
在 **Redirect URLs** 中添加（一行一个）：
```
http://localhost:3000/auth/callback
https://www.shader-learn.com/auth/callback
```

点击 **Save** 保存！

---

## ✅ 立即测试
1. 等待 1 分钟
2. 访问：`https://www.shader-learn.com/signin`
3. 点击 Google 登录
4. 应该正确跳转了！

---

## 📌 额外检查（如果还不行）

### 检查 Google Cloud Console
访问：https://console.cloud.google.com/apis/credentials

确保 **授权的重定向 URI** 包含：
```
https://fkgudvpbetdsjmtdpkge.supabase.co/auth/v1/callback
```

---

## 🔗 详细文档
查看完整说明：`docs/fix-oauth-redirect.md`
