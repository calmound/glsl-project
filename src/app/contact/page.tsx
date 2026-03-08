import type { Metadata } from 'next'
import { ContactPageContent } from '@/app/contact/contact-page-content'
import { buildContactMetadata } from '@/lib/static-page-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildContactMetadata('en')
}

export default function ContactPage() {
  return <ContactPageContent locale="en" />
}
