import { NextResponse } from 'next/server';
import { getTutorials } from '../../lib/tutorials-server';
import { locales } from '../../lib/i18n';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com/sitemap.xml';

export async function GET() {
  try {
    // 获取所有教程数据
    const tutorialsZh = await getTutorials('zh');
    const tutorialsEn = await getTutorials('en');
    
    // 合并所有教程ID（去重）
    const allTutorialIds = new Set<string>();
    tutorialsZh.forEach(tutorial => allTutorialIds.add(`${tutorial.category}/${tutorial.id}`));
    tutorialsEn.forEach(tutorial => allTutorialIds.add(`${tutorial.category}/${tutorial.id}`));
    
    const currentDate = new Date().toISOString();
    
    // 生成sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${generateUrlEntries(Array.from(allTutorialIds), currentDate)}
</urlset>`;
    
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Error generating sitemap -->
</urlset>`, { 
      status: 500,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8'
      }
    });
  }
}

function generateUrlEntries(tutorialIds: string[], currentDate: string): string {
  const urls: string[] = [];
  
  // 为每种语言生成URL条目
  locales.forEach(locale => {
    const localePrefix = locale === 'zh' ? '' : `/${locale}`;
    
    // 首页
    urls.push(`  <url>
    <loc>${baseUrl}${localePrefix}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    ${generateAlternateLinks('/')}
  </url>`);
    
    // 学习页面（列表页）
    urls.push(`  <url>
    <loc>${baseUrl}${localePrefix}/learn</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${generateAlternateLinks('/learn')}
  </url>`);
    
    // 关于页面
    urls.push(`  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`);
    
    // GLSL指南页面
    urls.push(`  <url>
    <loc>${baseUrl}/glslify-guide</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
    
    // 教程详情页
    tutorialIds.forEach(tutorialId => {
      urls.push(`  <url>
    <loc>${baseUrl}${localePrefix}/learn/${tutorialId}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    ${generateAlternateLinks(`/learn/${tutorialId}`)}
  </url>`);
    });
  });
  
  return urls.join('\n');
}

function generateAlternateLinks(path: string): string {
  const alternates = locales.map(locale => {
    const href = locale === 'zh' ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`;
    return `    <xhtml:link rel="alternate" hreflang="${locale}" href="${href}" />`;
  }).join('\n');
  
  // 添加 x-default
  const defaultHref = `${baseUrl}${path}`;
  return `${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultHref}" />`;
}