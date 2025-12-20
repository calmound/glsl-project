import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTutorial, getTutorialReadme, getTutorialShadersLocalized, getTutorialsByCategory, getTutorialConfig } from '../../../../../lib/tutorials-server';
import { getValidLocale, type Locale } from '../../../../../lib/i18n';
import { getTranslationFunction } from '../../../../../lib/translations';
import { createServerSupabase } from '../../../../../lib/supabase-server';
import TutorialPageClient from './tutorial-client';
import MainLayout from '../../../../../components/layout/main-layout';

// 强制此页面按请求动态渲染，确保可读取用户 Cookie 并从数据库回显代码
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  
  // 获取教程配置以获取更多SEO信息
  const tutorialConfig = await getTutorialConfig(category, id);
  
  const title = `${tutorial.title} - ${t('nav.learn')} | GLSL ${locale === 'zh' ? '着色器教程' : 'Shader Tutorial'}`;
  const description = tutorial.description;
  
  // 生成关键词
  const keywords = [
    'GLSL',
    locale === 'zh' ? '着色器' : 'shader',
    locale === 'zh' ? '教程' : 'tutorial',
    tutorial.title,
    category,
    tutorial.difficulty,
    ...(tutorialConfig?.tags || [])
  ].join(', ');
  
  // 生成更详细的描述
  const detailedDescription = tutorialConfig?.estimatedTime 
    ? `${description} ${locale === 'zh' ? '预计学习时间' : 'Estimated learning time'}: ${tutorialConfig.estimatedTime} ${locale === 'zh' ? '分钟' : 'minutes'}. ${locale === 'zh' ? '难度级别' : 'Difficulty level'}: ${tutorial.difficulty}.`
    : `${description} ${locale === 'zh' ? '难度级别' : 'Difficulty level'}: ${tutorial.difficulty}.`;
  
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
    alternates: {
      canonical: locale === 'en' ? `/learn/${category}/${id}` : `/zh/learn/${category}/${id}`,
      languages: {
        'en': `/learn/${category}/${id}`,
        'zh': `/zh/learn/${category}/${id}`,
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
    other: {
      'article:author': 'GLSL Tutorial',
      'article:section': locale === 'zh' ? '着色器教程' : 'Shader Tutorial',
      'article:tag': keywords,
    },
  };
}

// 生成静态参数
export async function generateStaticParams() {
  // 这里可以根据实际的教程数据生成静态参数
  // 为了简化，我们返回一些基本的参数组合
  const locales: Locale[] = ['zh'];
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

  // 获取教程配置（用于权限检查）
  const tutorialConfig = await getTutorialConfig(category, id);
  const isFree = tutorialConfig?.isFree ?? false; // 默认为付费

  // 获取教程内容和同分类的所有教程
  const [readme, shaders, categoryTutorials] = await Promise.all([
    getTutorialReadme(category, id, locale),
    getTutorialShadersLocalized(category, id, locale),
    getTutorialsByCategory(category, locale),
  ]);

  // 预取用户已保存的代码（如果已登录）
  console.log('🔍 [服务端] 开始预取用户代码...');
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  let initialCode: string | null = null;
  
  console.log('🔍 [服务端] 用户登录状态:', user ? `已登录 (${user.id})` : '未登录');
  console.log('🔍 [服务端] 教程ID:', tutorial.id);
  
  if (user) {
    try {
      console.log('🔍 [服务端] 正在查询数据库...');
      const { data, error } = await supabase
        .from('user_form_code')
        .select('code_content')
        .eq('form_id', tutorial.id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      console.log('🔍 [服务端] 数据库查询结果:', {
        hasData: !!data,
        hasError: !!error,
        codeLength: data?.code_content?.length || 0,
        error: error?.message
      });
      console.log('%c [ data ]-187', 'font-size:13px; background:pink; color:#bf2c9f;', data)
      if (data && !error) {
        
        initialCode = data.code_content;
        console.log('✅ [服务端] 成功加载用户代码:', {
          formId: tutorial.id,
          codeLength: data.code_content.length,
          codePreview: data.code_content.substring(0, 50) + '...'
        });
      } else if (error) {
        console.error('❌ [服务端] 数据库查询错误:', error);
      } else {
        console.log('ℹ️ [服务端] 用户尚未保存此教程的代码:', tutorial.id);
      }
    } catch (error) {
      console.error('❌ [服务端] 读取用户代码异常:', error);
    }
  }
  
  console.log('🔍 [服务端] 最终 initialCode:', initialCode ? `已设置 (${initialCode.length} 字符)` : '使用默认代码');
  console.log('🔍 [服务端] 默认代码来源:', shaders.exercise ? 'exercise' : 'fragment');
  
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
        initialCode={initialCode ?? (shaders.exercise || shaders.fragment)}
        isFree={isFree}
      />
    </MainLayout>
  );
}
