import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireLocaleFromParams, resolveLocaleFromParams } from '../../../../../lib/locale-page';
import { buildTutorialPageMetadata, getTutorialPageData } from '../../../../../lib/tutorial-page-server';
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
  const { category, id } = await params;
  const locale = await resolveLocaleFromParams(params);
  return buildTutorialPageMetadata({ locale, category, id });
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { category, id } = await params;
  const locale = await requireLocaleFromParams(params);
  const pageData = await getTutorialPageData({ locale, category, id });
  if (!pageData) {
    notFound();
  }
  
  return (
    <MainLayout>
      <TutorialPageClient
        tutorial={pageData.tutorial}
        readme={pageData.readme}
        shaders={pageData.shaders}
        locale={locale}
        category={category}
        tutorialId={id}
        categoryTutorials={pageData.categoryTutorials}
        initialCode={pageData.initialCode}
        isFree={pageData.isFree}
      />
    </MainLayout>
  );
}
