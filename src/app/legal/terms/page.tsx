import { TermsPageContent } from '@/app/legal/terms/terms-page-content';
import { buildTermsMetadata } from '@/lib/static-page-metadata';

export function generateMetadata() {
  return buildTermsMetadata('en');
}

export default function TermsPageDefaultLocale() {
  return <TermsPageContent locale="en" />;
}
