import { Metadata } from 'next'
import { resolveLocaleFromParams } from '../../../lib/locale-page'
import { ContactPageContent } from '@/app/contact/contact-page-content'
import { buildContactMetadata } from '@/lib/static-page-metadata'

interface ContactPageProps {
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const locale = await resolveLocaleFromParams(params)
  return buildContactMetadata(locale)
}

export default async function ContactPage({ params }: ContactPageProps) {
  const locale = await resolveLocaleFromParams(params)
  return <ContactPageContent locale={locale} />
}
