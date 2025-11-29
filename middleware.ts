import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales } from './src/lib/i18n';
import { createServerClient } from '@supabase/ssr';

// 匹配所有路径，除了特定的文件和API路由
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (sitemap)
     * - robots.txt (robots)
     * - manifest.json (PWA manifest)
     * - .png, .jpg, .jpeg, .gif, .svg, .ico (images)
     * - .js, .css (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|sitemap-index.xml|robots.txt|manifest.json|auth/callback|.*\\.(?:png|jpg|jpeg|gif|svg|ico|js|css)).*)',
  ],
};

export async function middleware(request: NextRequest) {
  // 获取pathname
  const pathname = request.nextUrl.pathname;

  // 1. 先处理locale检查（不需要认证）
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 如果已经有语言前缀或是根路径，直接返回（公开页面）
  if (pathnameHasLocale || pathname === '/') {
    return NextResponse.next();
  }

  // 2. 检查是否是受保护路径
  const protectedPaths = ['/app', '/signin'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // 如果不是受保护路径，直接放行（公开页面如 /learn, /about 等）
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // 3. 只对受保护路径执行认证检查
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 使用正确的环境变量名称（ANON_KEY 而不是 PUBLISHABLE_KEY）
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  );

  // 检查用户认证状态
  const { data: { user } } = await supabase.auth.getUser();

  // 4. 执行保护逻辑
  // 保护 /app 路径，未登录则重定向到登录页
  if (pathname.startsWith('/app') && !user) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // 如果已登录用户访问登录页，重定向到首页
  if (pathname === '/signin' && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}
