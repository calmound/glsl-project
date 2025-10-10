# 🔍 数据加载调试指南

## 测试步骤

### 1. 重启开发服务器

```powershell
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
pnpm dev
```

### 2. 清空浏览器控制台

1. 打开 Chrome DevTools (F12)
2. 切换到 Console 标签
3. 点击清空按钮 🗑️

### 3. 访问教程页面并观察日志

访问一个你已经保存过代码的教程，例如：
```
http://localhost:3000/learn/basic/hello-world
```

## 预期看到的日志流程

### 🟢 完整的日志链路

#### A. 服务端日志（终端中）

```
🔍 [服务端] 开始预取用户代码...
🔍 [服务端] 用户登录状态: 已登录 (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
🔍 [服务端] 教程ID: hello-world
🔍 [服务端] 正在查询数据库...
🔍 [服务端] 数据库查询结果: {
  hasData: true,
  hasError: false,
  codeLength: 456,
  error: undefined
}
✅ [服务端] 成功加载用户代码: {
  formId: 'hello-world',
  codeLength: 456,
  codePreview: 'precision mediump float;\nuniform vec2 u_resol...'
}
🔍 [服务端] 最终 initialCode: 已设置 (456 字符)
🔍 [服务端] 默认代码来源: exercise
```

#### B. 浏览器控制台日志

```
🔍 [客户端] TutorialPageClient 初始化: {
  tutorialId: 'hello-world',
  hasServerInitialCode: true,
  serverInitialCodeLength: 456,
  hasExercise: true,
  hasFragment: true,
  finalExerciseCodeLength: 456,
  codeSource: '数据库'
}
⏱️ [客户端] 代码已更改，设置 2 秒后自动保存...
```

### 🟡 如果数据库没有数据

#### 服务端日志
```
🔍 [服务端] 数据库查询结果: {
  hasData: false,
  hasError: false,
  codeLength: 0
}
ℹ️ [服务端] 用户尚未保存此教程的代码: hello-world
🔍 [服务端] 最终 initialCode: 使用默认代码
```

#### 浏览器控制台
```
🔍 [客户端] TutorialPageClient 初始化: {
  hasServerInitialCode: false,
  codeSource: '练习代码'
}
```

### 🔴 如果出现错误

#### 可能的错误 1: RLS 阻止访问
```
❌ [服务端] 数据库查询错误: {
  message: 'row-level security policy violation'
}
```

**解决方案**: 检查 RLS 策略

#### 可能的错误 2: 未登录
```
🔍 [服务端] 用户登录状态: 未登录
```

**解决方案**: 先登录

## 测试场景

### 场景 1: 首次访问（无保存数据）

1. 访问一个新教程
2. **服务端应显示**: `ℹ️ 用户尚未保存此教程的代码`
3. **客户端应显示**: `codeSource: '练习代码'`
4. 编辑器显示初始练习代码

### 场景 2: 修改并保存

1. 修改代码（例如改变颜色值）
2. 等待 2 秒
3. **应该看到**:
   ```
   ⏱️ [客户端] 代码已更改，设置 2 秒后自动保存...
   ⏱️ [客户端] 2 秒已到，触发保存...
   💾 [客户端] 开始保存代码到数据库...
   💾 [客户端] 用户状态: 已登录 (xxx)
   💾 [客户端] 准备保存数据: { formId: 'hello-world', codeLength: 460, ... }
   ✅ [客户端] 代码保存成功: { formId: 'hello-world', codeLength: 460 }
   ```

### 场景 3: 刷新页面（硬刷新）

1. 按 Ctrl + F5 硬刷新
2. **服务端应显示**:
   ```
   ✅ [服务端] 成功加载用户代码: { formId: 'hello-world', codeLength: 460, ... }
   ```
3. **客户端应显示**:
   ```
   🔍 [客户端] TutorialPageClient 初始化: {
     hasServerInitialCode: true,
     serverInitialCodeLength: 460,
     codeSource: '数据库'
   }
   ```
4. 编辑器显示你之前修改的代码（不是初始代码）

## 验证检查清单

- [ ] 服务端日志显示"开始预取用户代码"
- [ ] 服务端日志显示用户登录状态（已登录）
- [ ] 服务端日志显示"正在查询数据库"
- [ ] 服务端日志显示查询结果（hasData: true）
- [ ] 服务端日志显示"成功加载用户代码"
- [ ] 服务端日志显示代码长度和预览
- [ ] 客户端日志显示"TutorialPageClient 初始化"
- [ ] 客户端日志显示 `hasServerInitialCode: true`
- [ ] 客户端日志显示 `codeSource: '数据库'`
- [ ] 编辑器内容与数据库中的代码一致

## 数据库验证

在 Supabase SQL Editor 中运行：

```sql
-- 查看你的用户代码
SELECT 
  form_id,
  LEFT(code_content, 100) as code_preview,
  LENGTH(code_content) as code_length,
  version,
  updated_at
FROM user_form_code
WHERE user_id = (SELECT auth.uid())
ORDER BY updated_at DESC;
```

对比：
- `code_length` 应该与日志中的 `codeLength` 一致
- `code_preview` 应该与日志中的 `codePreview` 一致

## 故障排查

### 问题: 看不到任何服务端日志

**可能原因**: 
- 开发服务器没有在终端中运行
- 使用了生产构建而不是开发模式

**解决**: 
```powershell
pnpm dev
```

### 问题: 显示"未登录"

**解决**:
1. 点击页面右上角 "Login"
2. 使用 Google 登录
3. 刷新页面

### 问题: 显示"数据库查询错误"

**检查**:
1. 环境变量是否正确
2. RLS 策略是否正确
3. 运行验证 SQL

### 问题: codeSource 显示"练习代码"而不是"数据库"

**原因**: 
- 数据库中确实没有数据
- 或者 `form_id` 不匹配

**验证**:
```sql
-- 检查 form_id
SELECT DISTINCT form_id FROM user_form_code;

-- 应该看到类似: hello-world, basic-shapes 等
```

## 成功标志

✅ 如果你看到以下日志序列，说明一切正常：

1. 服务端: `✅ 成功加载用户代码`
2. 客户端: `codeSource: '数据库'`
3. 编辑器显示你保存的代码
4. 代码长度与数据库一致

---

现在请按照上述步骤测试，并告诉我你看到了什么！
