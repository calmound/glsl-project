import { Metadata } from 'next';
import Script from 'next/script'; // 导入Script组件
import { getValidLocale } from '../../lib/i18n';
import { getTranslationFunction } from '../../lib/translations';
import { LanguageProvider } from '../../contexts/LanguageContext';
import '../globals.css';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

// 生成元数据
export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);
  const t = getTranslationFunction(locale);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';

  return {
    title: {
      template: `%s - ${t('header.title')}`,
      default: t('header.title'),
    },
    description:
      t('header.description') || '专业的 GLSL 着色器编程学习平台，提供从基础到高级的完整学习路径',
    keywords:
      locale === 'zh'
        ? 'GLSL, WebGL, 着色器, 图形编程, 教程, 学习, 片段着色器, 顶点着色器, WebGL编程'
        : 'GLSL, WebGL, Shader, Graphics Programming, Tutorial, Learning, Fragment Shader, Vertex Shader, WebGL Programming',
    authors: [{ name: 'GLSL Learning Platform', url: baseUrl }],
    creator: 'GLSL Learning Platform',
    publisher: 'GLSL Learning Platform',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: locale === 'en' ? '/' : `/${locale}`,
      languages: {
        en: '/',
        zh: '/zh',
      },
    },
    other: {
      sitemap: '/sitemap.xml',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('header.title'),
      description: t('header.description') || '专业的 GLSL 着色器编程学习平台',
      images: [`${baseUrl}/og-image.png`],
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      siteName: t('header.title'),
      title: t('header.title'),
      description: t('header.description'),
      images: [`${baseUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// 生成静态参数
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);

  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'} suppressHydrationWarning>
      <head>
        {/* 基础 Meta 标签 */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="GLSL Learning Platform" />

        {/* 预连接优化 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />

        {/* 安全性头部 */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

        {/* PWA 支持 */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GLSL 学习" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {/* Google tag (gtag.js) 使用 next/script */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-6X7J4WLHJ6"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6X7J4WLHJ6', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
