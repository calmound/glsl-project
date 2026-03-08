'use client';

import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/card';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { type Locale } from '../../../lib/i18n';
import { createBrowserSupabase } from '../../../lib/supabase';
import { LearningPath } from '../../../components/learn/learning-path';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  isFree?: boolean;
}

interface UserProgress {
  form_id: string;
  is_passed: boolean;
  has_submitted: boolean;
  attempts: number;
  last_submitted_at: string | null;
}

interface LearnPageClientProps {
  initialTutorials: Tutorial[];
  locale: Locale;
}

export default function LearnPageClient({ initialTutorials, locale }: LearnPageClientProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [tutorials] = useState<Tutorial[]>(initialTutorials);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});

  // 获取用户进度数据
  useEffect(() => {
    const fetchUserProgress = async () => {
      // 检查用户是否已登录
      if (!user) {
        console.log('用户未登录，跳过进度获取');
        return;
      }

      console.log('🔍 [LearnPage] 获取用户进度数据...');

      const supabase = createBrowserSupabase();

      // 查询用户的所有教程进度
      const { data, error } = await supabase
        .from('user_form_status')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('获取用户进度失败:', error);
        return;
      }

      if (data) {
        // 将数组转换为以 form_id 为键的对象
        const progressMap: Record<string, UserProgress> = {};
        data.forEach((item) => {
          progressMap[item.form_id] = item;
          console.log('📝 [LearnPage] 加载进度:', {
            formId: item.form_id,
            isPassed: item.is_passed,
            hasSubmitted: item.has_submitted,
            attempts: item.attempts
          });
        });
        setUserProgress(progressMap);
        console.log('✅ [LearnPage] 用户进度已加载:', Object.keys(progressMap).length, '个教程');
        console.log('📊 [LearnPage] 完整进度数据:', progressMap);
      }
    };

    fetchUserProgress();
  }, [user]);

  // 提取所有唯一的分类并按学习难度排序
  const categoryOrder = ['basic', 'math','lighting', 'patterns', 'animation', 'noise', ];
  const uniqueCategories = Array.from(new Set(tutorials.map(tutorial => tutorial.category)));
  const sortedCategories = categoryOrder.filter(cat => uniqueCategories.includes(cat));

  // 过滤教程 - 只有选择了具体分类才显示教程
  const filteredTutorials = selectedCategory && selectedCategory !== ''
    ? tutorials.filter(tutorial => tutorial.category === selectedCategory)
    : [];

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
            <LearningPath
              tutorials={filteredTutorials}
              userProgress={userProgress}
              locale={locale}
            />
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
                const categoryTutorials = tutorials.filter(t => t.category === category);
                const count = categoryTutorials.length;

                // 计算该分类的完成进度
                const completedCount = categoryTutorials.filter(t => userProgress[t.id]?.is_passed).length;
                const progressPercentage = count > 0 ? Math.round((completedCount / count) * 100) : 0;

                const categoryInfo = {
                  basic: { icon: '📚', desc: t('learn.path.basic.desc') },
                  math: { icon: '🔢', desc: t('learn.path.math.desc') },
                  patterns: { icon: '🎨', desc: t('learn.path.patterns.desc') },
                  animation: { icon: '⚡', desc: t('learn.path.animation.desc') },
                  noise: { icon: '🌊', desc: t('learn.path.noise.desc') },
                  lighting: { icon: '💡', desc: t('learn.path.lighting.desc') }
                };
                const info = categoryInfo[category as keyof typeof categoryInfo] || { icon: '📖', desc: t('learn.path.basic.desc') };
                const hasPremiumTutorials = categoryTutorials.some(tutorial => !(tutorial.isFree ?? false));

                return (
                  <Card
                    key={category}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 relative"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {/* 需要登录标记 */}
                    {hasPremiumTutorials && !user && (
                      <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span>{t('learn.login_required', '需登录')}</span>
                      </div>
                    )}
                    <div className="text-center p-6">
                      <div className="text-4xl mb-4">{info.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {getCategoryDisplayName(category)}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{info.desc}</p>

                      {/* 进度条 */}
                      {completedCount > 0 && (
                        <div className="mb-3">
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            {completedCount}/{count} {t('learn.path.completed', '已完成')} ({progressPercentage}%)
                          </p>
                        </div>
                      )}

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
