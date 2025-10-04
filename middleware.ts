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
  
  // 创建 Supabase 客户端用于中间件
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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

  // 保护需要认证的路径
  const protectedPaths = ['/app'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedPath && !user) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // 如果已登录用户访问登录页，重定向到首页
  if (pathname === '/signin' && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 检查是否已经包含语言前缀
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 如果已经有语言前缀，直接返回
  if (pathnameHasLocale) {
    return response;
  }

  // 检查是否是根路径
  if (pathname === '/') {
    // 让页面组件处理重定向，这样更简单可靠
    return response;
  }

  // 对于其他路径，如果没有语言前缀，假设是默认语言
  return response;
}
