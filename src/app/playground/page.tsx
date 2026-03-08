import { Metadata } from 'next';
import { PlaygroundPageContent } from '@/app/playground/playground-page-content';
import { buildPlaygroundMetadata } from '@/lib/page-metadata';

// English Playground page at /playground (default locale, no redirect)
export async function generateMetadata(): Promise<Metadata> {
  return buildPlaygroundMetadata('en');
}

export default function PlaygroundPage() {
  return <PlaygroundPageContent locale="en" />;
}
