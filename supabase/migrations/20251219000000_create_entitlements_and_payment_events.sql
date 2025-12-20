-- =====================================================
-- 订阅权限系统 + Creem 支付集成
-- =====================================================

-- =====================================================
-- 表1: entitlements (权限/订阅状态表)
-- =====================================================
create table if not exists entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,

  -- 权限状态
  status text not null check (status in ('active', 'expired', 'canceled', 'pending')),
  plan_type text not null default 'pro_90days',

  -- 时间范围
  start_date timestamptz not null,
  end_date timestamptz not null,

  -- Creem 映射（后续支付集成时使用）
  creem_customer_id text,
  creem_subscription_id text,

  -- 审计字段
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 创建索引
create index if not exists idx_entitlements_user_id on entitlements(user_id);
create index if not exists idx_entitlements_status on entitlements(status);
create index if not exists idx_entitlements_end_date on entitlements(end_date);
create index if not exists idx_entitlements_creem_customer on entitlements(creem_customer_id);

-- 启用 RLS
alter table entitlements enable row level security;

-- RLS 策略：用户可以查看自己的权限
create policy "Users can view own entitlements"
  on entitlements for select
  using (auth.uid() = user_id);

-- =====================================================
-- 表2: payment_events (支付事件表，用于幂等和审计)
-- =====================================================
create table if not exists payment_events (
  id uuid primary key default gen_random_uuid(),

  -- Creem 事件信息
  event_id text unique not null,
  event_type text not null,

  -- 关联信息
  user_id uuid references auth.users(id),
  creem_customer_id text,
  creem_subscription_id text,

  -- 处理状态
  processed boolean default false,
  processed_at timestamptz,

  -- 原始数据（用于调试和审计）
  raw_payload jsonb,

  created_at timestamptz default now()
);

-- 创建索引
create index if not exists idx_payment_events_event_id on payment_events(event_id);
create index if not exists idx_payment_events_user_id on payment_events(user_id);
create index if not exists idx_payment_events_processed on payment_events(processed);
create index if not exists idx_payment_events_created_at on payment_events(created_at desc);

-- 启用 RLS（仅管理员可见，普通用户不可见）
alter table payment_events enable row level security;

-- =====================================================
-- 辅助函数
-- =====================================================

-- 函数1: 检查用户是否有有效订阅
create or replace function has_active_subscription(p_user_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from entitlements
    where user_id = p_user_id
    and status = 'active'
    and end_date > now()
  );
$$;

-- 函数2: 获取用户的有效订阅详情
create or replace function get_user_entitlement(p_user_id uuid)
returns table (
  id uuid,
  status text,
  plan_type text,
  start_date timestamptz,
  end_date timestamptz
)
language sql
security definer
stable
as $$
  select id, status, plan_type, start_date, end_date
  from entitlements
  where user_id = p_user_id
  and status = 'active'
  and end_date > now()
  limit 1;
$$;

-- =====================================================
-- 触发器：自动更新 updated_at
-- =====================================================
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_entitlements_updated_at
  before update on entitlements
  for each row
  execute function update_updated_at_column();

-- =====================================================
-- 注释
-- =====================================================
comment on table entitlements is '用户权限/订阅状态表，记录谁有Pro权限以及有效期';
comment on table payment_events is '支付事件记录表，用于webhook幂等处理和审计';
comment on function has_active_subscription(uuid) is '检查指定用户是否有有效的订阅';
comment on function get_user_entitlement(uuid) is '获取指定用户的有效订阅详情';
