import { RefundPageContent } from '@/app/legal/refund/refund-page-content';
import { buildRefundMetadata } from '@/lib/static-page-metadata';

export function generateMetadata() {
  return buildRefundMetadata('en');
}

export default function RefundPageDefaultLocale() {
  return <RefundPageContent locale="en" />;
}
