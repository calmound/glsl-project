import HomeStructuredData from '@/components/seo/home-structured-data';
import HomePageClient from '@/app/[locale]/home-client';
import type { Locale } from '@/lib/i18n';

interface HomePageContentProps {
  locale: Locale;
}

export function HomePageContent({ locale }: HomePageContentProps) {
  return (
    <>
      <HomeStructuredData locale={locale} />
      <HomePageClient locale={locale} />
    </>
  );
}
