"use strict";
exports.__esModule = true;
exports.config = exports.middleware = void 0;
var server_1 = require("next/server");
var i18n_1 = require("./lib/i18n");
// 获取首选语言
function getLocale(request) {
    // 从 URL 路径中提取语言
    var pathname = request.nextUrl.pathname;
    var pathnameIsMissingLocale = i18n_1.locales.every(function (locale) { return !pathname.startsWith("/" + locale + "/") && pathname !== "/" + locale; });
    // 如果路径中没有语言前缀，返回默认语言
    if (pathnameIsMissingLocale) {
        return i18n_1.defaultLocale;
    }
    // 从路径中提取语言
    var locale = pathname.split('/')[1];
    return i18n_1.locales.includes(locale) ? locale : i18n_1.defaultLocale;
}
function middleware(request) {
    var pathname = request.nextUrl.pathname;
    // 检查路径是否已经包含支持的语言
    var pathnameIsMissingLocale = i18n_1.locales.every(function (locale) { return !pathname.startsWith("/" + locale + "/") && pathname !== "/" + locale; });
    // 如果是根路径，重定向到英文页面
    if (pathname === '/') {
        return server_1.NextResponse.redirect(new URL('/en', request.url));
    }
    // 如果路径缺少语言前缀，重定向到带语言前缀的路径
    if (pathnameIsMissingLocale) {
        var locale_1 = getLocale(request);
        return server_1.NextResponse.redirect(new URL("/" + locale_1 + pathname, request.url));
    }
    // 检查语言是否有效
    var locale = pathname.split('/')[1];
    if (!i18n_1.locales.includes(locale)) {
        return server_1.NextResponse.redirect(new URL("/" + i18n_1.defaultLocale + pathname.slice(locale.length + 1), request.url));
    }
    return server_1.NextResponse.next();
}
exports.middleware = middleware;
exports.config = {
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
    ]
};
