import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTutorial, getTutorialReadme, getTutorialShaders, getTutorialsByCategory, getTutorialConfig } from '../../../../lib/tutorials-server';
import { getTranslationFunction } from '../../../../lib/translations';
import MainLayout from '../../../../components/layout/main-layout';
import TutorialPageClient from '../../../[locale]/learn/[category]/[id]/tutorial-client';

interface TutorialPageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

// 生成元数据
export async function generateMetadata({ params }: TutorialPageProps): Promise<Metadata> {
  const { category, id } = await params;
  const locale = 'en'; // 默认语言
  const t = getTranslationFunction(locale);
  
  const tutorial = await getTutorial(category, id, locale);
  
  if (!tutorial) {
    return {
      title: t('common.not_found'),
      description: t('common.not_found'),
    };
  }
  
  // 获取教程配置以获取更多SEO信息
  const tutorialConfig = await getTutorialConfig(category, id);
  
  const title = `${tutorial.title} - ${t('nav.learn')} | GLSL Shader Tutorial`;
  const description = tutorial.description;
  
  // 生成关键词
  const keywords = [
    'GLSL',
    'shader',
    'tutorial',
    tutorial.title,
    category,
    tutorial.difficulty,
    ...(tutorialConfig?.tags || [])
  ].join(', ');
  
  // 生成更详细的描述
  const detailedDescription = tutorialConfig?.estimatedTime 
    ? `${description} Estimated learning time: ${tutorialConfig.estimatedTime} minutes. Difficulty level: ${tutorial.difficulty}.`
    : description;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  
  return {
    title,
    description: detailedDescription,
    keywords,
    openGraph: {
      title,
      description: detailedDescription,
      type: 'article',
      url: `${baseUrl}/learn/${category}/${id}`,
      images: [{
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: title
      }],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: detailedDescription,
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: `/learn/${category}/${id}`,
      languages: {
        'en': `/learn/${category}/${id}`,
        'zh': `/zh/learn/${category}/${id}`,
      },
    },
  };
}

// 服务端组件
export default async function TutorialPage({ params }: TutorialPageProps) {
  const { category, id } = await params;
  const locale = 'en'; // 默认语言
  
  // 服务端获取教程数据
  const tutorial = await getTutorial(category, id, locale);
  
  if (!tutorial) {
    notFound();
  }
  
  // 并行获取所有需要的数据
  const [readme, shaders, categoryTutorials] = await Promise.all([
    getTutorialReadme(category, id, locale),
    getTutorialShaders(category, id),
    getTutorialsByCategory(category, locale)
  ]);
  
  return (
    <MainLayout>
      <TutorialPageClient
        tutorial={tutorial}
        readme={readme}
        shaders={shaders}
        locale={locale}
        category={category}
        tutorialId={id}
        categoryTutorials={categoryTutorials}
      />
    </MainLayout>
  );
}

// 生成静态参数（可选，用于静态生成）
export async function generateStaticParams() {
  // 这里可以返回所有可能的 category/id 组合
  // 暂时返回空数组，使用动态生成
  return [];
}
