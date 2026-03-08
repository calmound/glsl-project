import { Metadata } from 'next';
import { resolveLocaleFromParams } from '../../../lib/locale-page';
import { ExamplesPageContent } from '@/app/examples/examples-page-content';
import { buildExamplesMetadata } from '@/lib/static-page-metadata';

interface ExamplesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ExamplesPageProps): Promise<Metadata> {
  const locale = await resolveLocaleFromParams(params);
  return buildExamplesMetadata(locale);
}

export default async function ExamplesPage({ params }: ExamplesPageProps) {
  const locale = await resolveLocaleFromParams(params);
  return <ExamplesPageContent locale={locale} />;
}
