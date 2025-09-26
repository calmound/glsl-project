import React from 'react';
import { Metadata } from 'next';
import MainLayout from '@/components/layout/main-layout';
import LearnPageClient from '@/app/[locale]/learn/learn-client';
import { getTranslationFunction } from '@/lib/translations';
import { getTutorials } from '@/lib/tutorials-server';

// English Learn page at /learn (default locale, no redirect)
export async function generateMetadata(): Promise<Metadata> {
  const locale = 'en' as const;
  const t = getTranslationFunction(locale);
  const title = t('learn.title');
  const description = t('learn.description');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';

  return {
    title: `${title} - ${t('header.title')}`,
    description,
    keywords:
      'GLSL tutorials, WebGL lessons, shader programming course, graphics programming learning',
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/learn`,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: '/learn',
      languages: {
        en: '/learn',
        zh: '/zh/learn',
      },
    },
  };
}

export default async function LearnPage() {
  const tutorials = await getTutorials('en');
  return (
    <MainLayout>
      <LearnPageClient initialTutorials={tutorials} locale="en" />
    </MainLayout>
  );
}

