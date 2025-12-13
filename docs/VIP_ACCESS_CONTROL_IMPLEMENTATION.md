# VIP 权限控制实现指南

## 核心逻辑流程

```
用户访问教程页面
    ↓
读取 config.json
    ↓
检查 isPremium 字段
    ↓
┌──── isPremium: false ────→ 直接显示完整内容（免费教程）
│
└──── isPremium: true
        ↓
    检查用户登录状态
        ↓
    ┌─── 未登录 ──→ 重定向到 /signin?redirect=/learn/...
    │
    └─── 已登录
            ↓
        查询 subscriptions 表
            ↓
        检查订阅状态
            ↓
        ┌─── 有效订阅 ──→ 显示完整内容
        │
        └─── 无订阅/过期 ──→ 重定向到 /pricing?locked=/learn/...
```

---

## 实现方案

### 方案 1: 服务端权限检查（推荐 ✅）

**优点**:
- 安全性高，无法绕过
- SEO友好，搜索引擎可以索引免费内容
- 用户体验好，直接重定向

**实现位置**: `src/app/[locale]/learn/[category]/[id]/page.tsx`

---

## 详细代码实现

### Step 1: 创建权限检查工具函数

创建文件：`src/lib/subscription-helper.ts`

```typescript
import { createServerSupabase } from './supabase-server';

/**
 * 检查用户是否有有效的订阅
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const supabase = await createServerSupabase();

  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .single();

    if (error || !subscription) {
      console.log('⚠️ 用户无订阅记录:', userId);
      return false;
    }

    // 检查状态是否有效
    const isStatusActive =
      subscription.status === 'active' ||
      subscription.status === 'trialing';

    // 检查是否过期
    const now = new Date();
    const periodEnd = new Date(subscription.current_period_end);
    const isNotExpired = periodEnd > now;

    const hasAccess = isStatusActive && isNotExpired;

    console.log('🔍 订阅检查结果:', {
      userId,
      status: subscription.status,
      periodEnd: subscription.current_period_end,
      isStatusActive,
      isNotExpired,
      hasAccess,
    });

    return hasAccess;
  } catch (error) {
    console.error('❌ 订阅检查异常:', error);
    return false;
  }
}

/**
 * 获取用户订阅信息
 */
export async function getUserSubscription(userId: string) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('获取订阅信息失败:', error);
    return null;
  }

  return data;
}

/**
 * 检查教程是否需要付费
 */
export function isPremiumTutorial(config: any): boolean {
  return config?.isPremium === true;
}
```

---

### Step 2: 修改教程页面添加权限检查

编辑文件：`src/app/[locale]/learn/[category]/[id]/page.tsx`

在现有代码的基础上添加权限检查逻辑：

```typescript
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation'; // ← 添加 redirect
import {
  getTutorial,
  getTutorialReadme,
  getTutorialShaders,
  getTutorialsByCategory,
  getTutorialConfig, // ← 确保导入这个
} from '../../../../../lib/tutorials-server';
import { getValidLocale, type Locale } from '../../../../../lib/i18n';
import { createServerSupabase } from '../../../../../lib/supabase-server';
import { hasActiveSubscription } from '../../../../../lib/subscription-helper'; // ← 新增
import TutorialPageClient from './tutorial-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ... generateMetadata 和 generateStaticParams 保持不变 ...

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { locale: localeParam, category, id } = await params;
  const locale = getValidLocale(localeParam);

  // 1. 获取教程基本信息
  const tutorial = await getTutorial(category, id, locale);

  if (!tutorial) {
    notFound();
  }

  // 2. 获取教程配置（包含 isPremium 字段）
  const tutorialConfig = await getTutorialConfig(category, id);

  // ========================================
  // 🔐 权限检查逻辑（新增）
  // ========================================
  if (tutorialConfig?.isPremium === true) {
    console.log('🔒 这是付费教程，开始检查权限...');

    const supabase = await createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // 未登录 → 重定向到登录页
    if (authError || !user) {
      console.log('❌ 用户未登录，重定向到登录页');
      const currentPath = `/${locale}/learn/${category}/${id}`;
      const redirectUrl = `/${locale}/signin?redirect=${encodeURIComponent(currentPath)}`;
      redirect(redirectUrl);
    }

    console.log('✅ 用户已登录，检查订阅状态...');

    // 检查订阅
    const hasAccess = await hasActiveSubscription(user.id);

    // 无订阅或过期 → 重定向到定价页
    if (!hasAccess) {
      console.log('❌ 用户无有效订阅，重定向到定价页');
      const lockedPath = `${category}/${id}`;
      const redirectUrl = `/${locale}/pricing?locked=${encodeURIComponent(lockedPath)}&from=tutorial`;
      redirect(redirectUrl);
    }

    console.log('✅ 用户有有效订阅，允许访问');
  } else {
    console.log('✅ 这是免费教程，无需检查权限');
  }
  // ========================================
  // 权限检查结束
  // ========================================

  // 3. 获取教程内容和同分类的所有教程
  const [readme, shaders, categoryTutorials] = await Promise.all([
    getTutorialReadme(category, id, locale),
    getTutorialShaders(category, id),
    getTutorialsByCategory(category, locale),
  ]);

  // 4. 预取用户已保存的代码（如果已登录）
  console.log('🔍 [服务端] 开始预取用户代码...');
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  let initialCode: string | null = null;

  if (user) {
    try {
      const { data, error } = await supabase
        .from('user_form_code')
        .select('code_content')
        .eq('form_id', tutorial.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (data && !error) {
        initialCode = data.code_content;
        console.log('✅ [服务端] 成功加载用户代码');
      }
    } catch (error) {
      console.error('❌ [服务端] 读取用户代码异常:', error);
    }
  }

  // 5. 返回客户端组件
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
}
```

---

### Step 3: 创建登录页面重定向处理

确保登录页面支持 `redirect` 参数：

编辑：`src/app/signin/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase';

export default function SignIn() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const supabase = createBrowserSupabase();

  const signInWith = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          // 登录成功后重定向到原来要访问的页面
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) {
        console.error('登录错误:', error);
        alert('登录失败，请重试');
      }
    } catch (err) {
      console.error('登录异常:', err);
      alert('登录出现异常，请重试');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">登录你的账号</h1>
          <p className="text-gray-600">选择一种方式登录到 GLSL Project</p>

          {/* 显示重定向提示 */}
          {redirectTo && redirectTo !== '/' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              💡 登录后将返回到你之前访问的页面
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={() => signInWith('google')}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {/* Google Icon */}
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              {/* SVG paths... */}
            </svg>
            使用 Google 登录
          </button>

          <button
            onClick={() => signInWith('github')}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {/* GitHub Icon */}
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              {/* SVG paths... */}
            </svg>
            使用 GitHub 登录
          </button>
        </div>
      </div>
    </main>
  );
}
```

---

### Step 4: 修改 OAuth Callback 处理重定向

编辑：`src/app/auth/callback/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') || '/'; // ← 获取重定向参数

  if (code) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      // 同步用户资料
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name ?? data.user.email?.split('@')[0],
        avatar_url: data.user.user_metadata?.avatar_url ?? null,
        last_login_at: new Date().toISOString(),
      });

      // 重定向到原来要访问的页面
      return NextResponse.redirect(new URL(redirect, origin));
    }
  }

  // 登录失败，跳转到登录页
  return NextResponse.redirect(new URL('/signin', origin));
}
```

---

## 前端 UI 展示（可选增强）

### 在教程列表中显示锁定图标

编辑：`src/app/[locale]/learn/learn-client.tsx`

```typescript
// 教程卡片组件
function TutorialCard({ tutorial }: { tutorial: Tutorial & { isPremium?: boolean } }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{tutorial.title}</h3>
        {tutorial.isPremium && (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            🔒 Pro
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600">{tutorial.description}</p>
    </div>
  );
}
```

---

## 定价页面显示锁定来源（可选）

编辑：`src/app/[locale]/pricing/page.tsx`

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PricingPage() {
  const searchParams = useSearchParams();
  const locked = searchParams.get('locked'); // 例如: "patterns/checkerboard-pattern"
  const from = searchParams.get('from'); // 例如: "tutorial"

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      {/* 如果是从付费教程跳转过来，显示提示 */}
      {locked && from === 'tutorial' && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            🔒 这个教程需要 Pro 订阅才能访问。
            <br />
            升级后即可立即解锁该教程和所有其他付费内容！
          </p>
        </div>
      )}

      <h1 className="text-4xl font-bold text-center mb-4">选择你的订阅计划</h1>
      {/* ... 定价卡片 ... */}
    </div>
  );
}
```

---

## 测试检查清单

### 免费教程测试
- [ ] 未登录用户可以访问 basic 分类的所有教程
- [ ] 已登录但无订阅用户可以访问免费教程
- [ ] 已订阅用户可以访问免费教程

### 付费教程测试
- [ ] **未登录用户访问付费教程**
  - [ ] 被重定向到登录页
  - [ ] URL包含 `?redirect=` 参数
  - [ ] 登录后自动返回原教程页面

- [ ] **已登录无订阅用户访问付费教程**
  - [ ] 被重定向到定价页
  - [ ] URL包含 `?locked=` 参数
  - [ ] 定价页显示提示信息

- [ ] **已订阅用户访问付费教程**
  - [ ] 可以正常访问
  - [ ] 可以看到完整内容
  - [ ] 可以编辑和保存代码

### 订阅状态测试
- [ ] 有效订阅（status=active, 未过期）→ 可访问
- [ ] 试用期（status=trialing, 未过期）→ 可访问
- [ ] 过期订阅（status=active, 已过期）→ 不可访问
- [ ] 取消订阅（status=canceled）→ 不可访问

---

## 性能优化建议

### 1. 订阅状态缓存（可选）

使用 Next.js unstable_cache:

```typescript
import { unstable_cache } from 'next/cache';

export const hasActiveSubscription = unstable_cache(
  async (userId: string) => {
    // ... 订阅检查逻辑 ...
  },
  ['user-subscription'],
  {
    revalidate: 300, // 5分钟缓存
    tags: ['subscription'],
  }
);
```

### 2. 教程配置缓存

```typescript
import { unstable_cache } from 'next/cache';

export const getTutorialConfig = unstable_cache(
  async (category: string, id: string) => {
    // ... 读取配置逻辑 ...
  },
  ['tutorial-config'],
  {
    revalidate: 3600, // 1小时缓存
  }
);
```

---

## 常见问题

### Q: 用户购买订阅后，需要重新登录才能访问付费内容吗？

**A**: 不需要。购买完成后：
1. Creem webhook 会立即更新数据库
2. 用户刷新页面即可访问
3. 或者在支付成功页面添加"立即体验"按钮跳转

### Q: 如何处理订阅即将过期的提示？

**A**: 可以在导航栏或订阅管理页添加提示：

```typescript
const daysRemaining = Math.ceil(
  (new Date(subscription.current_period_end).getTime() - Date.now()) /
  (1000 * 60 * 60 * 24)
);

if (daysRemaining <= 7 && daysRemaining > 0) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
      ⚠️ 你的订阅将在 {daysRemaining} 天后到期
    </div>
  );
}
```

### Q: 用户尝试多次绕过权限检查怎么办？

**A**: 服务端检查是无法绕过的，因为：
1. 权限检查在服务端执行
2. 数据库查询结果无法伪造
3. `redirect()` 是服务端操作，前端无法阻止

---

## 下一步

1. ✅ 创建 `src/lib/subscription-helper.ts`
2. ✅ 修改 `src/app/[locale]/learn/[category]/[id]/page.tsx`
3. ✅ 运行批量脚本更新所有教程的 `isPremium` 字段
4. ✅ 测试权限控制逻辑
5. ✅ 部署到生产环境

---

**文档维护**: 随着需求变化及时更新本文档
