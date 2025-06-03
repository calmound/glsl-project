'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../../components/layout/main-layout';
import Card from '../../components/ui/card';
import { useLanguage } from '../../contexts/LanguageContext';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export default function LearnPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
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
    <MainLayout>
      <section className="py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t('learn.title')}</h1>
          <p className="text-gray-600 mb-8">
            {t('learn.description')}
          </p>

          {/* 分类标签页 */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex flex-wrap gap-2 mb-6">
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
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getCategoryDisplayName(category)}
                    <span className="ml-1 text-xs opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
            
            {/* 难度筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('learn.filter.difficulty') || '难度筛选'}</label>
              <div className="flex flex-wrap gap-2">
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
                      {getDifficultyDisplayName(difficulty)}
                      <span className="ml-1 text-xs opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 教程列表 */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">{t('loading')}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map(tutorial => (
                <Card 
                  key={tutorial.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => router.push(`/learn/${tutorial.category}/${tutorial.id}`)}
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
          )}

          {!loading && filteredTutorials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">{t('learn.no_tutorials') || '没有找到匹配的教程'}</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
