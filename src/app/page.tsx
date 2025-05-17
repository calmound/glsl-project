import React from 'react';
import MainLayout from '../components/layout/main-layout';
import Card from '../components/ui/card';
import ShaderShowcaseWrapper from '../components/examples/shader-showcase-wrapper';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <MainLayout>
      {/* 英雄区域 */}
      <section className="bg-gradient-to-br from-primary to-blue-800 -mt-8 py-24 px-4 text-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              探索 WebGL 与 GLSL 的魅力世界
            </h1>
            <p className="text-lg text-blue-100">
              通过 GLSL 着色器语言释放 GPU 的强大图形渲染能力，创建令人惊叹的视觉效果。
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="secondary" size="lg" href="/learn">
                开始学习
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
                // handleClick={() => (window.location.href = '/examples')}
                href="/examples"
              >
                查看示例
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
          <h2 className="text-3xl font-bold text-center mb-12">为什么选择 GLSL？</h2>

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
                <h3 className="text-xl font-semibold mb-3">高性能</h3>
                <p className="text-gray-600">
                  直接在 GPU 上运行，实现并行计算，提供卓越的渲染性能。
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
                <h3 className="text-xl font-semibold mb-3">高度可定制</h3>
                <p className="text-gray-600">
                  通过编写自定义着色器代码，实现各种复杂的视觉效果和算法。
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
                <h3 className="text-xl font-semibold mb-3">跨平台兼容</h3>
                <p className="text-gray-600">支持所有现代浏览器和设备，无需额外插件，随处可用。</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 着色器示例 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">着色器示例</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            浏览我们精选的 GLSL 着色器示例，了解着色器能够创造的各种视觉效果。
          </p>

          {/* 使用动态加载的着色器展示组件 */}
          <ShaderShowcaseWrapper />

          <div className="text-center mt-12">
            <Button variant="primary" size="lg">
              查看更多示例
            </Button>
          </div>
        </div>
      </section>

      {/* 入门指南 */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">快速入门指南</h2>
              <p className="text-gray-600 mb-6">
                不确定如何开始使用
                GLSL？我们的入门指南将帮助您快速上手，从基础概念到高级技巧，循序渐进地学习着色器编程。
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
                  了解 WebGL 和 GLSL 的基本概念
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
                  搭建开发环境和工具链
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
                  编写您的第一个顶点和片段着色器
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
                  掌握着色器语言的核心特性
                </li>
              </ul>
              <Button variant="primary">开始学习</Button>
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
    </MainLayout>
  );
}
