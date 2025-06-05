import { NextRequest, NextResponse } from 'next/server';
import { locales } from './lib/i18n';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 检查路径是否已经包含支持的语言
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 如果路径缺少语言前缀，直接通过（默认为英文）
  if (pathnameIsMissingLocale) {
    return NextResponse.next();
  }

  // 检查语言是否有效
  const locale = pathname.split('/')[1];
  if (!(locales as readonly string[]).includes(locale)) {
    return NextResponse.redirect(
      new URL(`/${pathname.slice(locale.length + 2)}`, request.url)
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