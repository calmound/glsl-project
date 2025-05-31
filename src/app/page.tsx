import React from 'react';
import MainLayout from '../components/layout/main-layout';
import Card from '../components/ui/card';

import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <MainLayout>
      {/* 英雄区域 */}
      <section className="bg-gradient-to-br from-primary to-blue-800 py-24 px-4 text-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              掌握 GLSL 着色器编程
            </h1>
            <p className="text-lg text-blue-100 mb-4">
              从零开始学习 GLSL 着色器语言，释放 GPU 的强大图形渲染能力，创建令人惊叹的视觉效果。
            </p>
            <div className="text-base text-blue-200 space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>交互式在线编辑器，实时预览效果</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>从基础到高级的完整学习路径</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>丰富的示例和实战项目</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="secondary" size="lg" href="/learn">
                开始学习
              </Button>

            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-80 h-80 bg-white/20 rounded-full flex items-center justify-center relative overflow-hidden">
              {/* 这里可以添加一个简单的着色器Canvas组件 */}
              <div className="text-4xl font-bold">GLSL</div>
            </div>
          </div>
        </div>
      </section>

      {/* 特性列表 */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">我们能帮助您什么？</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            无论您是图形编程新手还是想要提升技能的开发者，我们的平台都能为您提供全面的学习支持
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="transition-transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">零基础入门</h3>
                <p className="text-gray-600">
                  从最基础的概念开始，循序渐进地学习 GLSL 语法、WebGL 基础和图形编程原理，让初学者也能轻松上手。
                </p>
              </div>
            </Card>

            <Card className="transition-transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">实时编程体验</h3>
                <p className="text-gray-600">
                  内置在线代码编辑器，支持实时预览和调试，让您边学边练，立即看到代码效果，提升学习效率。
                </p>
              </div>
            </Card>

            <Card className="transition-transform hover:-translate-y-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">项目实战导向</h3>
                <p className="text-gray-600">
                  提供丰富的实际项目案例和练习，从简单的渐变效果到复杂的粒子系统，帮您构建完整的作品集。
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 应用场景 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">GLSL 的应用场景</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            掌握 GLSL 后，您将能够在多个领域创造令人惊叹的视觉效果
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8m-8 0V1" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">游戏开发</h3>
              <p className="text-sm text-gray-600">创建游戏中的特效、材质、光照和后处理效果</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Web 开发</h3>
              <p className="text-sm text-gray-600">为网站添加动态背景、交互动画和视觉特效</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">数字艺术</h3>
              <p className="text-sm text-gray-600">创作生成艺术、视觉装置和创意编程作品</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">数据可视化</h3>
              <p className="text-sm text-gray-600">构建高性能的图表、图形和交互式数据展示</p>
            </div>
          </div>
        </div>
      </section>

      {/* 入门指南 */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">完整的学习体系</h2>
              <p className="text-gray-600 mb-6">
                我们为您精心设计了完整的学习路径，从零基础到专业水平，每一步都有详细的指导和实践练习。无论您的目标是什么，我们都能帮您实现。
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  基础教程：从 UV 坐标、颜色混合到基本图形绘制
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  进阶技巧：噪声函数、光照模型和动画效果
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  实战项目：完整的视觉效果和交互体验开发
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  性能优化：让您的着色器在各种设备上流畅运行
                </li>
              </ul>
              <Button  variant="secondary"  href="/learn">开始学习</Button>
            </div>
            <div className="md:w-1/2 flex justify-center items-center">
              <div className="max-w-sm p-6 bg-gray-100 rounded-lg">
                <pre className="text-sm font-mono text-gray-800 whitespace-pre">
                  {`// 简单的片段着色器示例
void main() {
  // 根据位置生成颜色
  vec2 st = gl_FragCoord.xy/u_resolution;
  vec3 color = vec3(st.x, st.y, 0.5);
  
  // 输出最终颜色
  gl_FragColor = vec4(color, 1.0);
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 行动号召 */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始您的 GLSL 学习之旅了吗？</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            加入我们的学习平台，从今天开始掌握现代图形编程技能。无论您是想要提升职业技能，还是纯粹出于兴趣，我们都将陪伴您的每一步成长。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" href="/learn">
              立即开始学习
            </Button>
          
          </div>
          <div className="mt-8 text-sm text-blue-200">
            <p> 🚀 即学即用 • 💡 持续更新</p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
