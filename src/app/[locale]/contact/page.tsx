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
    keywords:
      locale === 'zh'
        ? '联系我们, 联系Shader Learn, GLSL问题咨询, 着色器学习支持, WebGL帮助, 技术支持邮箱'
        : 'contact us, contact Shader Learn, GLSL support, shader learning help, WebGL assistance, technical support email',
    authors: [{ name: 'Shader Learn' }],
    creator: 'Shader Learn',
    publisher: 'Shader Learn',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical,
      languages: {
        'en': '/contact',
        'zh-CN': '/zh/contact',
        'x-default': '/contact',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}${canonical}`,
      siteName: 'Shader Learn',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Contact Shader Learn',
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
      creator: '@ShaderLearn',
      site: '@ShaderLearn',
    },
    category: 'Education',
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
