import { Metadata } from 'next';
import { resolveLocaleFromParams } from '../../../lib/locale-page';
import { buildPlaygroundMetadata } from '../../../lib/page-metadata';
import { PlaygroundPageContent } from '../../playground/playground-page-content';

interface PlaygroundPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PlaygroundPageProps): Promise<Metadata> {
  const locale = await resolveLocaleFromParams(params);
  return buildPlaygroundMetadata(locale);
}

export default async function PlaygroundPage({ params }: PlaygroundPageProps) {
  const locale = await resolveLocaleFromParams(params);

  return <PlaygroundPageContent locale={locale} includeStructuredData />;
}
