import type { Metadata } from 'next';
import { createServerSupabase } from '@/lib/supabase-server';
import {
  getTutorial,
  getTutorialConfig,
  getTutorialReadme,
  getTutorialShadersLocalized,
  getTutorialsByCategory,
} from '@/lib/tutorials-server';
import type { Locale } from '@/lib/i18n';
import { getTranslationFunction } from '@/lib/translations';
import { buildLocaleAlternatesFor } from '@/lib/seo';

interface TutorialPageParams {
  locale: Locale;
  category: string;
  id: string;
}

export async function buildTutorialPageMetadata({
  locale,
  category,
  id,
}: TutorialPageParams): Promise<Metadata> {
  const t = getTranslationFunction(locale);
  const tutorial = await getTutorial(category, id, locale);

  if (!tutorial) {
    return {
      title: t('common.not_found'),
      description: t('common.not_found'),
    };
  }

  const tutorialConfig = await getTutorialConfig(category, id);
  const title = `${tutorial.title} - ${t('nav.learn')} | GLSL ${
    locale === 'zh' ? '着色器教程' : 'Shader Tutorial'
  }`;
  const description = tutorial.description;
  const keywords = [
    'GLSL',
    locale === 'zh' ? '着色器' : 'shader',
    locale === 'zh' ? '教程' : 'tutorial',
    tutorial.title,
    category,
    tutorial.difficulty,
    ...(tutorialConfig?.tags || []),
  ].join(', ');

  const detailedDescription = tutorialConfig?.estimatedTime
    ? `${description} ${
        locale === 'zh' ? '预计学习时间' : 'Estimated learning time'
      }: ${tutorialConfig.estimatedTime} ${locale === 'zh' ? '分钟' : 'minutes'}. ${
        locale === 'zh' ? '难度级别' : 'Difficulty level'
      }: ${tutorial.difficulty}.`
    : `${description} ${locale === 'zh' ? '难度级别' : 'Difficulty level'}: ${
        tutorial.difficulty
      }.`;

  return {
    title,
    description: detailedDescription,
    keywords,
    authors: [{ name: 'GLSL Tutorial' }],
    creator: 'GLSL Tutorial',
    publisher: 'GLSL Tutorial',
    category: `${locale === 'zh' ? '编程教程' : 'Programming Tutorial'}`,
    openGraph: {
      title,
      description: detailedDescription,
      type: 'article',
      siteName: 'GLSL Tutorial',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
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
    alternates: buildLocaleAlternatesFor(locale, `/learn/${category}/${id}`),
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
    other: {
      'article:author': 'GLSL Tutorial',
      'article:section': locale === 'zh' ? '着色器教程' : 'Shader Tutorial',
      'article:tag': keywords,
    },
  };
}

export async function getTutorialPageData({ locale, category, id }: TutorialPageParams) {
  const tutorial = await getTutorial(category, id, locale);

  if (!tutorial) {
    return null;
  }

  const tutorialConfig = await getTutorialConfig(category, id);
  const isFree = tutorialConfig?.isFree ?? false;
  const [readme, shaders, categoryTutorials] = await Promise.all([
    getTutorialReadme(category, id, locale),
    getTutorialShadersLocalized(category, id, locale),
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

  return {
    tutorial,
    readme,
    shaders,
    categoryTutorials,
    isFree,
    initialCode: initialCode ?? (shaders.exercise || shaders.fragment),
  };
}
