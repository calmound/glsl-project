import { Metadata } from 'next';
import { resolveLocaleFromParams } from '../../../../lib/locale-page';
import { TermsPageContent } from '@/app/legal/terms/terms-page-content';
import { buildTermsMetadata } from '@/lib/static-page-metadata';

interface TermsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const locale = await resolveLocaleFromParams(params);
  return buildTermsMetadata(locale);
}

export default async function TermsPage({ params }: TermsPageProps) {
  const locale = await resolveLocaleFromParams(params);
  return <TermsPageContent locale={locale} />;
}
