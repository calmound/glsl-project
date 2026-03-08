import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildTutorialPageMetadata, getTutorialPageData } from '@/lib/tutorial-page-server';
import TutorialPageClient from '@/app/[locale]/learn/[category]/[id]/tutorial-client';
import MainLayout from '@/components/layout/main-layout';

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
  return buildTutorialPageMetadata({ locale: 'en', category, id });
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const { category, id } = await params;
  const pageData = await getTutorialPageData({ locale: 'en', category, id });
  if (!pageData) {
    notFound();
  }

  return (
    <MainLayout>
      <TutorialPageClient
        tutorial={pageData.tutorial}
        readme={pageData.readme}
        shaders={pageData.shaders}
        locale="en"
        category={category}
        tutorialId={id}
        categoryTutorials={pageData.categoryTutorials}
        initialCode={pageData.initialCode}
        isFree={pageData.isFree}
      />
    </MainLayout>
  );
}
