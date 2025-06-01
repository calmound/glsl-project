"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.GET = void 0;
var server_1 = require("next/server");
var tutorials_server_1 = require("../../lib/tutorials-server");
var i18n_1 = require("../../lib/i18n");
var baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
function GET() {
    return __awaiter(this, void 0, void 0, function () {
        var tutorialsZh, tutorialsEn, allTutorialIds_1, currentDate, sitemap, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, tutorials_server_1.getTutorials('zh')];
                case 1:
                    tutorialsZh = _a.sent();
                    return [4 /*yield*/, tutorials_server_1.getTutorials('en')];
                case 2:
                    tutorialsEn = _a.sent();
                    allTutorialIds_1 = new Set();
                    tutorialsZh.forEach(function (tutorial) { return allTutorialIds_1.add(tutorial.category + "/" + tutorial.id); });
                    tutorialsEn.forEach(function (tutorial) { return allTutorialIds_1.add(tutorial.category + "/" + tutorial.id); });
                    currentDate = new Date().toISOString();
                    sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n" + generateUrlEntries(Array.from(allTutorialIds_1), currentDate) + "\n</urlset>";
                    return [2 /*return*/, new server_1.NextResponse(sitemap, {
                            headers: {
                                'Content-Type': 'application/xml; charset=utf-8',
                                'Cache-Control': 'public, max-age=3600, s-maxage=3600'
                            }
                        })];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error generating sitemap:', error_1);
                    return [2 /*return*/, new server_1.NextResponse("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n  <!-- Error generating sitemap -->\n</urlset>", {
                            status: 500,
                            headers: {
                                'Content-Type': 'application/xml; charset=utf-8'
                            }
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.GET = GET;
function generateUrlEntries(tutorialIds, currentDate) {
    var urls = [];
    // 生成多语言页面的URL（每个页面只生成一次，包含所有语言的alternate链接）
    var pages = [
        { path: '/', changefreq: 'daily', priority: '1.0' },
        { path: '/learn', changefreq: 'weekly', priority: '0.8' }
    ];
    // 添加教程详情页
    tutorialIds.forEach(function (tutorialId) {
        pages.push({
            path: "/learn/" + tutorialId,
            changefreq: 'weekly',
            priority: '0.7'
        });
    });
    // 为中文版本生成URL条目（带/zh前缀）
    pages.forEach(function (page) {
        urls.push("  <url>\n    <loc>" + baseUrl + "/zh" + page.path + "</loc>\n    <lastmod>" + currentDate + "</lastmod>\n    <changefreq>" + page.changefreq + "</changefreq>\n    <priority>" + page.priority + "</priority>\n    " + generateAlternateLinks(page.path) + "\n  </url>");
    });
    // 为英文版本生成独立的URL条目
    pages.forEach(function (page) {
        urls.push("  <url>\n    <loc>" + baseUrl + "/en" + page.path + "</loc>\n    <lastmod>" + currentDate + "</lastmod>\n    <changefreq>" + page.changefreq + "</changefreq>\n    <priority>" + page.priority + "</priority>\n    " + generateAlternateLinks(page.path) + "\n  </url>");
    });
    // 添加不区分语言的页面（只添加一次）
    // 关于页面
    urls.push("  <url>\n    <loc>" + baseUrl + "/about</loc>\n    <lastmod>" + currentDate + "</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>");
    // GLSL指南页面
    urls.push("  <url>\n    <loc>" + baseUrl + "/glslify-guide</loc>\n    <lastmod>" + currentDate + "</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>");
    return urls.join('\n');
}
function generateAlternateLinks(path) {
    var alternates = i18n_1.locales.map(function (locale) {
        var href = baseUrl + "/" + locale + path;
        return "    <xhtml:link rel=\"alternate\" hreflang=\"" + locale + "\" href=\"" + href + "\" />";
    }).join('\n');
    // 添加 x-default（默认指向中文版本）
    var defaultHref = baseUrl + "/zh" + path;
    return alternates + "\n    <xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"" + defaultHref + "\" />";
}
