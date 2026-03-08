import type { Metadata } from 'next'
import FeedbackClient from '@/app/[locale]/feedback/feedback-client'
import MainLayout from '@/components/layout/main-layout'
import { buildFeedbackMetadata } from '@/lib/static-page-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildFeedbackMetadata('en')
}

export default function FeedbackPage() {
  return (
    <MainLayout>
      <FeedbackClient locale="en" />
    </MainLayout>
  )
}
