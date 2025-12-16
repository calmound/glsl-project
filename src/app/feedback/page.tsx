import type { Metadata } from 'next'
import FeedbackLocalized, { generateMetadata as localizedMetadata } from '@/app/[locale]/feedback/page'

export async function generateMetadata(): Promise<Metadata> {
  // Reuse localized metadata logic but force English canonical at /feedback
  return localizedMetadata({ params: Promise.resolve({ locale: 'en' }) })
}

export default function FeedbackPage() {
  // Render the localized Feedback page with English locale at root path
  // This avoids redirects and matches sitemap canonical URLs
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – invoking the server component function directly
  return FeedbackLocalized({ params: Promise.resolve({ locale: 'en' }) })
}
