"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var fs = require('fs');

var path = require('path'); // 语言配置


var locales = ['en', 'zh'];
var defaultLocale = 'en';
var baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
/**
 * 获取指定语言的所有教程数据
 * @param {string} locale - 语言代码 ('en' | 'zh')
 * @returns {Promise<Array>} 教程数组
 */

function getTutorials(locale) {
  var tutorials, tutorialsDir, categories, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, category, categoryDir, tutorialDirs, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, tutorialDir, configPath, configContent, config, title, description;

  return regeneratorRuntime.async(function getTutorials$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          tutorials = [];
          tutorialsDir = path.join(process.cwd(), 'src/lib/tutorials');
          _context.prev = 2;

          if (fs.existsSync(tutorialsDir)) {
            _context.next = 6;
            break;
          }

          console.warn("\u26A0\uFE0F  \u6559\u7A0B\u76EE\u5F55\u4E0D\u5B58\u5728: ".concat(tutorialsDir));
          return _context.abrupt("return", []);

        case 6:
          // 读取所有分类目录
          categories = fs.readdirSync(tutorialsDir, {
            withFileTypes: true
          }).filter(function (dirent) {
            return dirent.isDirectory();
          }).map(function (dirent) {
            return dirent.name;
          });
          console.log("   \uD83D\uDCC2 \u53D1\u73B0\u5206\u7C7B: ".concat(categories.join(', ')));
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 11;
          _iterator = categories[Symbol.iterator]();

        case 13:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 39;
            break;
          }

          category = _step.value;
          categoryDir = path.join(tutorialsDir, category); // 读取分类下的所有教程目录

          tutorialDirs = fs.readdirSync(categoryDir, {
            withFileTypes: true
          }).filter(function (dirent) {
            return dirent.isDirectory();
          }).map(function (dirent) {
            return dirent.name;
          });
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 20;

          for (_iterator2 = tutorialDirs[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            tutorialDir = _step2.value;
            configPath = path.join(categoryDir, tutorialDir, 'config.json');

            if (fs.existsSync(configPath)) {
              try {
                configContent = fs.readFileSync(configPath, 'utf-8');
                config = JSON.parse(configContent); // 根据语言选择标题和描述

                title = void 0, description = void 0;

                if (_typeof(config.title) === 'object') {
                  title = config.title[locale] || config.title.zh || config.title.en;
                } else {
                  title = locale === 'en' && config.title_en ? config.title_en : config.title;
                }

                if (_typeof(config.description) === 'object') {
                  description = config.description[locale] || config.description.zh || config.description.en;
                } else {
                  description = locale === 'en' && config.description_en ? config.description_en : config.description;
                }

                tutorials.push({
                  id: config.id,
                  title: title,
                  description: description,
                  difficulty: config.difficulty,
                  category: config.category
                });
              } catch (error) {
                console.error("\u274C \u89E3\u6790\u914D\u7F6E\u6587\u4EF6\u5931\u8D25 ".concat(category, "/").concat(tutorialDir, ":"), error.message);
              }
            } else {
              console.warn("\u26A0\uFE0F  \u914D\u7F6E\u6587\u4EF6\u7F3A\u5931: ".concat(category, "/").concat(tutorialDir, "/config.json"));
            }
          }

          _context.next = 28;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](20);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t0;

        case 28:
          _context.prev = 28;
          _context.prev = 29;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 31:
          _context.prev = 31;

          if (!_didIteratorError2) {
            _context.next = 34;
            break;
          }

          throw _iteratorError2;

        case 34:
          return _context.finish(31);

        case 35:
          return _context.finish(28);

        case 36:
          _iteratorNormalCompletion = true;
          _context.next = 13;
          break;

        case 39:
          _context.next = 45;
          break;

        case 41:
          _context.prev = 41;
          _context.t1 = _context["catch"](11);
          _didIteratorError = true;
          _iteratorError = _context.t1;

        case 45:
          _context.prev = 45;
          _context.prev = 46;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 48:
          _context.prev = 48;

          if (!_didIteratorError) {
            _context.next = 51;
            break;
          }

          throw _iteratorError;

        case 51:
          return _context.finish(48);

        case 52:
          return _context.finish(45);

        case 53:
          return _context.abrupt("return", tutorials);

        case 56:
          _context.prev = 56;
          _context.t2 = _context["catch"](2);
          console.error("\u274C \u8BFB\u53D6\u6559\u7A0B\u6570\u636E\u5931\u8D25 (".concat(locale, "):"), _context.t2.message);
          return _context.abrupt("return", []);

        case 60:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 56], [11, 41, 45, 53], [20, 24, 28, 36], [29,, 31, 35], [46,, 48, 52]]);
}
/**
 * 生成sitemap XML内容
 * @param {Array<string>} tutorialIds - 教程ID数组
 * @returns {string} sitemap XML字符串
 */


function generateSitemapXML(tutorialIds) {
  // 使用构建时的固定时间戳（每日更新）
  var buildDate = new Date().toISOString().split('T')[0];
  var lastmod = "".concat(buildDate, "T00:00:00Z");
  var urls = []; // 主要页面配置

  var pages = [{
    path: 'learn',
    priority: '0.9',
    changefreq: 'weekly'
  }, {
    path: 'about',
    priority: '0.7',
    changefreq: 'monthly'
  }, {
    path: 'glslify-guide',
    priority: '0.8',
    changefreq: 'monthly'
  }, {
    path: 'examples',
    priority: '0.8',
    changefreq: 'weekly'
  }]; // 生成首页URL（每种语言）

  locales.forEach(function (locale) {
    var isDefault = locale === defaultLocale;
    var localePath = isDefault ? '' : "/".concat(locale);
    var url = "".concat(baseUrl).concat(localePath);
    var priority = isDefault ? '1.0' : '0.9'; // 默认语言优先级更高

    urls.push("  <url>\n    <loc>".concat(url, "</loc>\n    <lastmod>").concat(lastmod, "</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>").concat(priority, "</priority>\n").concat(generateHreflangLinks(''), "\n  </url>"));
  }); // 生成主要页面URL

  pages.forEach(function (page) {
    locales.forEach(function (locale) {
      var isDefault = locale === defaultLocale;
      var localePath = isDefault ? '' : "/".concat(locale);
      var fullPath = "".concat(localePath, "/").concat(page.path);
      var url = "".concat(baseUrl).concat(fullPath);
      urls.push("  <url>\n    <loc>".concat(url, "</loc>\n    <lastmod>").concat(lastmod, "</lastmod>\n    <changefreq>").concat(page.changefreq, "</changefreq>\n    <priority>").concat(page.priority, "</priority>\n").concat(generateHreflangLinks(page.path), "\n  </url>"));
    });
  }); // 生成教程页面URL

  tutorialIds.forEach(function (tutorialId) {
    locales.forEach(function (locale) {
      var isDefault = locale === defaultLocale;
      var localePath = isDefault ? '' : "/".concat(locale);
      var url = "".concat(baseUrl).concat(localePath, "/learn/").concat(tutorialId);
      urls.push("  <url>\n    <loc>".concat(url, "</loc>\n    <lastmod>").concat(lastmod, "</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n").concat(generateHreflangLinks("learn/".concat(tutorialId)), "\n  </url>"));
    });
  }); // 生成完整的sitemap XML

  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" \n        xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n".concat(urls.join('\n'), "\n</urlset>");
}
/**
 * 生成hreflang替代链接
 * @param {string} path - 页面路径
 * @returns {string} hreflang链接字符串
 */


function generateHreflangLinks(path) {
  var hreflangLinks = []; // 为每种语言生成hreflang链接

  locales.forEach(function (locale) {
    var isDefault = locale === defaultLocale;
    var localePath = isDefault ? '' : "/".concat(locale);
    var fullPath = path ? "".concat(localePath, "/").concat(path) : localePath;
    var url = "".concat(baseUrl).concat(fullPath);
    hreflangLinks.push("    <xhtml:link rel=\"alternate\" hreflang=\"".concat(locale, "\" href=\"").concat(url, "\" />"));
  }); // 添加x-default链接（指向默认语言）

  var defaultPath = path ? "/".concat(path) : '';
  var defaultUrl = "".concat(baseUrl).concat(defaultPath);
  hreflangLinks.push("    <xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"".concat(defaultUrl, "\" />"));
  return hreflangLinks.join('\n');
}

module.exports = {
  getTutorials: getTutorials,
  generateSitemapXML: generateSitemapXML,
  generateHreflangLinks: generateHreflangLinks
};