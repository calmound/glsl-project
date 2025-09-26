import { Metadata } from 'next';
import HomePageClient from '@/app/[locale]/home-client';

export const metadata: Metadata = {
  title: 'Learn GLSL Shaders – Interactive Tutorials',
  description:
    'Interactive GLSL shader tutorials for WebGL. Learn fragment shaders, patterns, noise, lighting and more.',
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      zh: '/zh',
    },
  },
};

export default function RootPage() {
  // Serve English content at the root without redirect (SEO-friendly)
  return <HomePageClient locale="en" />;
}
