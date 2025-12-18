import { Metadata } from 'next';
import LeaderboardClient from '@/app/[locale]/leaderboard/leaderboard-client';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';

export const metadata: Metadata = {
  title: 'GLSL Learning Leaderboard - Shader Learn',
  description:
    'View the GLSL learning leaderboard and track your progress. Learn and improve with other developers, challenge for higher rankings!',
  keywords:
    'GLSL leaderboard, learning rankings, user statistics, learning progress, achievement system, shader learning, WebGL rankings',
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
    title: 'GLSL Learning Leaderboard - Shader Learn',
    description:
      'View the GLSL learning leaderboard and track your progress. Learn and improve with other developers!',
    type: 'website',
    url: `${baseUrl}/leaderboard`,
    siteName: 'Shader Learn',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'GLSL Learning Leaderboard',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GLSL Learning Leaderboard - Shader Learn',
    description: 'View the GLSL learning leaderboard and track your progress.',
    images: [`${baseUrl}/og-image.png`],
    creator: '@ShaderLearn',
    site: '@ShaderLearn',
  },
  alternates: {
    canonical: '/leaderboard',
    languages: {
      'en': '/leaderboard',
      'zh-CN': '/zh/leaderboard',
      'x-default': '/leaderboard',
    },
  },
  category: 'Education',
};

export default function LeaderboardPage() {
  return <LeaderboardClient locale="en" />;
}
