# Supabase 数据库表结构分析与对比

**项目**: GLSL 学习平台
**Supabase 项目**: fkgudvpbetdsjmtdpkge
**分析日期**: 2025-12-03

---

## 📊 现有数据库表结构（根据代码推断）

### 1. profiles 表

**用途**: 用户基本资料

**字段**:
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**使用位置**:
- `src/app/auth/callback/route.ts` - OAuth 登录时同步用户信息
- `src/app/app/page.tsx` - 查询用户资料

**数据示例**:
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "张三",
  "avatar_url": "https://...",
  "last_login_at": "2025-12-03T10:00:00Z"
}
```

---

### 2. user_form_code 表

**用途**: 用户编写的 GLSL 代码保存

**字段**:
```sql
CREATE TABLE user_form_code (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  form_id TEXT NOT NULL, -- 教程ID，如 "solid-color"
  code_content TEXT NOT NULL,
  language TEXT DEFAULT 'glsl',
  is_draft BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 唯一约束：每个用户每个教程只有一份代码
  UNIQUE(user_id, form_id)
);

-- 索引
CREATE INDEX idx_user_form_code_user_id ON user_form_code(user_id);
CREATE INDEX idx_user_form_code_form_id ON user_form_code(form_id);
```

**使用位置**:
- `src/app/[locale]/learn/[category]/[id]/tutorial-client.tsx` - 自动保存代码（2秒防抖）
- `src/app/[locale]/learn/[category]/[id]/page.tsx` - 服务端预取用户代码
- `supabase/functions/submit_form/index.ts` - 读取用户提交的代码

**数据示例**:
```json
{
  "id": "uuid",
  "user_id": "user-uuid",
  "form_id": "solid-color",
  "code_content": "precision mediump float;\nvoid main() {...}",
  "language": "glsl",
  "is_draft": true,
  "created_at": "2025-12-01T10:00:00Z",
  "updated_at": "2025-12-03T10:30:00Z"
}
```

---

### 3. user_form_status 表

**用途**: 教程练习提交状态和判题结果

**字段**:
```sql
CREATE TABLE user_form_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  form_id TEXT NOT NULL, -- 教程ID
  has_submitted BOOLEAN DEFAULT false,
  attempts INT DEFAULT 0, -- 提交次数
  is_passed BOOLEAN DEFAULT false, -- 是否通过
  first_passed_at TIMESTAMPTZ, -- 首次通过时间
  last_submitted_at TIMESTAMPTZ, -- 最后提交时间
  last_result JSONB, -- 最后一次判题结果
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 唯一约束
  UNIQUE(user_id, form_id)
);

-- 索引
CREATE INDEX idx_user_form_status_user_id ON user_form_status(user_id);
CREATE INDEX idx_user_form_status_form_id ON user_form_status(form_id);
CREATE INDEX idx_user_form_status_is_passed ON user_form_status(is_passed);
```

**使用位置**:
- `supabase/functions/submit_form/index.ts` - 更新提交状态和判题结果

**数据示例**:
```json
{
  "id": "uuid",
  "user_id": "user-uuid",
  "form_id": "solid-color",
  "has_submitted": true,
  "attempts": 3,
  "is_passed": false,
  "first_passed_at": null,
  "last_submitted_at": "2025-12-03T10:30:00Z",
  "last_result": {
    "message": "Placeholder validation - please implement actual judging logic",
    "timestamp": "2025-12-03T10:30:00Z"
  }
}
```

---

## 🆕 新增订阅系统表设计

### 4. subscriptions 表（新增）

**用途**: 用户订阅管理

**字段**:
```sql
CREATE TABLE subscriptions (
  -- 主键和外键
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,

  -- 订阅状态
  status VARCHAR(20) NOT NULL DEFAULT 'inactive',
  -- 可选值: 'active', 'trialing', 'paused', 'canceled', 'expired'

  -- 计划信息
  plan_name VARCHAR(50) NOT NULL,
  -- 可选值: '1_month', '2_month', '3_month'
  plan_price DECIMAL(10, 2) NOT NULL,

  -- 时间信息
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  trial_end TIMESTAMPTZ,

  -- Creem 相关ID
  creem_subscription_id VARCHAR(255) UNIQUE,
  creem_customer_id VARCHAR(255),
  creem_product_id VARCHAR(255),

  -- 元数据
  metadata JSONB,

  -- 审计字段
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_creem_subscription_id
  ON subscriptions(creem_subscription_id);
CREATE INDEX idx_subscriptions_period_end
  ON subscriptions(current_period_end);

-- 注释
COMMENT ON TABLE subscriptions IS '用户订阅信息表';
COMMENT ON COLUMN subscriptions.status IS '订阅状态: active, trialing, paused, canceled, expired';
COMMENT ON COLUMN subscriptions.plan_name IS '订阅计划: 1_month, 2_month, 3_month';
```

**数据示例**:
```json
{
  "id": "subscription-uuid",
  "user_id": "user-uuid",
  "status": "active",
  "plan_name": "3_month",
  "plan_price": 21.90,
  "current_period_start": "2025-12-01T00:00:00Z",
  "current_period_end": "2026-03-01T00:00:00Z",
  "trial_end": null,
  "creem_subscription_id": "sub_xxx",
  "creem_customer_id": "cus_xxx",
  "creem_product_id": "prod_xxx",
  "metadata": null,
  "created_at": "2025-12-01T00:00:00Z",
  "updated_at": "2025-12-01T00:00:00Z"
}
```

---

### 5. payment_events 表（可选，建议添加）

**用途**: 记录支付事件日志，用于调试和审计

**字段**:
```sql
CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),

  -- 事件信息
  event_type VARCHAR(50) NOT NULL,
  -- 例如: checkout.completed, subscription.active, subscription.canceled
  creem_event_id VARCHAR(255) UNIQUE,

  -- 完整的事件负载
  payload JSONB,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_payment_events_user_id ON payment_events(user_id);
CREATE INDEX idx_payment_events_event_type ON payment_events(event_type);
CREATE INDEX idx_payment_events_created_at ON payment_events(created_at);

COMMENT ON TABLE payment_events IS '支付事件日志表（用于调试和审计）';
```

---

## ⚖️ 冲突分析

### ✅ 无冲突项

| 项目 | 说明 | 结论 |
|-----|------|------|
| **表名** | 新表 `subscriptions` 和 `payment_events` 不与现有表冲突 | ✅ 无冲突 |
| **外键关系** | `subscriptions.user_id` 引用 `profiles(id)`，符合现有模式 | ✅ 无冲突 |
| **命名规范** | 使用 snake_case，与现有表一致 | ✅ 无冲突 |
| **字段类型** | UUID、TEXT、TIMESTAMPTZ、JSONB，与现有表一致 | ✅ 无冲突 |
| **索引策略** | 为外键和常用查询字段建立索引，符合最佳实践 | ✅ 无冲突 |

---

### ⚠️ 需要注意的点

#### 1. profiles 表可能缺少字段

**问题**: 我们的 `subscriptions` 表引用 `profiles(id)`，但不确定 `profiles` 表是否已正确设置外键关联。

**建议**:
```sql
-- 确保 profiles 表存在并且 id 字段是主键
ALTER TABLE profiles ADD PRIMARY KEY (id);

-- 如果 profiles.id 没有外键关联到 auth.users，添加：
ALTER TABLE profiles
  ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

#### 2. user_id 的一致性

**当前状态**:
- `profiles.id` → UUID（关联到 `auth.users.id`）
- `user_form_code.user_id` → UUID（引用 `profiles.id`）
- `user_form_status.user_id` → UUID（引用 `profiles.id`）
- `subscriptions.user_id` → UUID（引用 `profiles.id`）

**建议**: ✅ 保持一致，无需修改

#### 3. 级联删除策略

**现有表**:
- `profiles` → `ON DELETE CASCADE` 到 `auth.users`
- `user_form_code` → 应该 `ON DELETE CASCADE` 到 `profiles`
- `user_form_status` → 应该 `ON DELETE CASCADE` 到 `profiles`

**新表**:
- `subscriptions` → `ON DELETE CASCADE` 到 `profiles`

**建议**: ✅ 保持一致，用户删除时级联删除所有相关数据

---

## 🔄 数据关系图

```
auth.users (Supabase Auth 内置表)
    ↓ (ON DELETE CASCADE)
profiles
    ↓ (ON DELETE CASCADE)
    ├── user_form_code (用户代码)
    ├── user_form_status (提交状态)
    └── subscriptions (订阅信息) ← 新增
            ↓
        payment_events (支付日志) ← 可选
```

---

## 📝 建议的迁移 SQL

### Step 1: 创建 subscriptions 表

```sql
-- 创建订阅表
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'inactive',
  plan_name VARCHAR(50) NOT NULL,
  plan_price DECIMAL(10, 2) NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  trial_end TIMESTAMPTZ,
  creem_subscription_id VARCHAR(255) UNIQUE,
  creem_customer_id VARCHAR(255),
  creem_product_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_creem_subscription_id ON subscriptions(creem_subscription_id);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);

-- 添加注释
COMMENT ON TABLE subscriptions IS '用户订阅信息表';
COMMENT ON COLUMN subscriptions.status IS '订阅状态: active, trialing, paused, canceled, expired';
COMMENT ON COLUMN subscriptions.plan_name IS '订阅计划: 1_month, 2_month, 3_month';

-- 启用 RLS (Row Level Security)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS 策略：用户只能查看自己的订阅
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- RLS 策略：Creem webhook 可以写入（通过 service_role）
-- 注意：service_role 会绕过 RLS，所以 webhook 可以直接写入
```

---

### Step 2: 创建 payment_events 表（可选）

```sql
-- 创建支付事件表
CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  event_type VARCHAR(50) NOT NULL,
  creem_event_id VARCHAR(255) UNIQUE,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_payment_events_user_id ON payment_events(user_id);
CREATE INDEX idx_payment_events_event_type ON payment_events(event_type);
CREATE INDEX idx_payment_events_created_at ON payment_events(created_at);

-- 添加注释
COMMENT ON TABLE payment_events IS '支付事件日志表（用于调试和审计）';

-- 启用 RLS
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- RLS 策略：用户可以查看自己的支付事件
CREATE POLICY "Users can view their own payment events"
  ON payment_events FOR SELECT
  USING (auth.uid() = user_id);
```

---

### Step 3: 验证现有表的外键约束

```sql
-- 检查 profiles 表的主键
SELECT
  conname AS constraint_name,
  contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'profiles'::regclass;

-- 检查 user_form_code 的外键
SELECT
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confrelid::regclass AS referenced_table
FROM pg_constraint
WHERE conrelid = 'user_form_code'::regclass
  AND contype = 'f';

-- 检查 user_form_status 的外键
SELECT
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confrelid::regclass AS referenced_table
FROM pg_constraint
WHERE conrelid = 'user_form_status'::regclass
  AND contype = 'f';
```

---

### Step 4: 如果需要，添加缺失的外键约束

```sql
-- 如果 user_form_code 没有外键到 profiles
ALTER TABLE user_form_code
  ADD CONSTRAINT user_form_code_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 如果 user_form_status 没有外键到 profiles
ALTER TABLE user_form_status
  ADD CONSTRAINT user_form_status_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
```

---

## 🧪 测试 SQL

### 测试订阅表插入

```sql
-- 插入测试订阅数据
INSERT INTO subscriptions (
  user_id,
  status,
  plan_name,
  plan_price,
  current_period_start,
  current_period_end
) VALUES (
  (SELECT id FROM profiles LIMIT 1), -- 使用现有用户
  'active',
  '3_month',
  21.90,
  NOW(),
  NOW() + INTERVAL '3 months'
);

-- 查询测试
SELECT
  s.*,
  p.email,
  p.name
FROM subscriptions s
JOIN profiles p ON s.user_id = p.id;

-- 检查订阅是否过期
SELECT
  user_id,
  status,
  plan_name,
  current_period_end,
  (current_period_end > NOW()) AS is_valid,
  EXTRACT(DAY FROM (current_period_end - NOW())) AS days_remaining
FROM subscriptions;
```

---

## ✅ 结论

### 总体评估

| 维度 | 评分 | 说明 |
|-----|------|------|
| **兼容性** | ✅ 100% | 新表设计与现有表完全兼容 |
| **安全性** | ✅ 优秀 | 使用 RLS 保护数据，外键约束保证一致性 |
| **性能** | ✅ 良好 | 合理的索引设计，支持高效查询 |
| **可维护性** | ✅ 优秀 | 清晰的命名和注释，易于理解 |
| **扩展性** | ✅ 良好 | metadata JSONB 字段支持未来扩展 |

### 无冲突 ✅

新设计的 `subscriptions` 和 `payment_events` 表与现有数据库结构**完全兼容**，无任何冲突。可以直接创建。

### 建议执行顺序

1. ✅ 执行 Step 3 验证现有表结构
2. ✅ 如需要，执行 Step 4 添加缺失的外键
3. ✅ 执行 Step 1 创建 `subscriptions` 表
4. ✅ （可选）执行 Step 2 创建 `payment_events` 表
5. ✅ 执行测试 SQL 验证表创建成功

---

## 📚 相关文档

- [Supabase RLS 文档](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL 外键约束](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [订阅系统实施方案](./SUBSCRIPTION_IMPLEMENTATION_PLAN.md)

---

**最后更新**: 2025-12-03
**维护者**: Claude Code
