# 🧩 Supabase Auth 接入开发指导文档（简化版，无资料补充）

## 📦 一、项目目标与技术栈

* ✅ 使用 **Supabase Auth** 处理所有登录 / 会话 / 用户状态
* ✅ 支持 **Google / GitHub 一键登录**
* ✅ 登录成功后自动跳转到首页 `/app`
* ✅ 自动写入/更新用户资料（`profiles` 表）
* ✅ 数据安全由 **RLS (Row Level Security)** 控制
* ✅ 不使用 NextAuth，不需要 onboarding 流程

---

## 1️⃣ 环境准备

### 📁 安装依赖

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

### 📄 `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的 anon key（新版）
SUPABASE_SERVICE_ROLE_KEY=你的 service_role key（仅服务端使用）
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### ✅ Supabase 控制台配置

* **Auth → Providers**：启用 Google、GitHub 并配置回调地址
  回调地址应为：

  * 本地开发：`http://localhost:3000/auth/callback`
  * 线上部署：`https://你的域名/auth/callback`
* **Auth → URL Settings**：`SITE_URL` = `NEXT_PUBLIC_APP_URL`

---

## 2️⃣ 创建 Supabase 客户端（SSR + CSR）

📁 `/lib/supabase.ts`

```ts
import { cookies } from "next/headers";
import { createServerClient, createBrowserClient } from "@supabase/ssr";

// ✅ 服务端（SSR / RSC）
export function createServerSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options })
            );
          } catch {}
        },
      },
    }
  );
}

// ✅ 客户端（CSR）
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
```

---

## 3️⃣ 创建 `profiles` 表（用户资料表）

📊 在 Supabase SQL 编辑器中执行：

```sql
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

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_profiles_updated on public.profiles;
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
```

---

## 4️⃣ 登录页（`/signin`）

📁 `app/signin/page.tsx`

```tsx
"use client";
import { createBrowserSupabase } from "@/lib/supabase";

export default function SignIn() {
  const supabase = createBrowserSupabase();

  const signInWith = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    });
  };

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">登录你的账号</h1>
      <button onClick={() => signInWith("google")} className="px-4 py-2 border">使用 Google 登录</button>
      <button onClick={() => signInWith("github")} className="px-4 py-2 border">使用 GitHub 登录</button>
    </main>
  );
}
```

---

## 5️⃣ 回调路由（`/auth/callback`）

📁 `app/auth/callback/route.ts`

```ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // ✅ 登录成功时：同步/更新资料表
    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name ?? user.email?.split("@")[0],
      avatar_url: user.user_metadata?.avatar_url ?? null,
      last_login_at: new Date().toISOString()
    });

    // ✅ 跳转首页
    return NextResponse.redirect(new URL("/app", process.env.NEXT_PUBLIC_APP_URL));
  }

  return NextResponse.redirect(new URL("/signin", process.env.NEXT_PUBLIC_APP_URL));
}
```

---

## 6️⃣ 仪表盘首页（`/app`）

📁 `app/app/page.tsx`

```tsx
import { createServerSupabase } from "@/lib/supabase";

export default async function Dashboard() {
  const supabase = createServerSupabase();
  const [{ data: { user } }, { data: profile }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("profiles").select("*").single()
  ]);

  if (!user) {
    return <div>未登录，请先访问 <a href="/signin">登录页</a></div>;
  }

  return (
    <main className="p-8 space-y-2">
      <h1 className="text-2xl">欢迎回来 👋</h1>
      <p>用户：{profile?.name ?? user.email}</p>
      <p>当前计划：{profile?.plan}</p>
    </main>
  );
}
```

---

## 7️⃣ 登出功能

📁 任意客户端组件中：

```tsx
"use client";
import { createBrowserSupabase } from "@/lib/supabase";

export default function LogoutButton() {
  const supabase = createBrowserSupabase();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.href = "/signin";
  };

  return <button onClick={handleLogout}>退出登录</button>;
}
```

## ✅ 项目目录结构建议

```
app/
  layout.tsx
  page.tsx
  signin/page.tsx              # 登录页
  auth/callback/route.ts       # 回调路由
  app/page.tsx                 # 登录后首页
lib/
  supabase.ts                  # SSR & CSR 客户端封装
```


## ✅ 总结

现在你的登录流程已经是最简化版本：

1. `/signin` —— 点击 Google/GitHub 登录
2. `/auth/callback` —— 登录成功自动写入资料并跳转 `/app`
3. `/app` —— 用户仪表盘页
4. `signOut()` —— 登出后回到 `/signin`

不需要 `onboarding`，也不需要额外资料收集，整个流程是**“登录 → 首页”**的最小闭环，符合 SaaS / 工具类网站的标准结构。

