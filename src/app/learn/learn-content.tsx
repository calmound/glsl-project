'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../../components/layout/main-layout';
import Card from '../../components/ui/card';
import { getTranslationFunction } from '../../lib/translations';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface LearnPageContentProps {
  locale: string;
}

export default function LearnPageContent({ locale }: LearnPageContentProps) {
  const router = useRouter();
  const t = getTranslationFunction(locale as 'en' | 'zh');
  const language = locale;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  // 动态加载教程数据
  useEffect(() => {
    const loadTutorials = async () => {
      try {
        setLoading(true);
        // 从API动态获取教程数据，传递语言参数
        const response = await fetch(`/api/tutorials?lang=${language}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tutorials');
        }
        const data = await response.json();
        setTutorials(data.tutorials || []);
      } catch (error) {
        console.error('Failed to load tutorials:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTutorials();
  }, [language]);

  // 提取所有唯一的分类
  const categories = ['all', ...Array.from(new Set(tutorials.map(tutorial => tutorial.category)))];

  // 过滤教程
  const filteredTutorials = tutorials.filter(tutorial => {
    const categoryMatch = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const handleTutorialClick = (tutorial: Tutorial) => {
    const basePath = locale === 'en' ? '' : `/${locale}`;
    router.push(`${basePath}/learn/${tutorial.category}/${tutorial.id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('learn.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            {t('learn.description')}
          </p>
        </div>

        {/* 过滤器 */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              {t('learn.category')}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? t('learn.allCategories') : t(`learn.categories.${category}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              {t('learn.difficulty')}
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('learn.allDifficulties')}</option>
              <option value="beginner">{t('learn.difficulties.beginner')}</option>
              <option value="intermediate">{t('learn.difficulties.intermediate')}</option>
              <option value="advanced">{t('learn.difficulties.advanced')}</option>
            </select>
          </div>
        </div>

        {/* 教程列表 */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map(tutorial => (
              <Card
                key={tutorial.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleTutorialClick(tutorial)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {tutorial.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                      {t(`learn.difficulties.${tutorial.difficulty}`)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {tutorial.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-600 font-medium">
                      {t(`learn.categories.${tutorial.category}`)}
                    </span>
                    <span className="text-blue-600 hover:text-blue-800">
                      {t('learn.startLearning')} →
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredTutorials.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {t('learn.noTutorials')}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}