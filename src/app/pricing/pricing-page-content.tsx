import PricingClient from '@/app/[locale]/pricing/pricing-client';
import type { Locale } from '@/lib/i18n';

interface PricingPageContentProps {
  locale: Locale;
}

export function PricingPageContent({ locale }: PricingPageContentProps) {
  return <PricingClient locale={locale} />;
}
