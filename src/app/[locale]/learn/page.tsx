import React from 'react';
import { Metadata } from 'next';
import { type Locale } from '../../../lib/i18n';
import {
  getNonDefaultLocaleStaticParams,
  requireLocaleFromParams,
  resolveLocaleFromParams,
} from '../../../lib/locale-page';
import { buildLearnMetadata } from '../../../lib/page-metadata';
import { getTutorials } from '../../../lib/tutorials-server';
import { LearnPageContent } from '../../learn/learn-page-content';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

// 生成元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (await resolveLocaleFromParams(params)) as Locale;
  return buildLearnMetadata(locale);
}

// 服务端组件
export default async function LearnPage({ params }: PageProps) {
  const locale = (await requireLocaleFromParams(params)) as Locale;
  
  // 服务端获取教程数据
  const tutorials = await getTutorials(locale);
  
  return <LearnPageContent locale={locale} tutorials={tutorials} includeStructuredData />;
}

// 生成静态参数
export function generateStaticParams() {
  return getNonDefaultLocaleStaticParams();
}
