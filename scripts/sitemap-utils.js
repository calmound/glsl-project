const fs = require('fs');
const path = require('path');

// 语言配置
const locales = ['en', 'zh'];
const defaultLocale = 'en';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';

/**
 * 获取指定语言的所有教程数据
 * @param {string} locale - 语言代码 ('en' | 'zh')
 * @returns {Promise<Array>} 教程数组
 */
async function getTutorials(locale) {
  const tutorials = [];
  const tutorialsDir = path.join(process.cwd(), 'src/lib/tutorials');

  try {
    // 检查教程目录是否存在
    if (!fs.existsSync(tutorialsDir)) {
      console.warn(`⚠️  教程目录不存在: ${tutorialsDir}`);
      return [];
    }

    // 读取所有分类目录
    const categories = fs
      .readdirSync(tutorialsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`   📂 发现分类: ${categories.join(', ')}`);

    for (const category of categories) {
      const categoryDir = path.join(tutorialsDir, category);

      // 读取分类下的所有教程目录
      const tutorialDirs = fs
        .readdirSync(categoryDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const tutorialDir of tutorialDirs) {
        const configPath = path.join(categoryDir, tutorialDir, 'config.json');

        if (fs.existsSync(configPath)) {
          try {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            const config = JSON.parse(configContent);

            // 根据语言选择标题和描述
            let title, description;

            if (typeof config.title === 'object') {
              title = config.title[locale] || config.title.zh || config.title.en;
            } else {
              title = locale === 'en' && config.title_en ? config.title_en : config.title;
            }

            if (typeof config.description === 'object') {
              description =
                config.description[locale] || config.description.zh || config.description.en;
            } else {
              description =
                locale === 'en' && config.description_en
                  ? config.description_en
                  : config.description;
            }

            tutorials.push({
              id: config.id,
              title,
              description,
              difficulty: config.difficulty,
              category: config.category,
            });
          } catch (error) {
            console.error(`❌ 解析配置文件失败 ${category}/${tutorialDir}:`, error.message);
          }
        } else {
          console.warn(`⚠️  配置文件缺失: ${category}/${tutorialDir}/config.json`);
        }
      }
    }

    return tutorials;
  } catch (error) {
    console.error(`❌ 读取教程数据失败 (${locale}):`, error.message);
    return [];
  }
}

/**
 * 生成sitemap XML内容
 * @param {Array<string>} tutorialIds - 教程ID数组
 * @returns {string} sitemap XML字符串
 */
function generateSitemapXML(tutorialIds) {
  // 使用构建时的固定时间戳（每日更新）
  const buildDate = new Date().toISOString().split('T')[0];
  const lastmod = `${buildDate}T00:00:00Z`;

  const urls = [];

  // 主要页面配置
  const pages = [
    { path: 'learn', priority: '0.9', changefreq: 'weekly' },
    { path: 'about', priority: '0.7', changefreq: 'monthly' },
    { path: 'glslify-guide', priority: '0.8', changefreq: 'monthly' },
    { path: 'examples', priority: '0.8', changefreq: 'weekly' },
  ];

  // 生成首页URL（每种语言）
  locales.forEach(locale => {
    const isDefault = locale === defaultLocale;
    const localePath = isDefault ? '' : `/${locale}`;
    const url = `${baseUrl}${localePath}`;
    const priority = isDefault ? '1.0' : '0.9'; // 默认语言优先级更高

    urls.push(`  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
${generateHreflangLinks('')}
  </url>`);
  });

  // 生成主要页面URL
  pages.forEach(page => {
    locales.forEach(locale => {
      const isDefault = locale === defaultLocale;
      const localePath = isDefault ? '' : `/${locale}`;
      const fullPath = `${localePath}/${page.path}`;
      const url = `${baseUrl}${fullPath}`;

      urls.push(`  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${generateHreflangLinks(page.path)}
  </url>`);
    });
  });

  // 生成教程页面URL
  tutorialIds.forEach(tutorialId => {
    locales.forEach(locale => {
      const isDefault = locale === defaultLocale;
      const localePath = isDefault ? '' : `/${locale}`;
      const url = `${baseUrl}${localePath}/learn/${tutorialId}`;

      urls.push(`  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${generateHreflangLinks(`learn/${tutorialId}`)}
  </url>`);
    });
  });

  // 生成完整的sitemap XML
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
}

/**
 * 生成hreflang替代链接
 * @param {string} path - 页面路径
 * @returns {string} hreflang链接字符串
 */
function generateHreflangLinks(path) {
  const hreflangLinks = [];

  // 为每种语言生成hreflang链接
  locales.forEach(locale => {
    const isDefault = locale === defaultLocale;
    const localePath = isDefault ? '' : `/${locale}`;
    const fullPath = path ? `${localePath}/${path}` : localePath;
    const url = `${baseUrl}${fullPath}`;

    hreflangLinks.push(`    <xhtml:link rel="alternate" hreflang="${locale}" href="${url}" />`);
  });

  // 添加x-default链接（指向默认语言）
  const defaultPath = path ? `/${path}` : '';
  const defaultUrl = `${baseUrl}${defaultPath}`;
  hreflangLinks.push(
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}" />`
  );

  return hreflangLinks.join('\n');
}

module.exports = {
  getTutorials,
  generateSitemapXML,
  generateHreflangLinks,
};
