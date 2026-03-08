import { PrivacyPageContent } from '@/app/legal/privacy/privacy-page-content';
import { buildPrivacyMetadata } from '@/lib/static-page-metadata';

export function generateMetadata() {
  return buildPrivacyMetadata('en');
}

export default function PrivacyPageDefaultLocale() {
  return <PrivacyPageContent locale="en" />;
}
