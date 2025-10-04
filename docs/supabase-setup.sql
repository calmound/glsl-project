-- 创建 profiles 表（用户资料表）
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  role text not null default 'user',
  plan text not null default 'free',
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 创建更新时间触发器函数
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin 
  new.updated_at = now(); 
  return new; 
end; 
$$;

-- 删除旧的触发器（如果存在）
drop trigger if exists trg_profiles_updated on public.profiles;

-- 创建更新时间触发器
create trigger trg_profiles_updated
before update on public.profiles
for each row execute function public.set_updated_at();

-- ✅ 启用 RLS（行级安全）
alter table public.profiles enable row level security;

-- ✅ RLS 策略：只能访问/更新自己的资料
create policy "profiles_select_own" on public.profiles
for select to authenticated
using (auth.uid() = id);

create policy "profiles_insert_self" on public.profiles
for insert to authenticated
with check (auth.uid() = id);

create policy "profiles_update_self" on public.profiles
for update to authenticated
using (auth.uid() = id);
