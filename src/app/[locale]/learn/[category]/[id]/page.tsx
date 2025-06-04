import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTutorial, getTutorialReadme, getTutorialShaders, getTutorialsByCategory } from '../../../../../lib/tutorials-server';
import { getValidLocale, type Locale } from '../../../../../lib/i18n';
import { getTranslationFunction } from '../../../../../lib/translations';
import TutorialPageClient from './tutorial-client';

interface TutorialPageProps {
  params: Promise<{
    locale: string;
    category: string;
    id: string;
  }>;
}

// 生成元数据
export async function generateMetadata({ params }: TutorialPageProps): Promise<Metadata> {
  const { locale: localeParam, category, id } = await params;
  const locale = getValidLocale(localeParam);
  const t = getTranslationFunction(locale);
  
  const tutorial = await getTutorial(category, id, locale);
  
  if (!tutorial) {
    return {
      title: t('common.not_found'),
      description: t('common.not_found'),
    };
  }
  
  const title = `${tutorial.title} - ${t('nav.learn')}`;
  const description = tutorial.description;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
    alternates: {
      languages: {
        'en': `/learn/${category}/${id}`,
        'zh': `/zh/learn/${category}/${id}`,
      },
    },
  };
}

// 生成静态参数
export async function generateStaticParams() {
  // 这里可以根据实际的教程数据生成静态参数
  // 为了简化，我们返回一些基本的参数组合
  const locales: Locale[] = ['zh', 'en'];
  const categories = ['basic', 'noise', 'lighting'];
  const tutorials = [
    'hello-world', 'colors', 'time-animation', 'mouse-interaction',
    'basic-shapes', 'transformations', 'gradients', 'patterns',
    'simple-noise', 'fractal-noise', 'noise-animation', 'noise-distortion'
  ];
  
  const params = [];
  
  for (const locale of locales) {
    for (const category of categories) {
      for (const tutorial of tutorials) {
        params.push({
          locale,
          category,
          id: tutorial,
        });
      }
    }
  }
  
  return params;
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { locale: localeParam, category, id } = await params;
  const locale = getValidLocale(localeParam);
  
  // 获取教程数据
  const tutorial = await getTutorial(category, id, locale);
  
  if (!tutorial) {
    notFound();
  }
  
  // 获取教程内容和同分类的所有教程
  const [readme, shaders, categoryTutorials] = await Promise.all([
    getTutorialReadme(category, id, locale),
    getTutorialShaders(category, id),
    getTutorialsByCategory(category, locale),
  ]);
  
  return (
    <TutorialPageClient
      tutorial={tutorial}
      readme={readme}
      shaders={shaders}
      locale={locale}
      category={category}
      tutorialId={id}
      categoryTutorials={categoryTutorials}
    />
  );
}