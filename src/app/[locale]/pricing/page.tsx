import { Metadata } from 'next';
import { resolveLocaleFromParams } from '../../../lib/locale-page';
import { buildPricingMetadata } from '../../../lib/page-metadata';
import { PricingPageContent } from '../../pricing/pricing-page-content';

interface PricingPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: PricingPageProps): Promise<Metadata> {
    const locale = await resolveLocaleFromParams(params);
    return buildPricingMetadata(locale);
}

export default async function PricingPage({ params }: PricingPageProps) {
    const locale = await resolveLocaleFromParams(params);
    return <PricingPageContent locale={locale} />;
}
