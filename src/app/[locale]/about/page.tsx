import { Metadata } from 'next';
import { resolveLocaleFromParams } from '../../../lib/locale-page';
import { AboutPageContent } from '@/app/about/about-page-content';
import { buildAboutMetadata } from '@/lib/static-page-metadata';

interface AboutPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const locale = await resolveLocaleFromParams(params);
  return buildAboutMetadata(locale);
}

export default async function AboutPage({ params }: AboutPageProps) {
  const locale = await resolveLocaleFromParams(params);
  return <AboutPageContent locale={locale} />;
}
