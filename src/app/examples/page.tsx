import type { Metadata } from 'next'
import ExamplesLocalized, { generateMetadata as localizedMetadata } from '@/app/[locale]/examples/page'

export async function generateMetadata(): Promise<Metadata> {
  // Reuse localized metadata logic but force English canonical at /examples
  return localizedMetadata({ params: Promise.resolve({ locale: 'en' }) })
}

export default function ExamplesPage() {
  // Render the localized Examples page with English locale at root path
  // This avoids redirects and matches sitemap canonical URLs
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – invoking the server component function directly
  return ExamplesLocalized({ params: Promise.resolve({ locale: 'en' }) })
}

