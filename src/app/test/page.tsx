'use client';

import React from 'react';
import MainLayout from '../../../components/layout/main-layout';
import ShaderCanvasNew from '../../../components/common/shader-canvas-new';

const basicGradientShader = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    // 归一化坐标 (0.0 - 1.0)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 线性渐变 - 垂直方向（从下到上）
    vec3 color1 = vec3(0.0, 0.0, uv.y);
    
    // 线性渐变 - 水平方向（从左到右）
    vec3 color2 = vec3(uv.x, 0.0, 0.2);
    
    // 径向渐变
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(uv, center);
    vec3 color3 = vec3(dist, 0.0, 0.5);
    
    // 动态混合渐变
    float mixFactor = abs(sin(u_time * 0.5));
    vec3 finalColor = mix(color1, mix(color2, color3, mixFactor), mixFactor);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function TestPage() {
  return (
    <MainLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">着色器渲染测试页面</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl mb-3">基本渐变效果</h2>
            <div
              className="border rounded-md shadow-sm overflow-hidden"
              style={{ height: '300px' }}
            >
              <ShaderCanvasNew
                fragmentShader={basicGradientShader}
                uniforms={{
                  u_time: 0.1,
                  u_resolution: [300, 300],
                }}
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
