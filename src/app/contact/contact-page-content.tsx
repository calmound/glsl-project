import MainLayout from '@/components/layout/main-layout';
import type { Locale } from '@/lib/i18n';
import { getTranslationFunction } from '@/lib/translations';

interface ContactPageContentProps {
  locale: Locale;
}

export function ContactPageContent({ locale }: ContactPageContentProps) {
  const t = getTranslationFunction(locale);
  const email = 'support@shader-learn.com';

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">{t('contact.heading')}</h1>
        <p className="text-gray-700 mb-6">{t('contact.description')}</p>
        <div className="rounded-lg border p-6 bg-white">
          <h2 className="text-xl font-semibold mb-3">{t('contact.details')}</h2>
          <ul className="space-y-2 text-gray-800">
            <li>
              <span className="font-medium">{t('contact.email_label')}: </span>
              <a className="text-blue-600 hover:underline" href={`mailto:${email}`}>
                {email}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
