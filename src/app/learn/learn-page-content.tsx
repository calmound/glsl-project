import React from 'react';
import MainLayout from '@/components/layout/main-layout';
import LearnStructuredData from '@/components/seo/learn-structured-data';
import LearnPageClient from '@/app/[locale]/learn/learn-client';
import type { Locale } from '@/lib/i18n';
import type { Tutorial } from '@/lib/tutorials-server';

interface LearnPageContentProps {
  locale: Locale;
  tutorials: Tutorial[];
  includeStructuredData?: boolean;
}

export function LearnPageContent({
  locale,
  tutorials,
  includeStructuredData = false,
}: LearnPageContentProps) {
  return (
    <MainLayout>
      {includeStructuredData ? (
        <LearnStructuredData locale={locale} tutorials={tutorials} />
      ) : null}
      <LearnPageClient initialTutorials={tutorials} locale={locale} />
    </MainLayout>
  );
}
