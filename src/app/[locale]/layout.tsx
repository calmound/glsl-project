import { Metadata } from 'next';
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
    description: t('header.description') || '专业的 GLSL 着色器编程学习平台，提供从基础到高级的完整学习路径',
    keywords: locale === 'en' 
      ? 'GLSL, WebGL, Shader, Graphics Programming, Tutorial, Learning, Fragment Shader, Vertex Shader, WebGL Programming'
      : 'GLSL, WebGL, 着色器, 图形编程, 教程, 学习, 片段着色器, 顶点着色器, WebGL编程',
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
        'en': '/',
        'zh': '/zh',
      },
    },
    other: {
      'sitemap': '/sitemap.xml',
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
  return [
    { locale: 'zh' },
    { locale: 'en' },
  ];
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);
  
  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <LanguageProvider initialLocale={locale}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}