import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales } from './src/lib/i18n';

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
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|.*\\.(?:png|jpg|jpeg|gif|svg|ico|js|css)).*)',
  ],
};

export function middleware(request: NextRequest) {
  // 获取pathname
  const pathname = request.nextUrl.pathname;

  // 检查是否已经包含语言前缀
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 如果已经有语言前缀，直接返回
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 检查是否是根路径
  if (pathname === '/') {
    // 让页面组件处理重定向，这样更简单可靠
    return NextResponse.next();
  }

  // 对于其他路径，如果没有语言前缀，假设是默认语言
  return NextResponse.next();
}
