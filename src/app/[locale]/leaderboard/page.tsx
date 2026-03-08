import { Metadata } from 'next';
import { resolveLocaleFromParams } from '../../../lib/locale-page';
import { getBaseUrl, indexableRobots } from '../../../lib/metadata-common';
import { buildLocaleAlternatesFor } from '../../../lib/seo';
import LeaderboardClient from './leaderboard-client';

interface LeaderboardPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: LeaderboardPageProps): Promise<Metadata> {
  const locale = await resolveLocaleFromParams(params);

  const title =
    locale === 'zh' ? 'GLSL 学习排行榜 - Shader Learn' : 'GLSL Learning Leaderboard - Shader Learn';
  const description =
    locale === 'zh'
      ? '查看 GLSL 学习排行榜，了解你的学习进度和排名。与其他开发者一起学习和进步，挑战更高排名！'
      : 'View the GLSL learning leaderboard and track your progress. Learn and improve with other developers, challenge for higher rankings!';

  const baseUrl = getBaseUrl();

  return {
    title,
    description,
    keywords:
      locale === 'zh'
        ? 'GLSL排行榜, 学习排名, 用户统计, 学习进度, 成就系统, Shader学习, WebGL排行榜'
        : 'GLSL leaderboard, learning rankings, user statistics, learning progress, achievement system, shader learning, WebGL rankings',
    authors: [{ name: 'Shader Learn' }],
    creator: 'Shader Learn',
    publisher: 'Shader Learn',
    robots: indexableRobots,
    openGraph: {
      title,
      description,
      type: 'website',
      url: locale === 'en' ? `${baseUrl}/leaderboard` : `${baseUrl}/${locale}/leaderboard`,
      siteName: 'Shader Learn',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'GLSL Learning Leaderboard',
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
      creator: '@ShaderLearn',
      site: '@ShaderLearn',
    },
    alternates: buildLocaleAlternatesFor(locale, '/leaderboard'),
    category: 'Education',
  };
}

export default async function LeaderboardPage({ params }: LeaderboardPageProps) {
  const locale = await resolveLocaleFromParams(params);

  return <LeaderboardClient locale={locale} />;
}
