'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../../components/ui/card';
import { useLanguage } from '../../../contexts/LanguageContext';
import { type Locale } from '../../../lib/i18n';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface LearnPageClientProps {
  initialTutorials: Tutorial[];
  locale: Locale;
}

export default function LearnPageClient({ initialTutorials, locale }: LearnPageClientProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [tutorials] = useState<Tutorial[]>(initialTutorials);

  // 提取所有唯一的分类
  // const categories = ['all', ...Array.from(new Set(tutorials.map(tutorial => tutorial.category)))];

  // 过滤教程
  const filteredTutorials = tutorials.filter(
    tutorial =>
      (selectedCategory === 'all' || tutorial.category === selectedCategory) &&
      (selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty)
  );

  // 难度级别显示
  const getDifficultyDisplayName = (difficulty: string) => {
    const difficultyMap: { [key: string]: string } = {
      beginner: t('learn.difficulty.beginner') || '初级',
      intermediate: t('learn.difficulty.intermediate') || '中级', 
      advanced: t('learn.difficulty.advanced') || '高级',
      all: t('learn.difficulty.all') || '全部',
    };
    return difficultyMap[difficulty] || difficulty;
  };

  // 分类显示
  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      basic: t('learn.category.basic') || '基础',
      noise: t('learn.category.noise') || '噪声',
      lighting: t('learn.category.lighting') || '光照',
      all: t('learn.category.all') || '全部',
    };
    return categoryMap[category] || category;
  };

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-2">{t('learn.title')}</h1>
        <p className="text-gray-600 mb-8">
          {t('learn.description')}
        </p>

        {/* 分类标签页 */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          {/* <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => {
              const count = category === 'all' 
                ? tutorials.length 
                : tutorials.filter(t => t.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getCategoryDisplayName(category)} ({count})
                </button>
              );
            })}
          </div> */}

          {/* 难度筛选 */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2 py-2">
              {t('learn.filter.difficulty')}:
            </span>
            {['all', 'beginner', 'intermediate', 'advanced'].map(difficulty => {
              // Calculate count based on tutorials filtered by category, not by selected difficulty
              const tutorialsForCount = selectedCategory === 'all' 
                ? tutorials 
                : tutorials.filter(t => t.category === selectedCategory);
              const count = difficulty === 'all'
                ? tutorialsForCount.length
                : tutorialsForCount.filter(t => t.difficulty === difficulty).length;
              return (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                    selectedDifficulty === difficulty
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getDifficultyDisplayName(difficulty)} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* 教程列表 */}
        {filteredTutorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map(tutorial => (
              <Card 
                key={tutorial.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => router.push(`/${locale}/learn/${tutorial.category}/${tutorial.id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{tutorial.title}</h3>
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                      tutorial.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-800'
                        : tutorial.difficulty === 'intermediate'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {getDifficultyDisplayName(tutorial.difficulty)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{tutorial.description}</p>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">
                    {getCategoryDisplayName(tutorial.category)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('learn.no_tutorials')}</p>
          </div>
        )}
      </div>
    </section>
  );
}