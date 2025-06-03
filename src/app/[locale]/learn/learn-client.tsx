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
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [tutorials] = useState<Tutorial[]>(initialTutorials);

  // 提取所有唯一的分类并按学习难度排序
  const categoryOrder = ['basic', 'math','lighting', 'patterns', 'animation', 'noise', ];
  const uniqueCategories = Array.from(new Set(tutorials.map(tutorial => tutorial.category)));
  const sortedCategories = categoryOrder.filter(cat => uniqueCategories.includes(cat));
  const categories = ['all', ...sortedCategories];

  // 过滤教程 - 只有选择了具体分类才显示教程
  const filteredTutorials = selectedCategory && selectedCategory !== '' 
    ? tutorials.filter(tutorial => tutorial.category === selectedCategory)
    : [];

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
      basic: t('learn.category.basic') || '基础入门',
      math: t('learn.category.math') || '数学公式',
      patterns: t('learn.category.patterns') || '图案纹理',
      animation: t('learn.category.animation') || '动画交互',
      noise: t('learn.category.noise') || '噪声函数',
      lighting: t('learn.category.lighting') || '光照渲染',
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

        {/* 返回按钮 - 仅在选择了分类时显示 */}
        {selectedCategory && (
          <div className="mb-6">
            <button
              onClick={() => setSelectedCategory('')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('learn.back_to_categories')}
            </button>
          </div>
        )}

        {/* 内容区域 */}
        {selectedCategory ? (
          /* 教程列表 */
          filteredTutorials.length > 0 ? (
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
          )
        ) : (
          /* 学习路径推荐 */
          <div className="space-y-8">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('learn.path.title')}</h2>
              <p className="text-gray-600 text-lg">{t('learn.path.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCategories.map(category => {
                const count = tutorials.filter(t => t.category === category).length;
                const categoryInfo = {
                  basic: { icon: '📚', desc: t('learn.path.basic.desc') },
                  math: { icon: '🔢', desc: t('learn.path.math.desc') },
                  patterns: { icon: '🎨', desc: t('learn.path.patterns.desc') },
                  animation: { icon: '⚡', desc: t('learn.path.animation.desc') },
                  noise: { icon: '🌊', desc: t('learn.path.noise.desc') },
                  lighting: { icon: '💡', desc: t('learn.path.lighting.desc') }
                };
                const info = categoryInfo[category as keyof typeof categoryInfo] || { icon: '📖', desc: t('learn.path.basic.desc') };
                
                return (
                  <Card 
                    key={category}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="text-center p-6">
                      <div className="text-4xl mb-4">{info.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {getCategoryDisplayName(category)}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{info.desc}</p>
                      <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {count} {t('learn.path.tutorials_count')}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}