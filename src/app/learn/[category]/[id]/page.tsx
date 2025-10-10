import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getTutorial,
  getTutorialReadme,
  getTutorialShaders,
  getTutorialsByCategory,
  getTutorialConfig,
} from '@/lib/tutorials-server';
import { getTranslationFunction } from '@/lib/translations';
import { createServerSupabase } from '@/lib/supabase-server';
import TutorialPageClient from '@/app/[locale]/learn/[category]/[id]/tutorial-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TutorialPageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: TutorialPageProps): Promise<Metadata> {
  const { category, id } = await params;
  const locale = 'en' as const;
  const t = getTranslationFunction(locale);

  const tutorial = await getTutorial(category, id, locale);
  if (!tutorial) {
    return { title: t('common.not_found'), description: t('common.not_found') };
  }

  const tutorialConfig = await getTutorialConfig(category, id);
  const title = `${tutorial.title} - ${t('nav.learn')} | GLSL Shader Tutorial`;
  const description = tutorial.description;
  const detailedDescription = tutorialConfig?.estimatedTime
    ? `${description} Estimated learning time: ${tutorialConfig.estimatedTime} minutes. Difficulty level: ${tutorial.difficulty}.`
    : `${description} Difficulty level: ${tutorial.difficulty}.`;

  const keywords = [
    'GLSL',
    'shader',
    'tutorial',
    tutorial.title,
    category,
    tutorial.difficulty,
    ...(tutorialConfig?.tags || []),
  ].join(', ');

  return {
    title,
    description: detailedDescription,
    keywords,
    openGraph: {
      title,
      description: detailedDescription,
      type: 'article',
      siteName: 'GLSL Tutorial',
      locale: 'en_US',
      images: [
        {
          url: `/api/shader/${category}/${id}/preview.png`,
          width: 1200,
          height: 630,
          alt: tutorial.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: detailedDescription,
      images: [`/api/shader/${category}/${id}/preview.png`],
    },
    alternates: {
      canonical: `/learn/${category}/${id}`,
      languages: {
        en: `/learn/${category}/${id}`,
        zh: `/zh/learn/${category}/${id}`,
      },
    },
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
  };
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { category, id } = await params;
  const locale = 'en' as const;

  const tutorial = await getTutorial(category, id, locale);
  if (!tutorial) {
    notFound();
  }

  const [readme, shaders, categoryTutorials] = await Promise.all([
    getTutorialReadme(category, id, locale),
    getTutorialShaders(category, id),
    getTutorialsByCategory(category, locale),
  ]);

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialCode: string | null = null;

  if (user) {
    try {
      const { data, error } = await supabase
        .from('user_form_code')
        .select('code_content')
        .eq('form_id', tutorial.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (data && !error) {
        initialCode = data.code_content;
      }
    } catch (error) {
      console.error('[learn] Failed to load user code', error);
    }
  }

  return (
    <TutorialPageClient
      tutorial={tutorial}
      readme={readme}
      shaders={shaders}
      locale={locale}
      category={category}
      tutorialId={id}
      categoryTutorials={categoryTutorials}
      initialCode={initialCode ?? (shaders.exercise || shaders.fragment)}
    />
  );
}

