import { Metadata } from 'next';
import { HomePageContent } from '@/app/home-page-content';
import { buildHomeMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = buildHomeMetadata('en', false);

export default function RootPage() {
  // Serve English content at the root without redirect (SEO-friendly)
  return <HomePageContent locale="en" />;
}
