import { NextRequest, NextResponse } from 'next/server';
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

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 检查路径是否已经包含支持的语言
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 如果是根路径，重定向到默认语言
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}`, request.url)
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

export const config = {
  // 匹配所有路径，除了 API 路由、静态文件等
  matcher: [
    /*
     * 匹配所有请求路径，除了以下开头的路径：
     * - api (API 路由)
     * - _next/static (静态文件)
     * - _next/image (图像优化文件)
     * - favicon.ico (网站图标)
     * - 其他静态资源
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};