'use client';

import React, { useState } from 'react';
import MainLayout from '../../components/layout/main-layout';
import Card from '../../components/ui/card';
import { Button } from '@/components/ui/button';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // 示例教程数据
  const tutorials: Tutorial[] = [
    {
      id: 'basic-gradients',
      title: '基础渐变效果',
      description: '学习如何使用GLSL创建线性和径向渐变效果',
      difficulty: 'beginner',
      category: 'basic',
    },
    {
      id: 'uv-coordinates',
      title: 'UV坐标基础',
      description: '理解着色器中的UV坐标系统及其应用',
      difficulty: 'beginner',
      category: 'basic',
    },
    {
      id: 'noise-functions',
      title: '噪声函数',
      description: '学习如何在着色器中实现不同类型的噪声函数',
      difficulty: 'intermediate',
      category: 'noise',
    },
    {
      id: 'fractal-brownian-motion',
      title: '分形布朗运动',
      description: '使用分形布朗运动技术创建复杂的纹理和地形',
      difficulty: 'intermediate',
      category: 'noise',
    },
    {
      id: 'phong-lighting',
      title: 'Phong光照模型',
      description: '实现基础的Phong光照模型计算反射光',
      difficulty: 'intermediate',
      category: 'lighting',
    },
    {
      id: 'toon-shading',
      title: '卡通渲染',
      description: '创建卡通风格的渲染效果',
      difficulty: 'advanced',
      category: 'lighting',
    },
  ];

  // 提取所有唯一的分类
  const categories = ['all', ...Array.from(new Set(tutorials.map(tutorial => tutorial.category)))];

  // 过滤教程
  const filteredTutorials = tutorials.filter(
    tutorial =>
      (selectedCategory === 'all' || tutorial.category === selectedCategory) &&
      (selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty)
  );

  // 难度级别转中文显示
  const difficultyMap = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
    all: '全部',
  };

  // 分类转中文显示
  const categoryMap = {
    basic: '基础',
    noise: '噪声',
    lighting: '光照',
    all: '全部',
  };

  return (
    <MainLayout>
      <section className="py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">GLSL 学习中心</h1>
          <p className="text-gray-600 mb-8">
            通过交互式练习和教程，系统学习 GLSL
            着色器编程。从基础概念到高级技术，循序渐进掌握图形渲染的精髓。
          </p>

          {/* 过滤器 */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">筛选教程</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-primary focus:border-primary"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {categoryMap[category as keyof typeof categoryMap] || category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">难度</label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-primary focus:border-primary"
                  value={selectedDifficulty}
                  onChange={e => setSelectedDifficulty(e.target.value)}
                >
                  <option value="all">全部难度</option>
                  <option value="beginner">初级</option>
                  <option value="intermediate">中级</option>
                  <option value="advanced">高级</option>
                </select>
              </div>
            </div>
          </div>

          {/* 教程列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map(tutorial => (
              <Card 
                key={tutorial.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => window.location.href = `/learn/${tutorial.category}/${tutorial.id}`}
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
                    {difficultyMap[tutorial.difficulty]}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{tutorial.description}</p>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">
                    {categoryMap[tutorial.category as keyof typeof categoryMap] || tutorial.category}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {filteredTutorials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">没有找到匹配的教程</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
