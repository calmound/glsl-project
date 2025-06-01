import { NextResponse } from 'next/server';
import { getTutorials } from '../../lib/tutorials-server';
import { locales } from '../../lib/i18n';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';

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
  
  // 生成多语言页面的URL（每个页面只生成一次，包含所有语言的alternate链接）
  const pages = [
    { path: '/', changefreq: 'daily', priority: '1.0' },
    { path: '/learn', changefreq: 'weekly', priority: '0.8' }
  ];
  
  // 添加教程详情页
  tutorialIds.forEach(tutorialId => {
    pages.push({
      path: `/learn/${tutorialId}`,
      changefreq: 'weekly',
      priority: '0.7'
    });
  });
  
  // 为中文版本生成URL条目（带/zh前缀）
  pages.forEach(page => {
    urls.push(`  <url>
    <loc>${baseUrl}/zh${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${generateAlternateLinks(page.path)}
  </url>`);
  });
  
  // 为英文版本生成独立的URL条目
  pages.forEach(page => {
    urls.push(`  <url>
    <loc>${baseUrl}/en${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    ${generateAlternateLinks(page.path)}
  </url>`);
  });
  
  // 添加不区分语言的页面（只添加一次）
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
  
  return urls.join('\n');
}

function generateAlternateLinks(path: string): string {
  const alternates = locales.map(locale => {
    const href = `${baseUrl}/${locale}${path}`;
    return `    <xhtml:link rel="alternate" hreflang="${locale}" href="${href}" />`;
  }).join('\n');
  
  // 添加 x-default（默认指向中文版本）
  const defaultHref = `${baseUrl}/zh${path}`;
  return `${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultHref}" />`;
}