import TermsPage, { generateMetadata as generateLocalizedMetadata } from '../../[locale]/legal/terms/page';

export function generateMetadata() {
  return generateLocalizedMetadata({
    params: Promise.resolve({ locale: 'en' }),
  });
}

export default function TermsPageDefaultLocale() {
  return <TermsPage params={Promise.resolve({ locale: 'en' })} />;
}
