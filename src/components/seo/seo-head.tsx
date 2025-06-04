'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  locale?: string;
  alternateUrls?: {
    [key: string]: string;
  };
  noindex?: boolean;
  canonical?: string;
}

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  locale = 'zh-CN',
  alternateUrls,
  noindex = false,
  canonical
}: SEOHeadProps) {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  
  const fullUrl = url || `${baseUrl}${pathname}`;
  const ogImage = image || `${baseUrl}/og-image.png`;
  const canonicalUrl = canonical || fullUrl;
  
  return (
    <Head>
      {/* 基础 Meta 标签 */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* 搜索引擎指令 */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}
      
      {/* 规范链接 */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* 语言替代链接 */}
      {alternateUrls && Object.entries(alternateUrls).map(([lang, href]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}
      
      {/* Open Graph 标签 */}
      <meta property="og:type" content={type} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="GLSL 学习平台" />
      
      {/* Twitter Card 标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
      
      {/* 移动端优化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* 性能优化 */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* PWA 支持 */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="GLSL 学习" />
      
      {/* 安全性 */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
    </Head>
  );
}