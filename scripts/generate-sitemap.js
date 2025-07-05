#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { getTutorials, generateSitemapXML } = require('./sitemap-utils');

async function main() {
  try {
    console.log('🚀 开始生成静态sitemap...');

    // 获取教程数据
    console.log('📚 正在读取教程数据...');
    const tutorialsZh = await getTutorials('zh');
    const tutorialsEn = await getTutorials('en');

    console.log(`   - 中文教程: ${tutorialsZh.length} 个`);
    console.log(`   - 英文教程: ${tutorialsEn.length} 个`);

    // 合并教程ID（去重）
    const allTutorialIds = new Set();
    tutorialsZh.forEach(tutorial => allTutorialIds.add(`${tutorial.category}/${tutorial.id}`));
    tutorialsEn.forEach(tutorial => allTutorialIds.add(`${tutorial.category}/${tutorial.id}`));

    console.log(`📄 共发现 ${Array.from(allTutorialIds).length} 个唯一教程`);

    // 生成sitemap XML
    console.log('🔨 正在生成sitemap XML...');
    const sitemapXML = generateSitemapXML(Array.from(allTutorialIds));

    // 写入public目录
    const publicDir = path.join(process.cwd(), 'public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');

    // 确保public目录存在
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      console.log('📁 创建 public 目录');
    }

    // 写入文件
    fs.writeFileSync(sitemapPath, sitemapXML, 'utf-8');

    // 统计信息
    const lines = sitemapXML.split('\n').length;
    const urls = (sitemapXML.match(/<url>/g) || []).length;
    const fileSize = Buffer.byteLength(sitemapXML, 'utf-8');

    console.log('✅ sitemap.xml 生成成功！');
    console.log(`📁 文件位置: ${sitemapPath}`);
    console.log(`📊 统计信息:`);
    console.log(`   - URL数量: ${urls} 个`);
    console.log(`   - 文件大小: ${(fileSize / 1024).toFixed(2)} KB`);
    console.log(`   - 总行数: ${lines} 行`);
    console.log(`   - 包含语言: 中文、英文`);
    console.log(`   - hreflang支持: ✅`);
  } catch (error) {
    console.error('❌ 生成sitemap失败:', error);
    console.error('详细错误信息:', error.stack);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}
