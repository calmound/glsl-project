# 数据库架构文档

本文档详细说明 GLSL 学习平台的 Supabase 数据库架构，包括所有表、字段、关系和用途。

## 目录
- [数据库概览](#数据库概览)
- [认证系统](#认证系统)
- [用户表](#用户表)
- [学习数据表](#学习数据表)
- [表关系图](#表关系图)
- [索引策略](#索引策略)
- [RLS 策略](#rls-策略)
- [数据迁移](#数据迁移)

---

## 数据库概览

### 技术栈
- **数据库**: PostgreSQL 17.6 (Supabase 托管)
- **认证**: Supabase Auth (OAuth)
- **访问控制**: Row Level Security (RLS)
- **区域**: US West 1

### 数据库结构
```
glsl-learning-platform (Database)
├── auth.users                  # Supabase 认证表（系统表）
├── public.profiles             # 用户资料表
├── public.user_form_code       # 用户代码存储表
└── public.user_form_status     # 习题状态跟踪表
```

---

## 认证系统

### `auth.users` (Supabase 系统表)

这是 Supabase Auth 的核心表，由系统自动管理，**不可直接修改**。

#### 关键字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 用户唯一标识符（主键） |
| `email` | TEXT | 用户邮箱 |
| `encrypted_password` | TEXT | 加密后的密码（OAuth 用户为空） |
| `email_confirmed_at` | TIMESTAMPTZ | 邮箱确认时间 |
| `last_sign_in_at` | TIMESTAMPTZ | 最后登录时间 |
| `raw_app_meta_data` | JSONB | 应用元数据 |
| `raw_user_meta_data` | JSONB | 用户元数据（OAuth 信息） |
| `created_at` | TIMESTAMPTZ | 创建时间 |
| `updated_at` | TIMESTAMPTZ | 更新时间 |

#### 用途

- **核心认证**: 存储用户认证信息
- **OAuth 集成**: 支持 Google、GitHub 登录
- **会话管理**: 管理 JWT token 和刷新 token

#### `raw_user_meta_data` 结构示例

```json
{
  "iss": "https://accounts.google.com",
  "sub": "123456789",
  "name": "张三",
  "email": "zhangsan@gmail.com",
  "avatar_url": "https://lh3.googleusercontent.com/...",
  "full_name": "张三",
  "provider_id": "123456789",
  "email_verified": true
}
```

#### 注意事项

⚠️ **不要直接操作此表**，使用 Supabase Auth API：
```typescript
// 获取用户
const { data: { user } } = await supabase.auth.getUser();

// 登出
await supabase.auth.signOut();
```

---

## 用户表

### `public.profiles` - 用户资料表

扩展 `auth.users` 的用户信息，存储业务相关的用户数据。

#### 表结构

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 字段详解

| 字段 | 类型 | 约束 | 说明 | 示例 |
|------|------|------|------|------|
| `id` | UUID | PRIMARY KEY, FK | 用户 ID（与 auth.users.id 关联） | `0089c2fb-35fe-4e10-90f8-60e56047d709` |
| `email` | TEXT | - | 用户邮箱（冗余存储，方便查询） | `zhangsan@gmail.com` |
| `name` | TEXT | - | 用户显示名称 | `张三` |
| `avatar_url` | TEXT | - | 用户头像 URL | `https://lh3.googleusercontent.com/...` |
| `last_login_at` | TIMESTAMPTZ | - | 最后登录时间（用于统计） | `2025-12-13 10:30:00+00` |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 创建时间 | `2025-10-03 05:44:39+00` |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 更新时间 | `2025-12-13 12:04:51+00` |

#### 用途

1. **用户信息展示**: 显示用户名和头像
2. **登录统计**: 记录最后登录时间
3. **用户管理**: 业务层面的用户数据管理

#### 数据同步

在 OAuth 登录成功后（`/auth/callback`），自动同步数据：

```typescript
// 从 auth.users 同步到 profiles
const { data: { user } } = await supabase.auth.getUser();

await supabase.from('profiles').upsert({
  id: user.id,
  email: user.email,
  name: user.user_metadata.full_name || user.user_metadata.name,
  avatar_url: user.user_metadata.avatar_url,
  last_login_at: new Date().toISOString()
}, { onConflict: 'id' });
```

#### 索引

```sql
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_last_login ON profiles(last_login_at DESC);
```

#### RLS 策略

```sql
-- 用户可以查看所有公开资料
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- 用户只能更新自己的资料
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

---

## 学习数据表

### `public.user_form_code` - 用户代码存储表

存储用户在习题编辑器中编写的 GLSL 代码，支持自动保存和草稿功能。

#### 表结构

```sql
CREATE TABLE public.user_form_code (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id TEXT NOT NULL,
  code_content TEXT NOT NULL,
  language TEXT DEFAULT 'glsl',
  is_draft BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT user_form_code_unique UNIQUE (user_id, form_id)
);
```

#### 字段详解

| 字段 | 类型 | 约束 | 说明 | 示例 |
|------|------|------|------|------|
| `id` | UUID | PRIMARY KEY | 记录唯一标识符 | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| `user_id` | UUID | NOT NULL, FK | 用户 ID（外键） | `0089c2fb-35fe-4e10-90f8-60e56047d709` |
| `form_id` | TEXT | NOT NULL | 习题 ID（格式：`category-id`） | `basic-two-color-gradient` |
| `code_content` | TEXT | NOT NULL | GLSL 代码内容 | `void main() { ... }` |
| `language` | TEXT | DEFAULT 'glsl' | 代码语言（保留字段） | `glsl` |
| `is_draft` | BOOLEAN | DEFAULT true | 是否为草稿（保留字段） | `true` |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 创建时间 | `2025-12-13 10:00:00+00` |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 最后修改时间 | `2025-12-13 12:30:00+00` |

#### 约束

**唯一约束**: `UNIQUE (user_id, form_id)`
- 每个用户对每个习题只能有一份代码记录
- 使用 `UPSERT` 操作自动更新已有记录

#### 用途

1. **自动保存**: 用户编辑代码时自动保存（防抖 2 秒）
2. **断点续做**: 用户下次打开习题时自动恢复上次的代码
3. **代码历史**: 保留用户的编码进度（当前只保留最新版本）

#### 数据流程

```
用户编辑代码 → 防抖 2 秒 → UPSERT user_form_code
                              ↓
                         如果记录存在 → 更新 code_content 和 updated_at
                         如果记录不存在 → 创建新记录
```

#### 操作示例

**保存代码**:
```typescript
await supabase.from('user_form_code').upsert({
  user_id: user.id,
  form_id: 'basic-two-color-gradient',
  code_content: fragmentShaderCode,
  language: 'glsl',
  is_draft: true
}, { onConflict: 'user_id,form_id' });
```

**读取代码**:
```typescript
const { data } = await supabase
  .from('user_form_code')
  .select('code_content')
  .eq('user_id', user.id)
  .eq('form_id', 'basic-two-color-gradient')
  .maybeSingle();
```

#### 索引

```sql
CREATE INDEX idx_user_form_code_user ON user_form_code(user_id);
CREATE INDEX idx_user_form_code_form ON user_form_code(form_id);
CREATE INDEX idx_user_form_code_updated ON user_form_code(updated_at DESC);
```

#### RLS 策略

```sql
-- 用户只能查看自己的代码
CREATE POLICY "Users can view own code"
  ON user_form_code FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能插入自己的代码
CREATE POLICY "Users can insert own code"
  ON user_form_code FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的代码
CREATE POLICY "Users can update own code"
  ON user_form_code FOR UPDATE
  USING (auth.uid() = user_id);

-- 用户可以删除自己的代码
CREATE POLICY "Users can delete own code"
  ON user_form_code FOR DELETE
  USING (auth.uid() = user_id);
```

---

### `public.user_form_status` - 习题状态跟踪表

记录用户的习题完成状态、提交历史和学习进度。这是**学习进度系统的核心表**。

#### 表结构

```sql
CREATE TABLE public.user_form_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id TEXT NOT NULL,
  has_submitted BOOLEAN DEFAULT false,
  attempts INT DEFAULT 0,
  is_passed BOOLEAN DEFAULT false,
  first_passed_at TIMESTAMPTZ,
  last_submitted_at TIMESTAMPTZ,
  last_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT user_form_status_unique UNIQUE (user_id, form_id)
);
```

#### 字段详解

| 字段 | 类型 | 约束 | 说明 | 示例 |
|------|------|------|------|------|
| `id` | UUID | PRIMARY KEY | 记录唯一标识符 | `b2c3d4e5-f6a7-8901-bcde-f12345678901` |
| `user_id` | UUID | NOT NULL, FK | 用户 ID | `0089c2fb-35fe-4e10-90f8-60e56047d709` |
| `form_id` | TEXT | NOT NULL | 习题 ID | `basic-two-color-gradient` |
| `has_submitted` | BOOLEAN | DEFAULT false | 是否至少提交过一次 | `true` |
| `attempts` | INT | DEFAULT 0 | 累计提交次数（包括失败） | `3` |
| `is_passed` | BOOLEAN | DEFAULT false | 是否通过验证（一旦为 true 不回退） | `true` |
| `first_passed_at` | TIMESTAMPTZ | NULLABLE | 首次通过时间 | `2025-12-13 10:30:00+00` |
| `last_submitted_at` | TIMESTAMPTZ | NULLABLE | 最后提交时间 | `2025-12-13 12:45:00+00` |
| `last_result` | JSONB | NULLABLE | 最后一次验证结果（JSON） | 见下方示例 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 记录创建时间 | `2025-12-13 10:00:00+00` |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 记录更新时间 | `2025-12-13 12:45:00+00` |

#### `last_result` JSON 结构

```json
{
  "message": "Shader compiled successfully and rendering is correct",
  "timestamp": "2025-12-13T10:30:00.000Z",
  "validatedBy": "client-webgl-renderer"
}
```

#### 字段详细说明

**`has_submitted`** - 提交标记
- 用途：标记用户是否尝试过提交
- 更新时机：第一次调用 `submit_form` Edge Function
- 业务逻辑：用于区分"未尝试"和"尝试但未通过"

**`attempts`** - 尝试次数
- 用途：统计用户的提交次数
- 更新规则：每次提交 +1（无论成功或失败）
- 业务价值：
  - 分析习题难度
  - 用户学习行为分析
  - 显示在学习路径中（"3 次尝试"）

**`is_passed`** - 通过状态
- 用途：记录用户是否通过该习题
- 更新规则：
  - 初始值：`false`
  - 首次通过：设为 `true`
  - **重要**：一旦为 `true`，永不回退为 `false`
- 业务逻辑：
  - 用于学习路径显示绿色完成标记 ✓
  - 计算分类完成百分比
  - 统计学习进度

**`first_passed_at`** - 首次通过时间
- 用途：记录用户首次完成习题的时间戳
- 更新规则：
  - 仅在 `is_passed` 从 `false` → `true` 时写入
  - 一旦写入，永不修改
- 业务价值：
  - 学习时长统计
  - 学习进度跟踪
  - 成就系统（未来）

**`last_submitted_at`** - 最后提交时间
- 用途：记录最近一次提交时间
- 更新规则：每次提交都更新
- 业务价值：
  - 识别活跃用户
  - 学习活跃度分析

**`last_result`** - 验证结果
- 用途：保存最后一次验证的详细结果
- 格式：JSONB（灵活的 JSON 结构）
- 内容：
  - `message`: 验证消息
  - `timestamp`: 验证时间
  - `validatedBy`: 验证器标识
- 未来扩展：可添加更多字段（如错误详情、分数等）

#### 约束

**唯一约束**: `UNIQUE (user_id, form_id)`
- 每个用户对每个习题只能有一条状态记录

#### 状态转换图

```
初始状态
  has_submitted: false
  attempts: 0
  is_passed: false
  ↓
第一次提交失败
  has_submitted: true
  attempts: 1
  is_passed: false
  ↓
第二次提交失败
  has_submitted: true
  attempts: 2
  is_passed: false
  ↓
第三次提交成功
  has_submitted: true
  attempts: 3
  is_passed: true ← 永不回退
  first_passed_at: 2025-12-13T10:30:00Z
  ↓
后续提交（即使失败）
  has_submitted: true
  attempts: 4
  is_passed: true ← 保持为 true
  first_passed_at: 2025-12-13T10:30:00Z ← 保持不变
```

#### 业务规则

1. **只增不减原则**:
   - `attempts` 只增不减
   - `is_passed` 一旦为 `true` 永不回退
   - `first_passed_at` 一旦设置永不修改

2. **原子更新**:
   - 所有字段在一次 `UPSERT` 操作中更新
   - 由 Edge Function `submit_form` 使用 `service_role` 权限执行

3. **权限隔离**:
   - 用户只能 `SELECT` 自己的状态
   - **不能直接 INSERT/UPDATE**（防止作弊）
   - 只能通过 Edge Function 更新

#### 操作示例

**通过 Edge Function 更新状态**:
```typescript
// Edge Function: submit_form
const updateData = {
  user_id: userId,
  form_id: formId,
  has_submitted: true,
  attempts: currentAttempts + 1,
  last_submitted_at: new Date().toISOString(),
  last_result: {
    message: isPassed ? 'Success' : 'Failed',
    timestamp: new Date().toISOString(),
    validatedBy: 'client-webgl-renderer'
  }
};

// 仅在首次通过时设置
if (isPassed && !currentFirstPassedAt) {
  updateData.first_passed_at = new Date().toISOString();
}
if (isPassed) {
  updateData.is_passed = true;
}

await adminClient.from('user_form_status').upsert(
  updateData,
  { onConflict: 'user_id,form_id' }
);
```

**查询用户进度**:
```typescript
// 获取用户所有进度
const { data } = await supabase
  .from('user_form_status')
  .select('*')
  .eq('user_id', user.id);

// 统计完成数量
const completedCount = data.filter(item => item.is_passed).length;

// 计算完成率
const progressPercentage = (completedCount / totalTutorials) * 100;
```

#### 索引

```sql
CREATE INDEX idx_user_form_status_user ON user_form_status(user_id);
CREATE INDEX idx_user_form_status_form ON user_form_status(form_id);
CREATE INDEX idx_user_form_status_passed ON user_form_status(is_passed);
CREATE INDEX idx_user_form_status_submitted ON user_form_status(last_submitted_at DESC);
```

**索引说明**:
- `user_id`: 查询特定用户的所有进度
- `form_id`: 查询特定习题的所有提交（后台统计）
- `is_passed`: 快速统计完成数量
- `last_submitted_at`: 按时间排序，查找最近活跃的学习

#### RLS 策略

```sql
-- 用户只能查看自己的状态
CREATE POLICY "Users can view own status"
  ON user_form_status FOR SELECT
  USING (auth.uid() = user_id);

-- 禁止直接 INSERT（只能通过 Edge Function）
-- 禁止直接 UPDATE（只能通过 Edge Function）
-- 禁止 DELETE（保留历史记录）
```

**安全说明**:
- 用户**不能**直接修改状态（防止作弊）
- 只能通过 `submit_form` Edge Function 更新
- Edge Function 使用 `service_role` 绕过 RLS

---

## 表关系图

```
┌─────────────────┐
│  auth.users     │ (Supabase 系统表)
│  ─────────────  │
│  id (PK)        │
│  email          │
│  metadata       │
└────────┬────────┘
         │
         │ 1:1
         ├──────────────────────────────┐
         │                              │
         ↓                              ↓
┌─────────────────┐            ┌─────────────────┐
│  profiles       │            │ user_form_code  │
│  ─────────────  │            │  ─────────────  │
│  id (PK, FK)    │            │  id (PK)        │
│  email          │            │  user_id (FK)   │◄─┐
│  name           │            │  form_id        │  │
│  avatar_url     │            │  code_content   │  │
│  last_login_at  │            │  language       │  │ 1:N
└─────────────────┘            │  is_draft       │  │
                               └─────────────────┘  │
                                                    │
                                                    │
                               ┌─────────────────┐  │
                               │user_form_status │  │
                               │  ─────────────  │  │
                               │  id (PK)        │  │
                               │  user_id (FK)   │──┘
                               │  form_id        │
                               │  has_submitted  │
                               │  attempts       │
                               │  is_passed      │
                               │  first_passed_at│
                               │  last_result    │
                               └─────────────────┘

关系说明:
- auth.users (1) ─ (1) profiles: 一对一，用户资料扩展
- auth.users (1) ─ (N) user_form_code: 一对多，一个用户多份代码
- auth.users (1) ─ (N) user_form_status: 一对多，一个用户多个习题状态
```

---

## 索引策略

### 索引概览

| 表 | 索引名 | 列 | 类型 | 用途 |
|----|----|----|----|------|
| profiles | `idx_profiles_email` | `email` | B-tree | 按邮箱查找用户 |
| profiles | `idx_profiles_last_login` | `last_login_at DESC` | B-tree | 查找最近登录用户 |
| user_form_code | `idx_user_form_code_user` | `user_id` | B-tree | 查询用户所有代码 |
| user_form_code | `idx_user_form_code_form` | `form_id` | B-tree | 查询某习题所有提交 |
| user_form_code | `idx_user_form_code_updated` | `updated_at DESC` | B-tree | 查找最近修改的代码 |
| user_form_status | `idx_user_form_status_user` | `user_id` | B-tree | 查询用户所有进度 |
| user_form_status | `idx_user_form_status_form` | `form_id` | B-tree | 查询某习题完成情况 |
| user_form_status | `idx_user_form_status_passed` | `is_passed` | B-tree | 统计通过的习题 |
| user_form_status | `idx_user_form_status_submitted` | `last_submitted_at DESC` | B-tree | 查找最近提交 |

### 索引优化建议

**当前索引已覆盖主要查询场景**:
- ✅ 用户进度查询
- ✅ 习题统计
- ✅ 最近活跃用户
- ✅ 完成率统计

**未来可能需要的复合索引**:
```sql
-- 如果需要查询某分类的完成情况
CREATE INDEX idx_user_form_status_user_passed
  ON user_form_status(user_id, is_passed);

-- 如果需要按难度统计
-- (需要在 form_id 中包含难度信息或添加 difficulty 字段)
```

---

## RLS 策略

### 启用 RLS

所有表都已启用 Row Level Security：

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_form_code ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_form_status ENABLE ROW LEVEL SECURITY;
```

### 策略矩阵

| 表 | SELECT | INSERT | UPDATE | DELETE |
|----|--------|--------|--------|--------|
| **profiles** | ✅ 所有人可查看 | ❌ 禁止 | ✅ 仅自己 | ❌ 禁止 |
| **user_form_code** | ✅ 仅自己 | ✅ 仅自己 | ✅ 仅自己 | ✅ 仅自己 |
| **user_form_status** | ✅ 仅自己 | ❌ 仅 Edge Function | ❌ 仅 Edge Function | ❌ 禁止 |

### 策略详解

#### profiles 策略

```sql
-- 公开查看
CREATE POLICY "Public profiles are viewable"
  ON profiles FOR SELECT
  USING (true);

-- 只能更新自己的资料
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

**设计理由**:
- 用户资料是公开的（用于显示评论、排行榜等）
- 用户只能修改自己的资料

#### user_form_code 策略

```sql
-- 只能查看自己的代码
CREATE POLICY "Users can view own code"
  ON user_form_code FOR SELECT
  USING (auth.uid() = user_id);

-- 只能插入自己的代码
CREATE POLICY "Users can insert own code"
  ON user_form_code FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 只能更新自己的代码
CREATE POLICY "Users can update own code"
  ON user_form_code FOR UPDATE
  USING (auth.uid() = user_id);

-- 可以删除自己的代码
CREATE POLICY "Users can delete own code"
  ON user_form_code FOR DELETE
  USING (auth.uid() = user_id);
```

**设计理由**:
- 代码是私有的，避免抄袭
- 用户完全控制自己的代码

#### user_form_status 策略

```sql
-- 只能查看自己的状态
CREATE POLICY "Users can view own status"
  ON user_form_status FOR SELECT
  USING (auth.uid() = user_id);

-- 禁止直接 INSERT/UPDATE/DELETE
-- (没有对应策略 = 默认禁止)
```

**设计理由**:
- 防止用户伪造通过记录
- 只能通过 Edge Function（使用 service_role）更新
- 保留历史记录（禁止删除）

### Service Role 权限

Edge Function 使用 `service_role` 密钥绕过 RLS：

```typescript
// Edge Function 中
const adminClient = createClient(
  supabaseUrl,
  serviceRoleKey  // 🔑 绕过 RLS
);

// 可以写入 user_form_status
await adminClient.from('user_form_status').upsert(...);
```

---

## 数据迁移

### 创建表的 SQL

```sql
-- 1. 创建 profiles 表
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建 user_form_code 表
CREATE TABLE IF NOT EXISTS public.user_form_code (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id TEXT NOT NULL,
  code_content TEXT NOT NULL,
  language TEXT DEFAULT 'glsl',
  is_draft BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT user_form_code_unique UNIQUE (user_id, form_id)
);

-- 3. 创建 user_form_status 表
CREATE TABLE IF NOT EXISTS public.user_form_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id TEXT NOT NULL,
  has_submitted BOOLEAN DEFAULT false,
  attempts INT DEFAULT 0,
  is_passed BOOLEAN DEFAULT false,
  first_passed_at TIMESTAMPTZ,
  last_submitted_at TIMESTAMPTZ,
  last_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT user_form_status_unique UNIQUE (user_id, form_id)
);

-- 4. 创建索引
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON profiles(last_login_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_form_code_user ON user_form_code(user_id);
CREATE INDEX IF NOT EXISTS idx_user_form_code_form ON user_form_code(form_id);
CREATE INDEX IF NOT EXISTS idx_user_form_code_updated ON user_form_code(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_form_status_user ON user_form_status(user_id);
CREATE INDEX IF NOT EXISTS idx_user_form_status_form ON user_form_status(form_id);
CREATE INDEX IF NOT EXISTS idx_user_form_status_passed ON user_form_status(is_passed);
CREATE INDEX IF NOT EXISTS idx_user_form_status_submitted ON user_form_status(last_submitted_at DESC);

-- 5. 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_form_code ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_form_status ENABLE ROW LEVEL SECURITY;

-- 6. 创建 RLS 策略
-- (见上方 RLS 策略章节)
```

### 迁移文件位置

```
supabase/migrations/
└── 20251213_initial_schema.sql
```

### 执行迁移

```bash
# 本地开发
supabase db push

# 生产环境（通过 Supabase Dashboard）
# Settings → Database → Migrations → Upload
```

---

## 常见查询示例

### 用户统计

```sql
-- 总用户数
SELECT COUNT(*) FROM profiles;

-- 最近 7 天新增用户
SELECT COUNT(*) FROM profiles
WHERE created_at > NOW() - INTERVAL '7 days';

-- 最近登录的 10 个用户
SELECT email, name, last_login_at
FROM profiles
ORDER BY last_login_at DESC NULLS LAST
LIMIT 10;
```

### 学习进度统计

```sql
-- 用户完成的习题数量
SELECT user_id, COUNT(*) as completed_count
FROM user_form_status
WHERE is_passed = true
GROUP BY user_id
ORDER BY completed_count DESC;

-- 某个习题的完成率
SELECT
  form_id,
  COUNT(*) FILTER (WHERE is_passed = true) as passed_count,
  COUNT(*) as total_attempts,
  ROUND(
    COUNT(*) FILTER (WHERE is_passed = true)::decimal /
    NULLIF(COUNT(DISTINCT user_id), 0) * 100,
    2
  ) as pass_rate
FROM user_form_status
WHERE form_id = 'basic-two-color-gradient'
GROUP BY form_id;

-- 每个分类的完成情况
SELECT
  SPLIT_PART(form_id, '-', 1) as category,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) FILTER (WHERE is_passed = true) as passed_count,
  AVG(attempts) as avg_attempts
FROM user_form_status
GROUP BY category
ORDER BY unique_users DESC;
```

### 活跃度分析

```sql
-- 最近 7 天活跃用户（提交过代码）
SELECT COUNT(DISTINCT user_id)
FROM user_form_status
WHERE last_submitted_at > NOW() - INTERVAL '7 days';

-- 用户学习活跃度（按提交次数排序）
SELECT
  p.email,
  p.name,
  COUNT(s.id) as total_submissions,
  COUNT(*) FILTER (WHERE s.is_passed = true) as passed_count,
  MAX(s.last_submitted_at) as last_active
FROM profiles p
LEFT JOIN user_form_status s ON p.id = s.user_id
GROUP BY p.id, p.email, p.name
ORDER BY total_submissions DESC
LIMIT 20;
```

---

## 数据备份与恢复

### 备份策略

**Supabase 自动备份**:
- 每日自动备份（保留 7 天）
- 通过 Dashboard: Database → Backups

**手动备份**:
```bash
# 导出完整数据库
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# 仅导出数据（无结构）
pg_dump $DATABASE_URL --data-only > data_backup_$(date +%Y%m%d).sql

# 仅导出特定表
pg_dump $DATABASE_URL -t user_form_status > status_backup.sql
```

### 恢复数据

```bash
# 恢复完整数据库
psql $DATABASE_URL < backup_20251213.sql

# 恢复特定表
psql $DATABASE_URL < status_backup.sql
```

---

## 性能优化建议

### 查询优化

1. **使用索引**: 确保查询条件使用了已创建的索引
2. **避免 SELECT ***: 只查询需要的字段
3. **使用 EXPLAIN**: 分析查询计划

```sql
-- ❌ 慢查询
SELECT * FROM user_form_status WHERE form_id LIKE '%gradient%';

-- ✅ 快查询
SELECT form_id, is_passed FROM user_form_status
WHERE form_id = 'basic-two-color-gradient';
```

### 数据清理

定期清理过期数据（如果需要）：

```sql
-- 删除 1 年前未登录的用户草稿
DELETE FROM user_form_code
WHERE is_draft = true
  AND updated_at < NOW() - INTERVAL '1 year'
  AND user_id IN (
    SELECT id FROM profiles
    WHERE last_login_at < NOW() - INTERVAL '1 year'
  );
```

---

## 附录

### 相关文档

- [习题系统文档](./EXERCISE_SYSTEM.md)
- [VIP 访问控制实现](./VIP_ACCESS_CONTROL_IMPLEMENTATION.md)
- [数据库迁移记录](./DATABASE_MIGRATION_COMPLETED.md)

### 更新日志

| 日期 | 版本 | 更新内容 |
|------|------|----------|
| 2025-12-13 | 1.0 | 初始版本，完整数据库架构文档 |

---

**维护者**: GLSL Learning Platform Team
**最后更新**: 2025-12-13
