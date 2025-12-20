import { Metadata } from 'next';
import PricingClient from '../[locale]/pricing/pricing-client';

// English Pricing page at /pricing (default locale, no redirect)
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  const title = 'Subscribe to Pro - Shader Learn';
  const description = 'Unlock all GLSL tutorial content and enjoy the complete learning experience. Only $9.99 for 3 months!';

  return {
    title,
    description,
    keywords:
      'GLSL subscription, Pro membership, premium tutorials, shader learning, WebGL tutorials, graphics programming',
    authors: [{ name: 'Shader Learn' }],
    creator: 'Shader Learn',
    publisher: 'Shader Learn',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/pricing`,
      siteName: 'Shader Learn',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Shader Learn Pro Subscription',
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
      creator: '@ShaderLearn',
      site: '@ShaderLearn',
    },
    alternates: {
      canonical: '/pricing',
      languages: {
        en: '/pricing',
        'zh-CN': '/zh/pricing',
        'x-default': '/pricing',
      },
    },
    category: 'Education',
  };
}

export default async function PricingPage() {
  return <PricingClient locale="en" />;
}
