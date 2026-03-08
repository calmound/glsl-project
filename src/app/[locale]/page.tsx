import { Metadata } from 'next';
import {
  getNonDefaultLocaleStaticParams,
  resolveLocaleFromParams,
} from '../../lib/locale-page';
import { buildHomeMetadata } from '../../lib/page-metadata';
import { HomePageContent } from '../home-page-content';

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

// 生成元数据
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const locale = await resolveLocaleFromParams(params);
  return buildHomeMetadata(locale);
}

// 生成静态参数
export async function generateStaticParams() {
  return getNonDefaultLocaleStaticParams();
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = await resolveLocaleFromParams(params);

  return <HomePageContent locale={locale} />;
}
