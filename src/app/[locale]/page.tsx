import { Metadata } from 'next';
import { getValidLocale, type Locale } from '../../lib/i18n';
import { getTranslationFunction } from '../../lib/translations';
import HomePageClient from './home-client';

interface HomePageProps {
  params: {
    locale: string;
  };
}

// 生成元数据
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);
  const t = getTranslationFunction(locale);
  
  const title = t('home.title');
  const description = t('home.description');
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    alternates: {
      languages: {
        'zh': '/zh',
        'en': '/en',
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

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);
  
  return <HomePageClient locale={locale} />;
}