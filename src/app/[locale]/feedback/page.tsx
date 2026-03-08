import { Metadata } from 'next';
import { resolveLocaleFromParams } from '@/lib/locale-page';
import FeedbackClient from './feedback-client';
import MainLayout from '../../../components/layout/main-layout';
import { buildFeedbackMetadata } from '@/lib/static-page-metadata';

interface FeedbackPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: FeedbackPageProps): Promise<Metadata> {
  const validLocale = await resolveLocaleFromParams(params);
  return buildFeedbackMetadata(validLocale);
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const validLocale = await resolveLocaleFromParams(params);

  return (
    <MainLayout>
      <FeedbackClient locale={validLocale} />
    </MainLayout>
  );
}
