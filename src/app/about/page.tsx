import type { Metadata } from 'next'
import { AboutPageContent } from '@/app/about/about-page-content'
import { buildAboutMetadata } from '@/lib/static-page-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildAboutMetadata('en')
}

export default function AboutPage() {
  return <AboutPageContent locale="en" />
}
