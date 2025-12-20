import RefundPage, { generateMetadata as generateLocalizedMetadata } from '../../[locale]/legal/refund/page';

export function generateMetadata() {
  return generateLocalizedMetadata({
    params: Promise.resolve({ locale: 'en' }),
  });
}

export default function RefundPageDefaultLocale() {
  return <RefundPage params={Promise.resolve({ locale: 'en' })} />;
}
