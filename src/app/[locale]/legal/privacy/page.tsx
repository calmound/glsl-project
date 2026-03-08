import { Metadata } from 'next';
import { resolveLocaleFromParams } from '../../../../lib/locale-page';
import { PrivacyPageContent } from '@/app/legal/privacy/privacy-page-content';
import { buildPrivacyMetadata } from '@/lib/static-page-metadata';

interface PrivacyPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const locale = await resolveLocaleFromParams(params);
  return buildPrivacyMetadata(locale);
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const locale = await resolveLocaleFromParams(params);
  return <PrivacyPageContent locale={locale} />;
}
