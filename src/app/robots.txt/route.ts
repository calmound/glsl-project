import { NextResponse } from 'next/server';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com/sitemap.xml';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow API routes
Disallow: /api/

# Allow specific paths
Allow: /zh/
Allow: /learn/
Allow: /about
Allow: /glslify-guide

# Crawl delay
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}