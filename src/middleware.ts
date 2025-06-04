import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { defaultLocale, locales } from './lib/i18n';

// 获取首选语言
function getLocale(request: NextRequest): string {
  // 从 URL 路径中提取语言
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 如果路径中没有语言前缀，返回默认语言
  if (pathnameIsMissingLocale) {
    return defaultLocale;
  }

  // 从路径中提取语言
  const locale = pathname.split('/')[1];
  return (locales as readonly string[]).includes(locale) ? locale as typeof defaultLocale : defaultLocale;
}

function handleI18nRouting(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 跳过 API 路由和认证路由
  if (pathname.startsWith('/api/') || pathname.startsWith('/auth/')) {
    return NextResponse.next();
  }
  
  // 检查路径是否已经包含支持的语言
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 如果是根路径，重定向到英文页面
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL('/en', request.url)
    );
  }

  // 如果路径缺少语言前缀，重定向到带语言前缀的路径
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  // 检查语言是否有效
  const locale = pathname.split('/')[1];
  if (!(locales as readonly string[]).includes(locale)) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname.slice(locale.length + 1)}`, request.url)
    );
  }

  return NextResponse.next();
}

export default withAuth(
  function middleware(request: NextRequest) {
    return handleI18nRouting(request);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // 受保护的路由
        const protectedRoutes = [
          '/dashboard',
          '/profile',
          '/projects'
        ];
        
        // 检查是否是受保护的路由
        const isProtectedRoute = protectedRoutes.some(route => 
          pathname.includes(route)
        );
        
        // 如果是受保护的路由，需要登录
        if (isProtectedRoute) {
          return !!token;
        }
        
        // 其他路由允许访问
        return true;
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下开头的路径：
     * - api/auth (NextAuth API 路由)
     * - _next/static (静态文件)
     * - _next/image (图像优化文件)
     * - favicon.ico (网站图标)
     * - 其他静态资源
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};