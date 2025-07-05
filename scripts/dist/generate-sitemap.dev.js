#!/usr/bin/env node
"use strict";

var fs = require('fs');

var path = require('path');

var _require = require('./sitemap-utils'),
    getTutorials = _require.getTutorials,
    generateSitemapXML = _require.generateSitemapXML;

function main() {
  var tutorialsZh, tutorialsEn, allTutorialIds, sitemapXML, publicDir, sitemapPath, lines, urls, fileSize;
  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log('🚀 开始生成静态sitemap...'); // 获取教程数据

          console.log('📚 正在读取教程数据...');
          _context.next = 5;
          return regeneratorRuntime.awrap(getTutorials('zh'));

        case 5:
          tutorialsZh = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(getTutorials('en'));

        case 8:
          tutorialsEn = _context.sent;
          console.log("   - \u4E2D\u6587\u6559\u7A0B: ".concat(tutorialsZh.length, " \u4E2A"));
          console.log("   - \u82F1\u6587\u6559\u7A0B: ".concat(tutorialsEn.length, " \u4E2A")); // 合并教程ID（去重）

          allTutorialIds = new Set();
          tutorialsZh.forEach(function (tutorial) {
            return allTutorialIds.add("".concat(tutorial.category, "/").concat(tutorial.id));
          });
          tutorialsEn.forEach(function (tutorial) {
            return allTutorialIds.add("".concat(tutorial.category, "/").concat(tutorial.id));
          });
          console.log("\uD83D\uDCC4 \u5171\u53D1\u73B0 ".concat(Array.from(allTutorialIds).length, " \u4E2A\u552F\u4E00\u6559\u7A0B")); // 生成sitemap XML

          console.log('🔨 正在生成sitemap XML...');
          sitemapXML = generateSitemapXML(Array.from(allTutorialIds)); // 写入public目录

          publicDir = path.join(process.cwd(), 'public');
          sitemapPath = path.join(publicDir, 'sitemap.xml'); // 确保public目录存在

          if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, {
              recursive: true
            });
            console.log('📁 创建 public 目录');
          } // 写入文件


          fs.writeFileSync(sitemapPath, sitemapXML, 'utf-8'); // 统计信息

          lines = sitemapXML.split('\n').length;
          urls = (sitemapXML.match(/<url>/g) || []).length;
          fileSize = Buffer.byteLength(sitemapXML, 'utf-8');
          console.log('✅ sitemap.xml 生成成功！');
          console.log("\uD83D\uDCC1 \u6587\u4EF6\u4F4D\u7F6E: ".concat(sitemapPath));
          console.log("\uD83D\uDCCA \u7EDF\u8BA1\u4FE1\u606F:");
          console.log("   - URL\u6570\u91CF: ".concat(urls, " \u4E2A"));
          console.log("   - \u6587\u4EF6\u5927\u5C0F: ".concat((fileSize / 1024).toFixed(2), " KB"));
          console.log("   - \u603B\u884C\u6570: ".concat(lines, " \u884C"));
          console.log("   - \u5305\u542B\u8BED\u8A00: \u4E2D\u6587\u3001\u82F1\u6587");
          console.log("   - hreflang\u652F\u6301: \u2705");
          _context.next = 39;
          break;

        case 34:
          _context.prev = 34;
          _context.t0 = _context["catch"](0);
          console.error('❌ 生成sitemap失败:', _context.t0);
          console.error('详细错误信息:', _context.t0.stack);
          process.exit(1);

        case 39:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 34]]);
} // 运行主函数


if (require.main === module) {
  main();
}