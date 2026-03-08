import { Metadata } from 'next';
import { PricingPageContent } from './pricing-page-content';
import { buildPricingMetadata } from '@/lib/page-metadata';

// English Pricing page at /pricing (default locale, no redirect)
export async function generateMetadata(): Promise<Metadata> {
  return buildPricingMetadata('en');
}

export default async function PricingPage() {
  return <PricingPageContent locale="en" />;
}
