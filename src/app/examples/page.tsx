import type { Metadata } from 'next'
import { ExamplesPageContent } from '@/app/examples/examples-page-content'
import { buildExamplesMetadata } from '@/lib/static-page-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildExamplesMetadata('en')
}

export default function ExamplesPage() {
  return <ExamplesPageContent locale="en" />
}
