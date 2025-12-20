# Supabase 实际数据库表结构分析

**项目**: GLSL 学习平台
**Supabase 项目**: fkgudvpbetdsjmtdpkge
**查询时间**: 2025-12-03
**数据来源**: MCP 实时查询

---

## 📊 实际表结构

### 1. profiles 表 ✅

**字段列表**:

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|-------|------|------|--------|------|
| id | uuid | PRIMARY KEY | - | 用户ID，关联 auth.users |
| email | text | nullable | - | 用户邮箱 |
| name | text | nullable | - | 用户名 |
| avatar_url | text | nullable | - | 头像URL |
| **role** | text | - | 'user' | 用户角色 ⚠️ |
| **plan** | text | - | 'free' | 订阅计划 🔥 **重要** |
| last_login_at | timestamptz | nullable | - | 最后登录时间 |
| created_at | timestamptz | - | now() | 创建时间 |
| updated_at | timestamptz | - | now() | 更新时间 |

**约束**:
- 主键: `id`
- 外键: `id` → `auth.users.id` (CASCADE)
- RLS: ✅ 已启用

**重要发现 🔥**:
- ✅ 已有 `plan` 字段（默认 'free'）
- ✅ 已有 `role` 字段（默认 'user'）

---

### 2. user_form_code 表 ✅

**字段列表**:

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|-------|------|------|--------|------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | 主键 |
| user_id | uuid | NOT NULL | - | 用户ID |
| form_id | text | NOT NULL | - | 教程ID |
| code_content | text | - | '' | 用户代码 |
| language | text | nullable | - | 语言类型 |
| is_draft | boolean | - | true | 是否草稿 |
| version | integer | - | 1 | 版本号 |
| created_at | timestamptz | - | now() | 创建时间 |
| updated_at | timestamptz | - | now() | 更新时间 |

**约束**:
- 主键: `id`
- 外键: `user_id` → `auth.users.id` (CASCADE)
- RLS: ✅ 已启用
- **注意**: 缺少 UNIQUE(user_id, form_id) 约束 ⚠️

---

### 3. user_form_status 表 ✅

**字段列表**:

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|-------|------|------|--------|------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | 主键 |
| user_id | uuid | NOT NULL | - | 用户ID |
| form_id | text | NOT NULL | - | 教程ID |
| has_submitted | boolean | - | false | 是否已提交 |
| is_passed | boolean | - | false | 是否通过 |
| attempts | integer | - | 0 | 尝试次数 |
| last_submitted_at | timestamptz | nullable | - | 最后提交时间 |
| first_passed_at | timestamptz | nullable | - | 首次通过时间 |
| last_result | jsonb | nullable | - | 最后结果 |
| created_at | timestamptz | - | now() | 创建时间 |
| updated_at | timestamptz | - | now() | 更新时间 |

**约束**:
- 主键: `id`
- 外键: `user_id` → `auth.users.id` (CASCADE)
- RLS: ✅ 已启用
- **注意**: 缺少 UNIQUE(user_id, form_id) 约束 ⚠️

---

### 4. todos 表（测试表，可忽略）

**字段列表**:

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
|-------|------|------|--------|------|
| id | uuid | PRIMARY KEY | gen_random_uuid() | 主键 |
| title | text | CHECK(length > 0) | - | 标题 |
| done | boolean | - | false | 是否完成 |
| created_at | timestamptz | - | now() | 创建时间 |

**说明**: 这可能是 Supabase 示例表，不影响我们的系统。

---

## 🔍 关键发现

### ✅ 好消息

1. **profiles 表已有 plan 字段**
   - 默认值: `'free'`
   - 类型: `text`
   - 可以直接用于简单的订阅标识

2. **所有表都启用了 RLS**
   - 数据安全有保障
   - 用户只能访问自己的数据

3. **外键正确设置**
   - 所有 `user_id` 都关联到 `auth.users.id`
   - 使用 CASCADE 删除策略

### ⚠️ 需要注意的问题

1. **缺少 UNIQUE 约束**
   - `user_form_code` 表缺少 `UNIQUE(user_id, form_id)`
   - `user_form_status` 表缺少 `UNIQUE(user_id, form_id)`
   - 可能导致重复数据

2. **外键指向不一致**
   - 现有表: `user_id` → `auth.users.id`
   - 我们设计: `user_id` → `profiles.id`
   - 需要统一

3. **profiles.plan 字段过于简单**
   - 只有计划名称，没有时间信息
   - 无法存储订阅开始/结束时间
   - 无法存储 Creem 相关 ID

---

## 🎯 两种实施方案对比

### 方案 A: 使用现有 profiles.plan 字段（简化版）

**优点**:
- ✅ 无需创建新表，立即可用
- ✅ 实现简单快速
- ✅ 查询性能好（无需 JOIN）

**缺点**:
- ❌ 功能有限，只能存储计划名称
- ❌ 无法记录订阅时间、到期时间
- ❌ 无法存储 Creem 订阅 ID
- ❌ 无法区分已过期订阅
- ❌ 难以支持试用期、暂停等状态

**实现方式**:
```typescript
// 购买后更新 profiles.plan
await supabase
  .from('profiles')
  .update({ plan: 'pro' })
  .eq('id', userId);

// 检查权限
const { data: profile } = await supabase
  .from('profiles')
  .select('plan')
  .eq('id', userId)
  .single();

const hasAccess = profile?.plan === 'pro';
```

**适用场景**:
- 快速 MVP 验证
- 永久购买模式（无到期时间）
- 不需要复杂订阅管理

---

### 方案 B: 创建独立 subscriptions 表（完整版）✅ 推荐

**优点**:
- ✅ 功能完整，支持所有订阅场景
- ✅ 记录详细的订阅信息（时间、状态、价格）
- ✅ 支持试用期、暂停、取消等状态
- ✅ 存储 Creem 相关 ID，便于对账
- ✅ 易于扩展（优惠券、折扣等）
- ✅ 支持订阅历史记录

**缺点**:
- ❌ 需要额外的数据库表
- ❌ 查询需要 JOIN（性能略低）
- ❌ 实现稍复杂

**实现方式**:
```typescript
// 创建订阅记录
await supabase
  .from('subscriptions')
  .insert({
    user_id: userId,
    status: 'active',
    plan_name: '3_month',
    plan_price: 21.90,
    current_period_start: new Date(),
    current_period_end: addMonths(new Date(), 3),
    creem_subscription_id: 'sub_xxx'
  });

// 检查权限（带过期检查）
const { data: subscription } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', userId)
  .eq('status', 'active')
  .single();

const hasAccess = subscription &&
  new Date(subscription.current_period_end) > new Date();
```

**适用场景**:
- 正式的订阅业务 ✅
- 需要时间限制的订阅
- 需要详细的订阅管理
- 需要与支付平台集成

---

## 💡 推荐方案：混合模式

### 实施策略

1. **保留 profiles.plan 作为快速标识**
   ```sql
   -- profiles.plan 可选值：
   -- 'free' - 免费用户
   -- 'pro' - 付费用户（简化标识）
   ```

2. **创建 subscriptions 表存储详细信息**
   ```sql
   -- subscriptions 表存储完整订阅信息
   -- 包括时间、价格、Creem ID 等
   ```

3. **双重检查机制**
   ```typescript
   // 优先检查 profiles.plan（快速）
   const { data: profile } = await supabase
     .from('profiles')
     .select('plan')
     .eq('id', userId)
     .single();

   if (profile?.plan === 'free') {
     return false; // 快速返回
   }

   // 如果是 pro，再检查 subscriptions 表（详细）
   const { data: subscription } = await supabase
     .from('subscriptions')
     .select('*')
     .eq('user_id', userId)
     .eq('status', 'active')
     .single();

   return subscription &&
     new Date(subscription.current_period_end) > new Date();
   ```

**优点**:
- ✅ 兼顾性能和功能
- ✅ profiles.plan 提供快速标识
- ✅ subscriptions 表提供完整信息
- ✅ 数据一致性好

---

## 📝 需要执行的 SQL

### 1. 添加缺失的 UNIQUE 约束

```sql
-- 为 user_form_code 添加唯一约束
ALTER TABLE user_form_code
  ADD CONSTRAINT user_form_code_user_form_unique
  UNIQUE (user_id, form_id);

-- 为 user_form_status 添加唯一约束
ALTER TABLE user_form_status
  ADD CONSTRAINT user_form_status_user_form_unique
  UNIQUE (user_id, form_id);
```

### 2. 创建 subscriptions 表

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  status VARCHAR(20) NOT NULL DEFAULT 'inactive',
  plan_name VARCHAR(50) NOT NULL,
  plan_price DECIMAL(10, 2) NOT NULL,

  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  trial_end TIMESTAMPTZ,

  creem_subscription_id VARCHAR(255) UNIQUE,
  creem_customer_id VARCHAR(255),
  NEXT_PUBLIC_CREEM_PRODUCT_ID VARCHAR(255),

  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT subscriptions_user_id_unique UNIQUE (user_id)
);

-- 创建索引
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);

-- 启用 RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

### 3. 创建触发器：同步 profiles.plan

```sql
-- 创建函数：订阅变化时同步 profiles.plan
CREATE OR REPLACE FUNCTION sync_profile_plan()
RETURNS TRIGGER AS $$
BEGIN
  -- 如果订阅状态变为 active 或 trialing
  IF (NEW.status = 'active' OR NEW.status = 'trialing') AND
     NEW.current_period_end > NOW() THEN
    UPDATE profiles
    SET plan = 'pro', updated_at = NOW()
    WHERE id = NEW.user_id;

  -- 如果订阅过期或取消
  ELSIF NEW.status IN ('expired', 'canceled') OR
        NEW.current_period_end <= NOW() THEN
    UPDATE profiles
    SET plan = 'free', updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER sync_profile_plan_trigger
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_plan();
```

---

## ✅ 最终建议

### 推荐实施步骤

1. **✅ 立即执行**:
   - 添加 UNIQUE 约束（防止重复数据）
   - 创建 subscriptions 表

2. **✅ 实现权限检查**:
   - 使用混合模式（profiles.plan + subscriptions 表）
   - 优先检查 profiles.plan（性能）
   - 详细验证使用 subscriptions 表（准确性）

3. **✅ 实现 Webhook**:
   - Creem webhook 同时更新两个地方
   - subscriptions 表（详细信息）
   - profiles.plan（快速标识）

4. **✅ 添加触发器**:
   - 自动同步 profiles.plan
   - 保持数据一致性

---

## 🔗 相关文档

- [订阅系统实施方案](./SUBSCRIPTION_IMPLEMENTATION_PLAN.md)
- [VIP 权限控制实现](./VIP_ACCESS_CONTROL_IMPLEMENTATION.md)
- [数据库对比分析](./DATABASE_SCHEMA_ANALYSIS.md)

---

**文档版本**: v1.0
**最后更新**: 2025-12-03
**维护者**: Claude Code
