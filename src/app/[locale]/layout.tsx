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
  
  return {
    title: {
      template: `%s - ${t('header.title')}`,
      default: t('header.title'),
    },
    description: t('header.description'),
    keywords: locale === 'en' 
      ? 'GLSL, WebGL, Shader, Graphics Programming, Tutorial, Learning'
      : 'GLSL, WebGL, 着色器, 图形编程, 教程, 学习',
    authors: [{ name: 'GLSL Learning Platform' }],
    creator: 'GLSL Learning Platform',
    publisher: 'GLSL Learning Platform',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'zh': '/zh',
        'en': '/en',
      },
    },
    other: {
      'sitemap': '/sitemap.xml',
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      title: t('header.title'),
      description: t('header.description'),
      siteName: t('header.title'),
    },
    twitter: {
      card: 'summary_large_image',
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