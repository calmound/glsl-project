import PrivacyPage, { generateMetadata as generateLocalizedMetadata } from '../../[locale]/legal/privacy/page';

export function generateMetadata() {
  return generateLocalizedMetadata({
    params: Promise.resolve({ locale: 'en' }),
  });
}

export default function PrivacyPageDefaultLocale() {
  return <PrivacyPage params={Promise.resolve({ locale: 'en' })} />;
}
