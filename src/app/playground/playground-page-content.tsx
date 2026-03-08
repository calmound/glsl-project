import MainLayout from '@/components/layout/main-layout';
import PlaygroundStructuredData from '@/components/seo/playground-structured-data';
import PlaygroundClient from '@/app/[locale]/playground/playground-client';
import type { Locale } from '@/lib/i18n';

interface PlaygroundPageContentProps {
  locale: Locale;
  includeStructuredData?: boolean;
}

export function PlaygroundPageContent({
  locale,
  includeStructuredData = false,
}: PlaygroundPageContentProps) {
  return (
    <MainLayout>
      {includeStructuredData ? <PlaygroundStructuredData locale={locale} /> : null}
      <PlaygroundClient locale={locale} />
    </MainLayout>
  );
}
