import { Metadata } from 'next'
import MainLayout from '../../../components/layout/main-layout'
import { getValidLocale } from '../../../lib/i18n'
import { getTranslationFunction } from '../../../lib/translations'

interface ContactPageProps {
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com'
  const t = getTranslationFunction(locale)
  const title = t('contact.title')
  const description = t('contact.description')

  const canonical = locale === 'en' ? '/contact' : `/${locale}/contact`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: '/contact',
        zh: '/zh/contact',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}${canonical}`,
      images: [`${baseUrl}/og-image.png`],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
    },
  }
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: localeParam } = await params
  const locale = getValidLocale(localeParam)
  const t = getTranslationFunction(locale)
  const email = 'shaderlearn@hotmail.com'

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
              <a className="text-blue-600 hover:underline" href={`mailto:${email}`}>{email}</a>
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  )
}
