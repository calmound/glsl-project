import type { Metadata } from 'next'
import AboutLocalized, { generateMetadata as localizedMetadata } from '@/app/[locale]/about/page'

export async function generateMetadata(): Promise<Metadata> {
  // Reuse localized metadata logic but force English canonical at /about
  return localizedMetadata({ params: Promise.resolve({ locale: 'en' }) })
}

export default function AboutPage() {
  // Render the localized About page with English locale at root path
  // This avoids redirects and matches sitemap canonical URLs
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – invoking the server component function directly
  return AboutLocalized({ params: Promise.resolve({ locale: 'en' }) })
}

