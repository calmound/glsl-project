# GLSL 学习平台订阅系统实施方案

**文档版本**: v1.0
**创建日期**: 2025-12-03
**项目目标**: 为 GLSL 学习平台添加基于 Creem 的订阅付费功能

---

## 📋 目录

1. [项目概述](#项目概述)
2. [功能规划](#功能规划)
3. [订阅价格方案](#订阅价格方案)
4. [技术架构](#技术架构)
5. [数据库设计](#数据库设计)
6. [API 端点设计](#api-端点设计)
7. [前端页面设计](#前端页面设计)
8. [Creem 集成方案](#creem-集成方案)
9. [开发实施计划](#开发实施计划)
10. [测试清单](#测试清单)
11. [上线部署](#上线部署)

---

## 项目概述

### 当前状态

- ✅ **教程系统**: 6个分类，约30个教程
- ✅ **用户认证**: Google/GitHub OAuth
- ✅ **代码编辑器**: 实时预览、自动保存（2秒防抖）
- ✅ **判题系统**: WebGL编译验证 + 像素比对
- ✅ **多语言**: 中英文双语支持
- ✅ **数据库**: Supabase (profiles, user_form_code, user_form_status)

### 项目目标

实现基于订阅的付费模式，核心目标：
- 免费用户可访问基础教程（约47%内容）
- 付费用户解锁所有教程内容
- 使用 Creem 作为支付处理平台
- 所有用户可无限制使用编辑器、代码保存等工具功能

### 核心原则

1. **内容为王**: 后期重点是丰富教学内容
2. **工具开放**: 编辑器、代码保存等功能对所有用户免费
3. **简洁实施**: 不需要复杂的社区功能、Dashboard
4. **判题简化**: 保持现有判题逻辑，不做复杂改进

---

## 功能规划

### 免费用户 (Free Tier)

#### ✅ 完全开放
- **所有基础工具**
  - GLSL 代码编辑器
  - 实时 WebGL 预览
  - 代码自动保存（无限制）
  - 项目管理
- **基础教程访问**
  - basic 分类：全部10个教程
  - 其他分类：各1-2个入门教程
  - 总计：约14个教程（47%）

#### 🔒 内容限制
- 付费教程仅显示标题、描述、学习目标
- 代码和练习被锁定，显示"🔒 升级解锁"提示

### 付费用户 (Pro Tier)

#### ✅ 全部权益
- **解锁所有教程**: 100%内容访问权限

---

## 订阅价格方案

| 订阅周期 | 价格 | 月均价格 | 折扣 | 推荐度 |
|---------|------|---------|------|-------|
| 1个月 | **$9.99** | $9.99 | - | ⭐ |
| 2个月 | **$15.9** | $8.0 | 节省19% | ⭐⭐ |
| 3个月 | **$21.9** | $7.3 | 节省26% | ⭐⭐⭐ |

**定价策略**:
- 无免费试用期
- 无推荐奖励机制
- 采用一次性购买模式（非自动续费订阅）
- 到期后需要重新购买

**可选扩展方案**:
- 6个月: $39.9 (月均 $6.7, 节省32%)
- 12个月: $69.9 (月均 $5.8, 节省41%)

---

## 技术架构

### 技术栈

- **前端框架**: Next.js 15.3.2 (App Router, React 19)
- **数据库**: Supabase (PostgreSQL)
- **支付平台**: Creem.io
- **认证**: Supabase Auth (OAuth: Google, GitHub)
- **部署**: Vercel

### 系统架构图

```
┌─────────────┐
│   用户访问   │
└──────┬──────┘
       │
       v
┌──────────────────────────────────────┐
│         Next.js Frontend             │
│  ┌────────────┐  ┌─────────────┐    │
│  │ 教程列表页  │  │  教程详情页  │    │
│  └────────────┘  └─────────────┘    │
│  ┌────────────┐  ┌─────────────┐    │
│  │  定价页面   │  │ 订阅管理页  │    │
│  └────────────┘  └─────────────┘    │
└─────────┬─────────────────┬──────────┘
          │                 │
          v                 v
┌─────────────────┐  ┌──────────────┐
│  Supabase DB    │  │  Creem API   │
│  ┌───────────┐  │  │              │
│  │ profiles  │  │  │ Checkout     │
│  │ subs...   │  │  │ Products     │
│  │ user_code │  │  │ Webhooks     │
│  └───────────┘  │  └──────────────┘
└─────────────────┘
```

### 权限控制流程

```
用户访问教程
    │
    v
检查教程配置 (config.json)
    │
    ├─ isPremium: false ──> 直接允许访问
    │
    └─ isPremium: true
         │
         v
    检查用户登录
         │
         ├─ 未登录 ──> 重定向到 /signin
         │
         └─ 已登录
              │
              v
         检查订阅状态
              │
              ├─ 有效订阅 ──> 允许访问
              │
              └─ 无订阅/过期 ──> 重定向到 /pricing
```

---

## 数据库设计

### subscriptions 表

```sql
-- subscriptions 表
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
  NEXT_PUBLIC_CREEM_PRODUCT_ID VARCHAR(255),

  -- 元数据
  metadata JSONB,

  -- 审计字段
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_creem_subscription_id
  ON subscriptions(creem_subscription_id);
CREATE INDEX idx_subscriptions_period_end
  ON subscriptions(current_period_end);

-- 添加注释
COMMENT ON TABLE subscriptions IS '用户订阅信息表';
COMMENT ON COLUMN subscriptions.status IS '订阅状态: active, trialing, paused, canceled, expired';
COMMENT ON COLUMN subscriptions.plan_name IS '订阅计划: 1_month, 2_month, 3_month';
```

### payment_events 表（可选）

```sql
-- payment_events 表 - 记录支付事件日志
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

## API 端点设计

### 1. POST /api/subscription/checkout

**功能**: 创建 Creem Checkout Session

**请求体**:
```json
{
  "planId": "1_month" // 或 "2_month", "3_month"
}
```

**响应**:
```json
{
  "checkoutUrl": "https://creem.io/checkout/xxx",
  "sessionId": "cs_xxx"
}
```

**错误响应**:
```json
{
  "error": "Not authenticated" // 401
}
```

**实现文件**: `src/app/api/subscription/checkout/route.ts`

---

### 2. GET /api/subscription/status

**功能**: 获取当前用户订阅状态

**响应**:
```json
{
  "active": true,
  "subscription": {
    "id": "uuid",
    "user_id": "uuid",
    "status": "active",
    "plan_name": "1_month",
    "plan_price": 9.99,
    "current_period_start": "2025-12-01T00:00:00Z",
    "current_period_end": "2026-01-01T00:00:00Z",
    "created_at": "2025-12-01T00:00:00Z"
  },
  "daysRemaining": 28
}
```

**未订阅响应**:
```json
{
  "active": false,
  "subscription": null,
  "daysRemaining": 0
}
```

**实现文件**: `src/app/api/subscription/status/route.ts`

---

### 3. POST /api/webhooks/creem

**功能**: 接收 Creem Webhook 事件

**请求头**:
```
creem-signature: <hmac-sha256-signature>
```

**支持的事件类型**:
- `checkout.completed` - 一次性支付完成
- `subscription.active` - 订阅激活
- `subscription.paid` - 订阅续费成功
- `subscription.canceled` - 订阅取消
- `subscription.expired` - 订阅过期
- `subscription.trialing` - 试用期开始
- `subscription.update` - 订阅更新
- `onGrantAccess` - 授予访问权限（推荐）
- `onRevokeAccess` - 撤销访问权限（推荐）

**响应**:
```json
{
  "received": true
}
```

**实现文件**: `src/app/api/webhooks/creem/route.ts`

---

## 前端页面设计

### 1. 定价页面 (/[locale]/pricing)

**功能**:
- 展示3个订阅计划
- 点击订阅按钮创建 Checkout Session
- 跳转到 Creem 托管支付页面

**组件结构**:
```tsx
<PricingPage>
  <Header>
    <Title>选择你的订阅计划</Title>
    <Subtitle>解锁所有GLSL教程</Subtitle>
  </Header>

  <PricingCards>
    {plans.map(plan => (
      <PricingCard>
        <PlanName>{plan.name}</PlanName>
        <Price>{plan.price}</Price>
        <Badge>{plan.badge}</Badge> {/* 可选 */}

        <FeatureList>
          <Feature>✅ 所有教程内容</Feature>
          <Feature>✅ 练习自动判题</Feature>
          <Feature>✅ 无限代码保存</Feature>
          <Feature>✅ 学习进度追踪</Feature>
        </FeatureList>

        <SubscribeButton onClick={handleCheckout} />
      </PricingCard>
    ))}
  </PricingCards>

  <FAQ /> {/* 可选 */}
</PricingPage>
```

**实现文件**: `src/app/[locale]/pricing/page.tsx`

---

### 2. 订阅管理页面 (/app/subscription)

**功能**:
- 显示当前订阅状态
- 显示到期时间
- 显示订阅历史（可选）

**组件结构**:
```tsx
<SubscriptionPage>
  {hasSubscription ? (
    <SubscriptionCard>
      <Status badge={subscription.status} />
      <PlanInfo>
        <PlanName>{subscription.plan_name}</PlanName>
        <Price>{subscription.plan_price}</Price>
      </PlanInfo>

      <TimeInfo>
        <StartDate>{subscription.current_period_start}</StartDate>
        <EndDate>{subscription.current_period_end}</EndDate>
        <DaysRemaining>{daysRemaining}天</DaysRemaining>
      </TimeInfo>

      {/* 可选：取消订阅、续费等操作 */}
    </SubscriptionCard>
  ) : (
    <EmptyState>
      <Message>你还没有订阅</Message>
      <CTAButton href="/pricing">查看订阅计划</CTAButton>
    </EmptyState>
  )}
</SubscriptionPage>
```

**实现文件**: `src/app/app/subscription/page.tsx`

---

### 3. 支付成功页面 (/app/subscription/success)

**功能**:
- 显示支付成功提示
- 显示订阅激活信息
- 提供返回教程列表的链接

**组件结构**:
```tsx
<SuccessPage>
  <SuccessIcon>✅</SuccessIcon>
  <Title>订阅成功！</Title>
  <Message>
    感谢你的订阅！你现在可以访问所有教程内容了。
  </Message>

  <SubscriptionInfo>
    <Plan>{planName}</Plan>
    <ValidUntil>{endDate}</ValidUntil>
  </SubscriptionInfo>

  <CTAButton href="/learn">开始学习</CTAButton>
</SuccessPage>
```

**实现文件**: `src/app/app/subscription/success/page.tsx`

---

### 4. 教程页面权限控制

**修改文件**: `src/app/[locale]/learn/[category]/[id]/page.tsx`

**权限检查逻辑**:
```typescript
export default async function TutorialPage({ params }: Props) {
  const { locale, category, id } = params;

  // 1. 获取教程配置
  const config = await getTutorialConfig(category, id);

  if (!config) {
    notFound();
  }

  // 2. 如果是付费教程，检查用户订阅
  if (config.isPremium) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    // 未登录，重定向到登录页
    if (!user) {
      const redirectUrl = `/${locale}/learn/${category}/${id}`;
      redirect(`/${locale}/signin?redirect=${encodeURIComponent(redirectUrl)}`);
    }

    // 检查订阅状态
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const hasAccess =
      subscription &&
      (subscription.status === 'active' || subscription.status === 'trialing') &&
      new Date(subscription.current_period_end) > new Date();

    // 无权限，重定向到定价页
    if (!hasAccess) {
      redirect(`/${locale}/pricing?locked=${category}/${id}`);
    }
  }

  // 3. 有权限，继续加载教程内容
  const tutorial = await getTutorial(category, id, locale);
  const readme = await getTutorialReadme(category, id, locale);
  const shaders = await getTutorialShaders(category, id);

  // ... 其余逻辑
}
```

---

### 5. 导航栏订阅状态显示

**修改文件**: `src/components/layout/MainLayout.tsx` 或类似文件

**添加订阅状态指示器**:
```tsx
function SubscriptionIndicator() {
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    fetch('/api/subscription/status')
      .then(res => res.json())
      .then(data => setSubscription(data));
  }, []);

  if (subscription?.active) {
    return (
      <Link href="/app/subscription" className="flex items-center gap-2">
        <span className="text-green-600">✓ Pro</span>
      </Link>
    );
  }

  return (
    <Link href="/pricing" className="btn-primary">
      升级 Pro
    </Link>
  );
}
```

---

## Creem 集成方案

### 1. 安装依赖

```bash
pnpm add @creem_io/nextjs
```

### 2. 环境变量配置

```env
# .env.local

# Creem API 凭证
CREEM_API_KEY=your_api_key_here
CREEM_WEBHOOK_SECRET=your_webhook_secret_here

# Creem 产品 Variant IDs（从 Creem Dashboard 获取）
NEXT_PUBLIC_CREEM_PRODUCT_ID_1M=variant_xxx_1month
NEXT_PUBLIC_CREEM_PRODUCT_ID_2M=variant_xxx_2month
NEXT_PUBLIC_CREEM_PRODUCT_ID_3M=variant_xxx_3month

# 站点 URL
NEXT_PUBLIC_SITE_URL=https://www.shader-learn.com
```

### 3. Creem Dashboard 配置步骤

#### Step 1: 创建产品

1. 登录 [Creem Dashboard](https://www.creem.io/dashboard)
2. 进入 Products → Create Product
3. 创建3个产品变体：

**产品 1: 1个月订阅**
- Name: GLSL Pro - 1 Month
- Price: $9.99
- Type: One-time payment (非周期订阅)
- Description: 1个月完整访问权限

**产品 2: 2个月订阅**
- Name: GLSL Pro - 2 Months
- Price: $15.9
- Type: One-time payment
- Description: 2个月完整访问权限

**产品 3: 3个月订阅**
- Name: GLSL Pro - 3 Months
- Price: $21.9
- Type: One-time payment
- Description: 3个月完整访问权限

4. 复制每个产品的 **Variant ID**，填入环境变量

#### Step 2: 配置 Webhook

1. 进入 Settings → Webhooks
2. 点击 "Add Webhook"
3. 填写信息：
   - **Webhook URL**: `https://yourdomain.com/api/webhooks/creem`
   - **Events**: 选择以下事件
     - ✅ checkout.completed
     - ✅ subscription.active
     - ✅ subscription.canceled
     - ✅ subscription.expired
     - ✅ subscription.paid
4. 保存后复制 **Webhook Secret**，填入环境变量

#### Step 3: 获取 API Key

1. 进入 Settings → API Keys
2. 创建新的 API Key
3. 复制 API Key，填入环境变量

### 4. Webhook 签名验证

Creem 使用 HMAC-SHA256 签名验证 webhook 请求：

```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return signature === computedSignature;
}
```

使用 `@creem_io/nextjs` 包时，签名验证会自动处理。

---

## 开发实施计划

### Phase 1: 基础设施准备（第1周）

#### 任务清单

- [ ] **安装依赖**
  ```bash
  pnpm add @creem_io/nextjs
  ```

- [ ] **配置环境变量**
  - 创建 `.env.local` 文件
  - 添加 Creem 相关环境变量（临时使用占位符）

- [ ] **创建数据库表**
  ```bash
  # 在 Supabase Dashboard 的 SQL Editor 中执行
  # 或者使用 Supabase CLI
  supabase db push
  ```
  - 执行 `subscriptions` 表创建 SQL
  - 执行索引创建 SQL
  - （可选）创建 `payment_events` 表

- [ ] **配置 Creem Dashboard**
  - 注册/登录 Creem 账户
  - 创建3个产品变体（1个月、2个月、3个月）
  - 获取 Variant IDs
  - 获取 API Key
  - 配置 Webhook URL（先使用 ngrok 测试）
  - 获取 Webhook Secret
  - 更新 `.env.local` 中的真实凭证

---

### Phase 2: API 端点实现（第2周）

#### 任务清单

- [ ] **实现 Checkout API**
  - 创建 `src/app/api/subscription/checkout/route.ts`
  - 实现 POST 请求处理
  - 调用 Creem API 创建 checkout session
  - 传递用户信息和元数据
  - 返回 checkout URL

- [ ] **实现 Webhook 处理**
  - 创建 `src/app/api/webhooks/creem/route.ts`
  - 使用 `@creem_io/nextjs` Webhook adapter
  - 实现以下事件处理器：
    - `onCheckoutCompleted` - 创建订阅记录
    - `onSubscriptionActive` - 激活订阅
    - `onSubscriptionPaid` - 更新订阅周期
    - `onSubscriptionCanceled` - 标记为已取消
    - `onSubscriptionExpired` - 标记为已过期
    - `onGrantAccess` - 授予访问权限
    - `onRevokeAccess` - 撤销访问权限
  - 测试 webhook 接收（使用 ngrok）

- [ ] **实现订阅状态查询 API**
  - 创建 `src/app/api/subscription/status/route.ts`
  - 实现 GET 请求处理
  - 查询用户订阅信息
  - 检查订阅是否过期
  - 返回订阅状态和剩余天数

- [ ] **Helper 函数**
  - 创建 `src/lib/subscription-helper.ts`
  - 实现 `getUserSubscription(userId)` - 获取订阅
  - 实现 `hasActiveSubscription(userId)` - 检查是否有效
  - 实现 `calculatePeriodEnd(planName)` - 计算到期时间

---

### Phase 3: 教程权限控制（第3周）

#### 任务清单

- [ ] **更新教程配置**
  - 给所有教程的 `config.json` 添加 `isPremium` 字段
  - 配置规则：
    - **basic 分类**: 全部设为 `false`（10个）
    - **patterns 分类**: 前2个 `false`，后4个 `true`
    - **math 分类**: 前1个 `false`，后4个 `true`
    - **animation 分类**: 前1个 `false`，后3个 `true`
    - **noise 分类**: 全部 `true`（3个）
    - **lighting 分类**: 全部 `true`（2个）

- [ ] **修改教程页面服务端逻辑**
  - 编辑 `src/app/[locale]/learn/[category]/[id]/page.tsx`
  - 添加权限检查逻辑（参考上面的代码）
  - 未登录用户重定向到登录页
  - 无订阅用户重定向到定价页

- [ ] **更新 TutorialConfig 类型**
  - 编辑 `src/lib/tutorials-server.ts`
  - 在 `TutorialConfig` interface 中添加 `isPremium?: boolean`

- [ ] **添加付费教程锁定 UI**
  - 在教程列表页显示 🔒 图标
  - 付费教程卡片添加"Pro"标签
  - 点击付费教程时显示升级提示

---

### Phase 4: 前端页面开发（第4周）

#### 任务清单

- [ ] **创建定价页面**
  - 创建 `src/app/[locale]/pricing/page.tsx`
  - 创建 `src/app/[locale]/pricing/pricing-client.tsx`
  - 实现3个定价卡片
  - 实现 Checkout 按钮点击逻辑
  - 添加加载状态
  - 添加错误处理
  - 支持多语言（中英文）

- [ ] **创建订阅管理页面**
  - 创建 `src/app/app/subscription/page.tsx`
  - 显示订阅状态卡片
  - 显示计划信息
  - 显示时间信息（开始、结束、剩余天数）
  - 未订阅状态的空状态展示
  - 添加"查看定价"CTA

- [ ] **创建支付成功页面**
  - 创建 `src/app/app/subscription/success/page.tsx`
  - 显示成功提示
  - 显示订阅信息
  - 添加"开始学习"CTA

- [ ] **更新导航栏**
  - 添加订阅状态指示器
  - 已订阅用户显示"Pro"徽章
  - 未订阅用户显示"升级"按钮
  - 链接到订阅管理页面或定价页面

- [ ] **添加锁定教程提示弹窗**（可选）
  - 创建 `src/components/ui/upgrade-modal.tsx`
  - 点击付费教程时显示
  - 展示升级理由和 CTA

---

### Phase 5: 测试和优化（第5周）

#### 任务清单

详见下方"测试清单"部分。

---

## 测试清单

### 1. 本地开发测试

#### 数据库测试
- [ ] 连接 Supabase 成功
- [ ] `subscriptions` 表创建成功
- [ ] 可以手动插入测试数据
- [ ] 索引创建成功

#### Creem 集成测试
- [ ] Creem API Key 配置正确
- [ ] 可以创建 Checkout Session
- [ ] Webhook Secret 配置正确
- [ ] 使用 ngrok 暴露本地端口
- [ ] Creem Dashboard 配置 ngrok URL
- [ ] 测试 Webhook 接收成功

#### API 端点测试
- [ ] `/api/subscription/checkout` 返回正确的 checkout URL
- [ ] `/api/subscription/status` 返回正确的订阅状态
- [ ] `/api/webhooks/creem` 能正确处理 webhook 事件
- [ ] Webhook 签名验证通过

---

### 2. 功能测试

#### 支付流程测试
- [ ] **未登录用户**
  - [ ] 点击定价页"订阅"按钮 → 应重定向到登录页
  - [ ] 登录后返回定价页

- [ ] **已登录用户**
  - [ ] 点击"订阅"按钮 → 创建 checkout session
  - [ ] 跳转到 Creem 托管支付页面
  - [ ] 支付页面显示正确的产品信息
  - [ ] 使用测试卡支付成功
  - [ ] Webhook 接收 `checkout.completed` 事件
  - [ ] 数据库创建订阅记录
  - [ ] 重定向到成功页面
  - [ ] 成功页面显示正确的订阅信息

#### 权限控制测试
- [ ] **免费用户**
  - [ ] 可以访问 basic 分类的所有教程
  - [ ] 可以访问其他分类的免费教程
  - [ ] 访问付费教程 → 重定向到定价页
  - [ ] 教程列表中付费教程显示 🔒 图标

- [ ] **付费用户**
  - [ ] 可以访问所有教程
  - [ ] 导航栏显示"Pro"徽章
  - [ ] 可以访问订阅管理页面
  - [ ] 订阅管理页显示正确的信息

#### 订阅状态测试
- [ ] 有效订阅（active）→ 可以访问付费内容
- [ ] 过期订阅（expired）→ 不能访问付费内容
- [ ] 试用期（trialing）→ 可以访问付费内容
- [ ] 取消订阅（canceled）→ 不能访问付费内容

#### 边界情况测试
- [ ] 订阅到期前1天 → 仍可访问
- [ ] 订阅到期当天 → 不能访问（需要续费）
- [ ] 用户删除账户 → 订阅记录级联删除
- [ ] 同一用户多次购买 → 更新订阅记录（不重复创建）
- [ ] Webhook 重复发送 → 幂等处理

---

### 3. UI/UX 测试

#### 定价页面
- [ ] 3个定价卡片正确显示
- [ ] 价格、折扣信息正确
- [ ] 推荐标签显示（如果有）
- [ ] 按钮点击有加载状态
- [ ] 多语言切换正确

#### 订阅管理页面
- [ ] 有订阅：显示订阅卡片
- [ ] 无订阅：显示空状态
- [ ] 状态徽章颜色正确（active=绿色，expired=灰色）
- [ ] 时间格式正确
- [ ] 剩余天数计算正确

#### 教程页面
- [ ] 免费教程正常显示
- [ ] 付费教程（无权限）显示锁定提示
- [ ] 付费教程（有权限）正常显示
- [ ] 升级提示 CTA 跳转正确

#### 导航栏
- [ ] 未订阅：显示"升级"按钮
- [ ] 已订阅：显示"Pro"徽章
- [ ] 点击跳转到正确页面

---

### 4. 性能测试

- [ ] 页面加载速度 < 2秒
- [ ] API 响应时间 < 500ms
- [ ] Webhook 处理时间 < 1秒
- [ ] 数据库查询优化（使用索引）
- [ ] 订阅状态查询缓存（可选）

---

### 5. 安全测试

- [ ] API 端点需要认证保护
- [ ] Webhook 签名验证通过
- [ ] SQL 注入防护（Supabase ORM 自动处理）
- [ ] XSS 防护（React 自动处理）
- [ ] 敏感信息不暴露在前端（API Key, Secret）
- [ ] HTTPS 强制（生产环境）

---

## 上线部署

### 1. 部署前检查清单

- [ ] 所有测试通过
- [ ] 环境变量配置正确（生产环境）
- [ ] Creem Dashboard 配置生产 Webhook URL
- [ ] 数据库迁移已执行（生产环境）
- [ ] 代码审查完成
- [ ] 备份数据库

### 2. 部署步骤

#### Step 1: 更新环境变量

在 Vercel Dashboard 或 `.env.production` 中配置：

```env
CREEM_API_KEY=production_api_key
CREEM_WEBHOOK_SECRET=production_webhook_secret
NEXT_PUBLIC_CREEM_PRODUCT_ID_1M=production_variant_id_1
NEXT_PUBLIC_CREEM_PRODUCT_ID_2M=production_variant_id_2
NEXT_PUBLIC_CREEM_PRODUCT_ID_3M=production_variant_id_3
NEXT_PUBLIC_SITE_URL=https://www.shader-learn.com
```

#### Step 2: 更新 Creem Webhook URL

在 Creem Dashboard：
- 旧 URL: `https://ngrok-url.com/api/webhooks/creem`
- 新 URL: `https://www.shader-learn.com/api/webhooks/creem`

#### Step 3: 执行数据库迁移

```bash
# 使用 Supabase CLI
supabase db push

# 或者在 Supabase Dashboard SQL Editor 中手动执行
```

#### Step 4: 部署到 Vercel

```bash
# 提交代码
git add .
git commit -m "feat: 添加订阅系统"
git push origin main

# Vercel 会自动部署
```

#### Step 5: 验证部署

- [ ] 访问生产环境定价页面
- [ ] 测试支付流程（使用真实卡或测试卡）
- [ ] 检查 Webhook 是否正常接收
- [ ] 检查数据库订阅记录
- [ ] 检查权限控制是否生效

### 3. 监控和日志

- [ ] 配置 Vercel Analytics
- [ ] 配置 Sentry 错误追踪（可选）
- [ ] 监控 Webhook 接收成功率
- [ ] 监控支付转化率
- [ ] 定期检查订阅数据一致性

### 4. 回滚计划

如果部署出现问题：

```bash
# 回滚到上一个版本
vercel rollback
```

或者：
- 在 Vercel Dashboard 选择之前的部署版本
- 点击"Promote to Production"

---

## 附录

### A. 教程内容划分明细

| 分类 | 教程 ID | 标题（示例） | 是否免费 |
|-----|---------|------------|---------|
| **basic** | solid-color | 纯色着色器 | ✅ 免费 |
| basic | uv-coordinates | UV 坐标 | ✅ 免费 |
| basic | basic-gradients | 基础渐变 | ✅ 免费 |
| basic | simple-circle | 简单圆形 | ✅ 免费 |
| basic | simple-rectangle | 简单矩形 | ✅ 免费 |
| basic | color-mixing | 颜色混合 | ✅ 免费 |
| basic | uv-visualizer | UV可视化 | ✅ 免费 |
| basic | step-function-mask | 阶跃函数 | ✅ 免费 |
| basic | smooth-edges | 平滑边缘 | ✅ 免费 |
| basic | basic-color-blend | 颜色混合 | ✅ 免费 |
| **patterns** | gradient-effects | 渐变效果 | ✅ 免费 |
| patterns | vertical-color-fade | 垂直渐变 | ✅ 免费 |
| patterns | radial-gradient-center | 径向渐变 | 🔒 付费 |
| patterns | checkerboard-pattern | 棋盘图案 | 🔒 付费 |
| patterns | pattern-repetition | 图案重复 | 🔒 付费 |
| patterns | color-blending-gradient | 混合渐变 | 🔒 付费 |
| **math** | sine-wave | 正弦波 | ✅ 免费 |
| math | coordinate-transformation | 坐标变换 | 🔒 付费 |
| math | smoothstep-edge-fade | Smoothstep | 🔒 付费 |
| math | centered-circle-mask | 圆形遮罩 | 🔒 付费 |
| math | simple-fractal | 简单分形 | 🔒 付费 |
| **animation** | time-animation | 时间动画 | ✅ 免费 |
| animation | breathing-color-block | 呼吸色块 | 🔒 付费 |
| animation | rectangle-color-split | 矩形分割 | 🔒 付费 |
| animation | mouse-interaction | 鼠标交互 | 🔒 付费 |
| **noise** | noise-functions | 噪声函数 | 🔒 付费 |
| noise | noise-texture | 噪声纹理 | 🔒 付费 |
| noise | fractal-brownian-motion | FBM | 🔒 付费 |
| **lighting** | phong-lighting | Phong光照 | 🔒 付费 |
| lighting | toon-shading | 卡通着色 | 🔒 付费 |

**统计**:
- 免费教程: 14 个 (47%)
- 付费教程: 16 个 (53%)

---

### B. 关键代码片段

#### 计算订阅结束时间

```typescript
function calculatePeriodEnd(planName: string): Date {
  const now = new Date();

  switch (planName) {
    case '1_month':
      return new Date(now.setMonth(now.getMonth() + 1));
    case '2_month':
      return new Date(now.setMonth(now.getMonth() + 2));
    case '3_month':
      return new Date(now.setMonth(now.getMonth() + 3));
    case '6_month':
      return new Date(now.setMonth(now.getMonth() + 6));
    case '12_month':
      return new Date(now.setMonth(now.getMonth() + 12));
    default:
      return new Date(now.setMonth(now.getMonth() + 1));
  }
}
```

#### 检查订阅是否有效

```typescript
async function hasActiveSubscription(userId: string): Promise<boolean> {
  const supabase = await createServerSupabase();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', userId)
    .single();

  if (!subscription) {
    return false;
  }

  const isStatusActive =
    subscription.status === 'active' ||
    subscription.status === 'trialing';

  const isNotExpired = new Date(subscription.current_period_end) > new Date();

  return isStatusActive && isNotExpired;
}
```

#### Webhook 签名验证（手动）

```typescript
import crypto from 'crypto';

function verifyCreemWebhook(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  return signature === computedSignature;
}

// 使用示例
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('creem-signature');

  if (!signature || !verifyCreemWebhook(rawBody, signature, process.env.CREEM_WEBHOOK_SECRET!)) {
    return new Response('Invalid signature', { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  // 处理 webhook 事件...
}
```

---

### C. 常见问题 (FAQ)

#### Q1: 用户订阅过期后会发生什么？

**A**:
- Creem 会发送 `subscription.expired` webhook 事件
- 我们的系统会将订阅状态更新为 `expired`
- 用户将无法访问付费教程
- 用户的代码和进度数据会保留
- 用户可以重新购买订阅恢复访问

#### Q2: 如果用户同时购买多个订阅怎么办？

**A**:
- 使用 `upsert` + `user_id` UNIQUE 约束
- 后购买的订阅会覆盖之前的订阅
- 订阅时间会延长（例如：现有1个月 + 新购2个月 = 总共3个月）
- 需要在 webhook 处理中实现叠加逻辑（可选）

#### Q3: 如何处理退款？

**A**:
- Creem 支持 `refund.created` webhook 事件
- 接收到退款事件时，立即撤销用户访问权限
- 将订阅状态更新为 `canceled` 或 `expired`
- 记录退款事件到 `payment_events` 表（可选）

#### Q4: 是否支持试用期？

**A**:
- 当前方案：不提供免费试用
- 如果需要：在 Creem 创建产品时启用 trial period
- Webhook 会收到 `subscription.trialing` 事件
- 试用期结束后会收到 `subscription.active` 或 `subscription.expired`

#### Q5: 如何测试支付流程？

**A**:
- 使用 ngrok 暴露本地端口
- 在 Creem Dashboard 配置 ngrok webhook URL
- 使用 Creem 提供的测试卡号进行支付
- 查看浏览器 Console 和终端日志
- 检查 Supabase 数据库订阅记录

#### Q6: 数据库订阅记录与 Creem 不一致怎么办？

**A**:
- 创建管理后台定期同步订阅状态
- 使用 Creem API 查询订阅信息
- 对比本地数据库记录
- 修复不一致的记录
- 记录同步日志

---

### D. 参考资料

**官方文档**:
- [Creem 官方文档](https://docs.creem.io/)
- [Creem 支付 API](https://docs.creem.io/finance/payments)
- [Creem Webhook 文档](https://docs.creem.io/code/webhooks)
- [Supabase 文档](https://supabase.com/docs)
- [Next.js App Router 文档](https://nextjs.org/docs/app)

**集成示例**:
- [NEXTDEVKIT Creem 集成](https://nextdevkit.com/docs/payment/creem)
- [Better Auth Creem 插件](https://www.better-auth.com/docs/plugins/creem)
- [Supastarter Creem 示例](https://supastarter.dev/docs/nextjs/payments/providers/creem)

**工具**:
- [ngrok](https://ngrok.com/) - 本地开发 Webhook 测试
- [Postman](https://www.postman.com/) - API 测试
- [Supabase Dashboard](https://app.supabase.com/) - 数据库管理

---

### E. 开发规范

#### Git Commit 规范

使用 Conventional Commits:

```
feat(subscription): 添加订阅管理页面
fix(webhook): 修复 Creem webhook 签名验证问题
chore(deps): 安装 @creem_io/nextjs
docs(readme): 更新订阅系统文档
refactor(api): 重构订阅状态查询逻辑
test(subscription): 添加订阅权限测试用例
```

#### 代码审查要点

- [ ] 敏感信息不能硬编码在代码中
- [ ] 所有 API 端点需要错误处理
- [ ] 数据库操作需要事务处理（如果需要）
- [ ] Webhook 处理需要幂等性
- [ ] 前端组件需要加载和错误状态
- [ ] 多语言文本需要使用翻译函数
- [ ] 代码格式符合 ESLint 规则

---

## 总结

本文档详细描述了 GLSL 学习平台订阅系统的完整实施方案，包括：

1. ✅ **功能规划**: 明确了免费和付费功能的边界
2. ✅ **定价策略**: 设计了3档订阅价格方案
3. ✅ **技术架构**: 使用 Creem + Supabase + Next.js
4. ✅ **数据库设计**: 完整的订阅表结构和索引
5. ✅ **API 设计**: Checkout、Status、Webhook 三个核心端点
6. ✅ **前端页面**: 定价页、订阅管理、成功页、权限控制
7. ✅ **开发计划**: 分5个 Phase，每个阶段约1周
8. ✅ **测试清单**: 涵盖功能、性能、安全测试
9. ✅ **部署方案**: 上线前检查、部署步骤、回滚计划

**预计总开发时间**: 5周

**下一步行动**:
1. 创建 Creem 账户并配置产品
2. 执行数据库迁移脚本
3. 开始 Phase 1 开发

---

**文档维护**: 随着开发进展，请及时更新本文档。

**反馈和建议**: 如有任何问题或改进建议，请在项目 Issue 中提出。
