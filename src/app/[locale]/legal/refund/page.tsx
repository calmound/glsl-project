import { Metadata } from 'next';
import { resolveLocaleFromParams } from '../../../../lib/locale-page';
import { RefundPageContent } from '@/app/legal/refund/refund-page-content';
import { buildRefundMetadata } from '@/lib/static-page-metadata';

interface RefundPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: RefundPageProps): Promise<Metadata> {
  const locale = await resolveLocaleFromParams(params);
  return buildRefundMetadata(locale);
}

export default async function RefundPage({ params }: RefundPageProps) {
  const locale = await resolveLocaleFromParams(params);
  return <RefundPageContent locale={locale} />;
}
