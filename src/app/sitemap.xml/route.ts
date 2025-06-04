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
    // Remove or comment out the XSL reference line
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
    ${generateUrlEntries(Array.from(allTutorialIds), currentDate)}
    </urlset>`;
    
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',  // 改为 text/xml
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
    // 主要页面
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: 'learn', priority: '0.9', changefreq: 'weekly' },
    { path: 'about', priority: '0.7', changefreq: 'monthly' },
    { path: 'glslify-guide', priority: '0.8', changefreq: 'monthly' },
    { path: 'examples', priority: '0.8', changefreq: 'weekly' },
  ];
  
  // 为每个页面生成多语言版本
  pages.forEach(page => {
    locales.forEach(locale => {
      const url = page.path ? `${baseUrl}/${locale}/${page.path}` : `${baseUrl}/${locale}`;
      
      urls.push(`
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
    });
  });
  
  // 生成教程页面
  tutorialIds.forEach(tutorialId => {
    locales.forEach(locale => {
      const url = `${baseUrl}/${locale}/learn/${tutorialId}`;
      
      urls.push(`
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    });
  });
  
  return urls.join('');
}