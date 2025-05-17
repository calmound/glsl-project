'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/main-layout';
import Card from '../../components/ui/card';
import { Button } from '@/components/ui/button';

import {
  shaderExamples,
  ShaderExample,
  ShaderCategory,
  ShaderDifficulty,
  categoryDisplayNames,
  difficultyDisplayNames,
  getAllCategories,
} from '../../lib/shader-data';
import ShaderCanvas from '../../components/common/shader-canvas';
import ShaderEditor from '../../components/common/shader-editor';

export default function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExample, setSelectedExample] = useState<ShaderExample | null>(null);
  const [categories, setCategories] = useState<string[]>(['all']);

  // 初始化分类列表
  useEffect(() => {
    const allCategories = getAllCategories();
    setCategories(['all', ...allCategories]);
  }, []);

  // 过滤示例
  const filteredExamples = shaderExamples.filter(example => {
    const categoryMatch =
      selectedCategory === 'all' || example.category === (selectedCategory as ShaderCategory);
    const difficultyMatch =
      selectedDifficulty === 'all' ||
      example.difficulty === (selectedDifficulty as ShaderDifficulty);
    const searchMatch =
      !searchQuery ||
      example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatch && difficultyMatch && searchMatch;
  });

  // 处理示例点击
  const handleExampleClick = (example: ShaderExample) => {
    setSelectedExample(example);
  };

  // 关闭示例详情
  const closeExample = () => {
    setSelectedExample(null);
  };

  return (
    <MainLayout>
      <section className="py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2">着色器示例库</h1>
          <p className="text-gray-600 mb-8">
            探索各种 GLSL 着色器示例，了解不同的视觉效果和技术实现方式。
          </p>

          {/* 过滤器 */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">筛选条件</h2>

            {/* 搜索框 */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索着色器案例..."
                  className="w-full border border-gray-300 rounded-md py-2 px-3 pl-10 focus:ring-primary focus:border-primary"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">类别</label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-primary focus:border-primary"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                >
                  <option value="all">全部类别</option>
                  {categories
                    .filter(cat => cat !== 'all')
                    .map(category => (
                      <option key={category} value={category}>
                        {categoryDisplayNames[category as ShaderCategory]}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-primary focus:border-primary">
                  <option value="newest">最新添加</option>
                  <option value="popular">最受欢迎</option>
                  <option value="complexity">复杂度</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                // handleClick={() => {
                //   setSelectedCategory('all');
                //   setSelectedDifficulty('all');
                //   setSearchQuery('');
                // }}
              >
                重置筛选
              </Button>
              <Button variant="primary" size="sm">
                应用筛选
              </Button>
            </div>
          </div>

          {/* 示例列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExamples.map(example => (
              <Card key={example.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-900 -mx-6 -mt-6 mb-4 flex items-center justify-center">
                  <ShaderCanvas
                    fragmentShader={example.fragmentShader}
                    vertexShader={example.vertexShader}
                    uniforms={example.uniforms}
                    width="100%"
                    height="100%"
                    className="w-full h-full"
                    timeScale={0.5}
                  />
                </div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">{example.title}</h3>
                  <div className="flex space-x-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {categoryDisplayNames[example.category]}
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {difficultyDisplayNames[example.difficulty]}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{example.description}</p>
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    handleClick={() => handleExampleClick(example)}
                  >
                    查看详情
                  </Button>
                  <button className="text-gray-500 hover:text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {filteredExamples.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">没有找到匹配的着色器示例</p>
            </div>
          )}

          {/* 选中着色器详情 */}
          {selectedExample && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedExample.title}</h2>
                      <div className="flex space-x-2 mt-1">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {categoryDisplayNames[selectedExample.category]}
                        </span>
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {difficultyDisplayNames[selectedExample.difficulty]}
                        </span>
                      </div>
                    </div>
                    <button
                      handleClick={closeExample}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-gray-900 rounded-lg overflow-hidden aspect-square">
                        <ShaderCanvas
                          fragmentShader={selectedExample.fragmentShader}
                          vertexShader={selectedExample.vertexShader}
                          uniforms={selectedExample.uniforms}
                          className="w-full h-full"
                        />
                      </div>

                      <div className="mt-4 prose">
                        <p>{selectedExample.description}</p>
                        <h3>技术标签</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedExample.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <ShaderEditor
                        initialFragmentShader={selectedExample.fragmentShader}
                        initialVertexShader={selectedExample.vertexShader}
                        width="100%"
                        height={400}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button variant="outline" handleClick={closeExample}>
                      关闭
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
