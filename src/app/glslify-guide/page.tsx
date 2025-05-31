'use client';

import React from 'react';
import MainLayout from '../../components/layout/main-layout';
import Card from '@/components/ui/card';
import CodeEditor from '../../components/ui/code-editor';

export default function GlslifyGuidePage() {
  const basicExample = `precision mediump float;

#pragma glslify: noise = require('glsl-noise/simplex/3d')
#pragma glslify: hsl2rgb = require('glsl-hsl2rgb')

uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  
  // 使用噪声模块
  float n = noise(vec3(uv * 5.0, u_time * 0.1));
  
  // 使用颜色转换模块
  vec3 color = hsl2rgb(n * 0.3 + 0.5, 0.7, 0.5);
  
  gl_FragColor = vec4(color, 1.0);
}`;

  const customModuleExample = `// 自定义模块示例 (math.glsl)
#pragma glslify: export(rotate2d)

mat2 rotate2d(float angle) {
  return mat2(cos(angle), -sin(angle),
              sin(angle), cos(angle));
}

// 在主着色器中使用
#pragma glslify: rotate2d = require('./math.glsl')

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  
  // 使用自定义旋转函数
  uv = rotate2d(u_time) * uv;
  
  float d = length(uv) - 0.5;
  vec3 color = vec3(smoothstep(0.0, 0.02, -d));
  
  gl_FragColor = vec4(color, 1.0);
}`;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Glslify 模块系统指南</h1>
          
          <div className="space-y-8">
            {/* 介绍 */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">什么是 Glslify？</h2>
              <p className="text-gray-600 mb-4">
                Glslify 是一个为 GLSL 着色器设计的模块系统，它允许你将着色器代码组织成可重用的模块，
                就像在 JavaScript 中使用 npm 包一样。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>模块化开发：将复杂的着色器拆分成小的、可管理的模块</li>
                <li>代码复用：在多个项目中重复使用相同的功能</li>
                <li>社区生态：使用社区贡献的 GLSL 模块</li>
                <li>依赖管理：自动处理模块间的依赖关系</li>
              </ul>
            </Card>

            {/* 基本语法 */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">基本语法</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">导入模块</h3>
                  <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                    #pragma glslify: 模块名 = require('包名')
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">导出函数</h3>
                  <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                    #pragma glslify: export(函数名)
                  </div>
                </div>
              </div>
            </Card>

            {/* 基本示例 */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">基本示例</h2>
              <p className="text-gray-600 mb-4">
                以下示例展示了如何使用 glslify 导入噪声和颜色转换模块：
              </p>
              <div className="border rounded-lg overflow-hidden">
                <CodeEditor
                  value={basicExample}
                  onChange={() => {}}
                  language="glsl"
                  readOnly
                  height="400px"
                />
              </div>
            </Card>

            {/* 自定义模块 */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">创建自定义模块</h2>
              <p className="text-gray-600 mb-4">
                你也可以创建自己的模块并在项目中重复使用：
              </p>
              <div className="border rounded-lg overflow-hidden">
                <CodeEditor
                  value={customModuleExample}
                  onChange={() => {}}
                  language="glsl"
                  readOnly
                  height="400px"
                />
              </div>
            </Card>

            {/* 常用模块 */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">常用模块推荐</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-medium">噪声函数</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li><code>glsl-noise/simplex/3d</code> - 3D 单纯噪声</li>
                    <li><code>glsl-noise/periodic/3d</code> - 周期性噪声</li>
                    <li><code>glsl-noise/classic/3d</code> - 经典噪声</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium">颜色工具</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li><code>glsl-hsl2rgb</code> - HSL 转 RGB</li>
                    <li><code>glsl-hsv2rgb</code> - HSV 转 RGB</li>
                    <li><code>glsl-gamma</code> - 伽马校正</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium">数学工具</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li><code>glsl-rotate</code> - 旋转变换</li>
                    <li><code>glsl-easings</code> - 缓动函数</li>
                    <li><code>glsl-smooth-min</code> - 平滑最小值</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium">距离场</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li><code>glsl-sdf-primitives</code> - 基本图形</li>
                    <li><code>glsl-sdf-ops</code> - SDF 操作</li>
                    <li><code>glsl-raytrace</code> - 光线追踪</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 最佳实践 */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">最佳实践</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">1. 模块命名</h3>
                  <p className="text-sm text-gray-600">
                    使用描述性的名称，避免与内置函数冲突。
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">2. 性能考虑</h3>
                  <p className="text-sm text-gray-600">
                    只导入需要的模块，避免不必要的计算开销。
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">3. 版本管理</h3>
                  <p className="text-sm text-gray-600">
                    在 package.json 中固定模块版本，确保项目稳定性。
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">4. 文档编写</h3>
                  <p className="text-sm text-gray-600">
                    为自定义模块编写清晰的注释和使用说明。
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}