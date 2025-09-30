import type { Metadata } from 'next'
import GlslifyGuideLocalized, { generateMetadata as localizedMetadata } from '@/app/[locale]/glslify-guide/page'

export async function generateMetadata(): Promise<Metadata> {
  // Reuse localized metadata logic but force English canonical at /glslify-guide
  return localizedMetadata({ params: Promise.resolve({ locale: 'en' }) })
}

export default function GlslifyGuidePage() {
  // Render the localized Glslify Guide page with English locale at root path
  // This avoids redirects and matches sitemap canonical URLs
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – invoking the server component function directly
  return GlslifyGuideLocalized({ params: Promise.resolve({ locale: 'en' }) })
}

