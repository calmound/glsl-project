'use client';

import React from 'react';
import ShaderCanvas from '../common/shader-canvas';

const fireShader = `
  precision mediump float;
  
  uniform vec2 u_resolution;
  uniform float u_time;
  
  // 简化的随机函数
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // 噪声函数
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    // 四个角的随机值
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    // 平滑插值
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) +
            (c - a) * u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
  }
  
  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    // 叠加噪声层
    for (int i = 0; i < 5; i++) {
        value += amplitude * noise(st * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    
    return value;
  }
  
  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 创建火焰形状的基础
    st.y = 1.0 - st.y; // 翻转y轴使火焰向上
    
    // 添加时间偏移噪声，模拟火焰移动
    float noise1 = fbm(st * vec2(3.0, 4.0) + u_time * 0.3);
    float noise2 = fbm(st * vec2(5.0, 7.0) - u_time * 0.2);
    
    float finalNoise = noise1 * noise2 * 2.0;
    
    // 火焰形状
    float shape = pow(1.0 - st.y, 1.5) * (0.8 + 0.2 * sin(u_time));
    shape = shape + finalNoise * 0.1 - st.y * 1.1;
    
    // 颜色渐变
    vec3 color = vec3(1.0, 0.3, 0.0); // 橙色基础
    
    // 火焰颜色渐变
    color = mix(color, vec3(1.0, 0.8, 0.0), pow(st.y, 1.5)); // 顶部偏黄
    color = mix(vec3(0.0), color, smoothstep(0.0, 0.8, shape));
    
    // 添加亮度变化
    color += vec3(0.1, 0.0, 0.0) * sin(u_time * 2.0 + st.y * 10.0) * 0.1;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const FireShaderExample: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <ShaderCanvas
        fragmentShader={fireShader}
        width={400}
        height={300}
        className="w-full h-full"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h3 className="text-white text-lg font-semibold">火焰效果</h3>
        <p className="text-white/80 text-sm">使用多层噪声和颜色渐变模拟火焰</p>
      </div>
    </div>
  );
};

export default FireShaderExample;
