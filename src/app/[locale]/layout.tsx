import { Metadata } from 'next';
// Nested layout: no <html>/<body> here
import { resolveLocaleFromParams, getNonDefaultLocaleStaticParams } from '../../lib/locale-page';
import { getBaseUrl, indexableRobots } from '../../lib/metadata-common';
import { buildLocaleAlternatesFor } from '../../lib/seo';
import { siteConfig } from '../../lib/site-config';
import { getTranslationFunction } from '../../lib/translations';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

// 生成元数据
export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const locale = await resolveLocaleFromParams(params);
  const t = getTranslationFunction(locale);

  const baseUrl = getBaseUrl();

  return {
    title: {
      template: `%s - ${t('header.title')}`,
      default: t('header.title'),
    },
    description:
      t('header.description') || siteConfig.descriptionZh,
    keywords:
      locale === 'zh'
        ? 'GLSL, WebGL, 着色器, 图形编程, 教程, 学习, 片段着色器, 顶点着色器, WebGL编程'
        : 'GLSL, WebGL, Shader, Graphics Programming, Tutorial, Learning, Fragment Shader, Vertex Shader, WebGL Programming',
    authors: [{ name: siteConfig.legacyEnglishName, url: baseUrl }],
    creator: siteConfig.legacyEnglishName,
    publisher: siteConfig.legacyEnglishName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: buildLocaleAlternatesFor(locale, '/'),
    other: {
      sitemap: '/sitemap.xml',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('header.title'),
      description: t('header.description') || siteConfig.descriptionZh,
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
    robots: indexableRobots,
  };
}

// 生成静态参数
export async function generateStaticParams() {
  return getNonDefaultLocaleStaticParams();
}

export const dynamicParams = false;

export default async function LocaleLayout({ children }: LocaleLayoutProps) {
  return children;
}
