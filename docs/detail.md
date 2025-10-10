# 详情页设计与实现指南（Next.js + Supabase）

## 概要
- 本地题目：每题目录含 `config.json`，以其中的 `id` 作为绑定键。
- 无缓存：用户代码与提交状态全部落库。
- 安全：RLS 仅允许本人读写自己的代码；“通过”状态仅由服务端写入（Edge Function 使用 service_role）。

## 绑定与键选择
- 绑定键：`form_id = config.json.id`。
- 现状示例：`src/lib/tutorials/animation/breathing-color-block/config.json` 中 `id` 为文本（如 `breathing-color-block`）。
- 因此数据库中 `form_id` 字段类型建议为 `text`（与当前 config 一致）。

## 数据库结构（表 + RLS）
- 表一：`public.user_form_code`（用户代码）
  - 字段：`id, user_id, form_id(text), code_content, language, is_draft, version, created_at, updated_at`
  - 约束与索引：`unique(user_id, form_id)`；可选 `index(form_id)`
- 表二：`public.user_form_status`（提交状态）
  - 字段：`id, user_id, form_id(text), has_submitted, is_passed, attempts, last_submitted_at, first_passed_at, last_result, created_at, updated_at`
  - 约束与索引：`unique(user_id, form_id)`；可选 `index(form_id)`
- 触发器（自动更新时间 + 版本自增）
  - 更新时 `updated_at = now()`；当 `user_form_code.code_content` 变更时 `version = version + 1`
- RLS 策略
  - `user_form_code`：本人可 `select/insert/update`（`auth.uid() = user_id`）
  - `user_form_status`：本人仅可 `select`；不为 authenticated 创建 insert/update 策略（仅 Edge Function 写）

示例 SQL（form_id 为 text）
```
create extension if not exists pgcrypto;

create table if not exists public.user_form_code (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  form_id text not null,
  code_content text not null default '',
  language text,
  is_draft boolean not null default true,
  version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_form_code_user_form_uniq unique (user_id, form_id)
);
create index if not exists idx_user_form_code_form on public.user_form_code(form_id);

create table if not exists public.user_form_status (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  form_id text not null,
  has_submitted boolean not null default false,
  is_passed boolean not null default false,
  attempts int not null default 0,
  last_submitted_at timestamptz,
  first_passed_at timestamptz,
  last_result jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_form_status_user_form_uniq unique (user_id, form_id)
);
create index if not exists idx_user_form_status_form on public.user_form_status(form_id);

create or replace function public.set_updated_at_and_bump_version()
returns trigger as $$
begin
  new.updated_at = now();
  if tg_table_name = 'user_form_code' then
    if new.code_content is distinct from old.code_content then
      new.version = old.version + 1;
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trig_user_form_code_upd on public.user_form_code;
create trigger trig_user_form_code_upd
before update on public.user_form_code
for each row execute function public.set_updated_at_and_bump_version();

drop trigger if exists trig_user_form_status_upd on public.user_form_status;
create trigger trig_user_form_status_upd
before update on public.user_form_status
for each row execute function public.set_updated_at_and_bump_version();

alter table public.user_form_code enable row level security;
alter table public.user_form_status enable row level security;

create policy if not exists user_form_code_select_own
on public.user_form_code for select using (auth.uid() = user_id);

create policy if not exists user_form_code_insert_own
on public.user_form_code for insert with check (auth.uid() = user_id);

create policy if not exists user_form_code_update_own
on public.user_form_code for update using (auth.uid() = user_id);

create policy if not exists user_form_status_select_own
on public.user_form_status for select using (auth.uid() = user_id);
```

可选 RPC：进入详情页确保存在一行
```
create or replace function public.ensure_user_form_code(p_form_id text, p_code text default '')
returns void
language sql
as $$
  insert into public.user_form_code(user_id, form_id, code_content)
  values (auth.uid(), p_form_id, coalesce(p_code, ''))
  on conflict (user_id, form_id) do nothing;
$$;
```

## Next.js 接入（App Router）
- SSR：`src/lib/supabase-server.ts`（已存在）
- CSR：`src/lib/supabase.ts`（已存在）
- 详情页：`src/app/[locale]/learn/[category]/[id]/page.tsx`
  - 从 `tutorials-server.ts` 获取 `tutorial.id`（即 `config.json.id`）作为 `form_id`
  - 可在服务端预取用户代码并传给客户端组件

服务端预取示例
```
const supabase = await createServerSupabase();
const { data: { user } } = await supabase.auth.getUser();
let initialCode: string | null = null;
if (user) {
  const { data } = await supabase
    .from('user_form_code')
    .select('code_content')
    .eq('form_id', tutorial.id)
    .single()
    .throwOnError(false);
  initialCode = data?.code_content ?? null;
}
return (
  <TutorialPageClient
    tutorial={tutorial}
    readme={readme}
    shaders={shaders}
    locale={locale}
    category={category}
    tutorialId={id}
    categoryTutorials={categoryTutorials}
    initialCode={initialCode ?? (shaders.exercise || shaders.fragment)}
  />
);
```

客户端保存与提交（`src/app/[locale]/learn/[category]/[id]/tutorial-client.tsx`）
```
'use client';
import { createBrowserSupabase } from '@/lib/supabase';
const supabase = createBrowserSupabase();

async function saveCode(formId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from('user_form_code')
    .upsert({
      user_id: user.id,
      form_id: formId,
      code_content: content,
      language: 'glsl',
      is_draft: true,
    }, { onConflict: 'user_id,form_id' })
    .select();
}

async function submit(formId: string) {
  // 本地 WebGL 验证通过后再调用
  const { data, error } = await supabase.functions.invoke('submit_form', { body: { formId } });
  // data: { passed, attempts, lastResult, firstPassedAt }
}
```

## Edge Function（提交与状态写入）
- 路径：`supabase/functions/submit_form/index.ts`
- 步骤：
  - 用请求头中的 JWT 获取 `user_id`
  - 读取 `user_form_code` 拿到代码
  - 执行判题（先占位，后替换真实逻辑）
  - upsert/update `user_form_status`：累计 `attempts`、首过时间仅写一次，不回退 `is_passed`

骨架代码
```
import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const authHeader = req.headers.get('Authorization') || '';
  const jwt = authHeader.replace('Bearer ', '');
  const { formId } = await req.json();

  const supa = createClient(supabaseUrl, serviceRoleKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });

  const { data: u } = await supa.auth.getUser();
  if (!u?.user) return new Response('Unauthorized', { status: 401 });
  const userId = u.user.id;

  const { data: codeRow } = await supa
    .from('user_form_code')
    .select('code_content')
    .eq('user_id', userId)
    .eq('form_id', formId)
    .maybeSingle();

  const code = codeRow?.code_content ?? '';
  const passed = false; // TODO: 替换为实际判题
  const lastResult = { message: passed ? 'ok' : 'failed' };

  const { data: st } = await supa
    .from('user_form_status')
    .upsert({
      user_id: userId,
      form_id: formId,
      has_submitted: true,
      is_passed: passed ? true : undefined,
      attempts: 1,
      last_submitted_at: new Date().toISOString(),
      first_passed_at: passed ? new Date().toISOString() : undefined,
      last_result: lastResult,
    }, { onConflict: 'user_id,form_id' })
    .select()
    .single();

  if (st) {
    const { attempts = 0, first_passed_at } = st as any;
    const next: any = {
      has_submitted: true,
      attempts: attempts + 1,
      last_submitted_at: new Date().toISOString(),
      last_result: lastResult,
    };
    if (passed && !first_passed_at) next.first_passed_at = new Date().toISOString();
    if (passed) next.is_passed = true;
    await supa.from('user_form_status').update(next).eq('user_id', userId).eq('form_id', formId);
  }

  return new Response(JSON.stringify({
    passed,
    attempts: (st?.attempts ?? 0) + 1,
    lastResult,
    firstPassedAt: st?.first_passed_at || null,
  }), { headers: { 'Content-Type': 'application/json' } });
});
```

## 交互流程（无缓存，全走数据库）
- 首次进入：读取 `user_form_code` 与 `user_form_status`；无记录→展示本地 starter 与未提交状态
- 自动保存：`upsert(user_id, form_id)` 更新 `code_content`；触发器维护 `updated_at/version`
- 提交：本地 WebGL 验证通过 → 调用 Edge Function → 服务端更新 `user_form_status`

## 开发清单（Checklist）
- ✅ 执行 SQL 迁移并验证 RLS（form_id 使用 text）
- ✅ 详情页 SSR 预取或客户端加载用户代码（以数据库为准）
- ✅ 客户端编辑器中增加保存 upsert；提交时调用 Edge Function
- ✅ 实现 `supabase/functions/submit_form` 判题与状态写入（当前为占位逻辑，可替换为真实逻辑）
- ✅ 验证：未登录不可读写；用户隔离；客户端无法直接写 `user_form_status`；通过后不回退 `is_passed`
- ✅ 优化 RLS 策略性能（使用 `(select auth.uid())`）
- ✅ 修复函数安全问题（设置 `search_path`）
- ✅ 部署 Edge Function 到 Supabase
- ✅ 创建 TypeScript 类型定义
- ✅ 清理调试代码

## 实施完成状态

### ✅ 已完成功能

**数据库层**:
- `user_form_code` 表（带版本控制）
- `user_form_status` 表（带提交追踪）
- 触发器自动维护 `updated_at` 和 `version`
- RLS 策略确保数据隔离（已优化性能）
- 辅助函数 `ensure_user_form_code`

**Edge Function**:
- `submit_form` 已部署（Version 1）
- JWT 身份验证
- 服务端判题框架（占位实现）
- 状态更新逻辑（不回退 `is_passed`）

**Next.js 集成**:
- 服务端预取用户代码（SSR）
- 客户端自动保存（2秒防抖）
- 提交到 Edge Function
- TypeScript 类型安全

**代码质量**:
- 清理所有调试 console.log
- 添加错误处理
- 性能优化（RLS 策略）
- 安全加固（函数 search_path）

### 📋 详细文档

- [实施报告](./IMPLEMENTATION_REPORT.md) - 详细的技术实现说明
- [快速开始](./QUICKSTART.md) - 本地开发和测试指南

### ⚠️ 已知问题和待改进

1. **Edge Function 判题逻辑**: 当前返回 `passed: false`，需要实现真实验证
2. **索引使用**: `idx_user_form_code_form` 和 `idx_user_form_status_form` 尚未使用（新建表，需要生产数据后观察）
3. **密码保护**: Auth 的泄露密码保护功能未启用

### 🔜 后续规划

见 [优化建议与实施计划](#优化建议与实施计划implementation-plan) 章节

## 优化建议与实施计划（Implementation plan）
下面给出分级优先级的具体改动项、示例代码片段与快速验证步骤，方便按步落地实现。

### 优先级 P0（必须完成 — 核心功能）
- 在 Supabase 中执行并验证 SQL 迁移（详见上文 SQL 示例）。确保表和触发器创建成功并启用 RLS。
  - 推荐在本地或开发环境运行 SQL，或将 SQL 粘贴到 Supabase 的 SQL Editor 并执行后验证：

```sql
-- 示例：检查表是否存在
select tablename from pg_tables where schemaname = 'public' and tablename in ('user_form_code', 'user_form_status');
```

- 实现 Edge Function `submit_form`（服务端判题 + 状态更新）。骨架：

```ts
// supabase/functions/submit_form/index.ts
import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const jwt = (req.headers.get('Authorization') || '').replace('Bearer ', '');
  const { formId } = await req.json();

  const supa = createClient(supabaseUrl, serviceRoleKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });

  // 1) 通过 supa.auth.getUser() 验证 JWT 并获取 user.id
  // 2) 读取 user_form_code 中的 code_content
  // 3) 执行判题（当前可用占位逻辑：先返回 failed）
  // 4) upsert user_form_status：attempts += 1, last_result, first_passed_at (仅首次通过写入), is_passed 仅可置 true

  return new Response(JSON.stringify({ passed: false, attempts: 1, lastResult: { message: 'placeholder' } }), { headers: { 'Content-Type': 'application/json' } });
});
```

- 在服务端（Next.js SSR）预取用户已保存代码：

```ts
// page.tsx (server)
const supabase = await createServerSupabase();
const { data: { user } } = await supabase.auth.getUser();
let initialCode: string | null = null;
if (user) {
  const { data } = await supabase
    .from('user_form_code')
    .select('code_content')
    .eq('form_id', tutorial.id)
    .single()
    .throwOnError(false);
  initialCode = data?.code_content ?? null;
}
```

### 优先级 P1（高优先级 — 用户体验）
- 在客户端 `tutorial-client.tsx` 中实现自动保存（debounce + upsert）：保存到 `user_form_code`。
  - 推荐使用 2s 防抖（debounce）避免过多请求。

```ts
// client-side (简化示例)
import { debounce } from 'lodash';
import { createBrowserSupabase } from '@/lib/supabase';

const debouncedSave = debounce(async (code: string) => {
  const supabase = createBrowserSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('user_form_code').upsert({
    user_id: user.id,
    form_id: tutorialId,
    code_content: code,
    language: 'glsl',
    is_draft: true,
  }, { onConflict: 'user_id,form_id' });
}, 2000);

// 在编辑器 onChange 时调用 debouncedSave(newCode)
```

- 提交流程：客户端先用 WebGL 在本地验证（compile + program link）；验证通过后调用 Edge Function `submit_form`。Edge Function 使用 service_role 操作 `user_form_status` 并返回判题结果。

### 代码质量与类型安全
- 为与数据库交互定义 TypeScript 接口（`src/types/`）：

```ts
export interface UserFormCode {
  id: string;
  user_id: string;
  form_id: string;
  code_content: string;
  language?: string;
  is_draft: boolean;
  version: number;
}
```

- 把重复的 WebGL 编译/比较逻辑提取为 Hook（例如 `useWebGLValidator`），便于测试与复用。

### 验证与质量门（Quality gates）
1. 本地运行 `pnpm dev`，打开一个未登录用户页面，验证编辑器使用本地 starter 代码
2. 登录用户，打开同一教程页面，确认服务器端预取的 `initialCode` 覆盖本地 starter（若有历史）
3. 修改代码后观察是否自动保存（Network -> /rest/v1/user_form_code upsert）
4. 点击提交，观察 Edge Function 返回并且 `user_form_status` 更新

### 快速命令（Windows PowerShell）

### 变更清单（要修改/新增的文件）
- 新增 / 修改（示例）:
  - `supabase/functions/submit_form/index.ts` (新增 Edge Function)
  - `src/app/[locale]/learn/[category]/[id]/tutorial-client.tsx` (自动保存 + 提交调用)
  - `src/lib/supabase-server.ts` (已存在，确认 cookies 支持)
  - `docs/supabase-setup.sql` 或 `docs/supabse.md` (确保 SQL 版本一致)
