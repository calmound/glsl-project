'use client';

import React from 'react';
import ShaderCanvas from '../common/shader-canvas';

const starsShader = `
  precision mediump float;
  
  uniform vec2 u_resolution;
  uniform float u_time;
  
  // 简单的哈希函数，用于生成伪随机数
  float hash(float n) {
    return fract(sin(n) * 43758.5453);
  }
  
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float stars(vec2 p, float seed) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // 计算每个单元格的星星
    float size = hash(i + seed) * 0.04 + 0.004;
    float brightness = hash(i.x + i.y * 100.0 + seed * 10.0);
    
    // 只有一部分格子有星星
    if (brightness > 0.65) {
      // 星星形状
      vec2 center = f - 0.5;
      float d = length(center);
      
      // 添加闪烁效果
      float twinkle = sin(u_time * (0.5 + brightness) + seed * 10.0) * 0.5 + 0.5;
      brightness = brightness * 0.5 + 0.5 * twinkle;
      
      // 基于距离创建星星形状
      float star = 1.0 - smoothstep(size * 0.5, size, d);
      
      // 星星亮度衰减
      return star * brightness * 0.8;
    }
    
    return 0.0;
  }
  
  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 让宽高比例正确
    st.x *= u_resolution.x / u_resolution.y;
    
    // 调整坐标范围
    vec2 pos = st * 100.0;
    
    // 创建星空背景色
    vec3 bg = vec3(0.0, 0.02, 0.05);
    
    // 添加深色渐变效果
    bg += vec3(0.1, 0.1, 0.2) * (1.0 - length(st - vec2(0.5, 0.7)));
    
    // 添加多层次星星
    vec3 color = bg;
    float starLayer1 = stars(pos, 0.0);
    float starLayer2 = stars(pos * 0.5 + vec2(u_time * 0.02, 0.0), 1.0);
    float starLayer3 = stars(pos * 0.25 + vec2(-u_time * 0.01, 0.0), 2.0);
    
    // 组合星星层，不同的大小和亮度
    color += vec3(1.0, 1.0, 1.0) * starLayer1;
    color += vec3(0.8, 0.9, 1.0) * starLayer2;
    color += vec3(0.6, 0.8, 1.0) * starLayer3;
    
    // 创建一个大一点的亮星
    vec2 center = vec2(0.3, 0.4);
    float bigStar = 1.0 - smoothstep(0.01, 0.015, length(st - center));
    color += vec3(1.0, 0.9, 0.6) * bigStar;
    
    // 添加星星光晕
    color += vec3(0.6, 0.8, 1.0) * (1.0 - smoothstep(0.0, 0.3, length(st - center))) * 0.1;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const StarsShaderExample: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <ShaderCanvas
        fragmentShader={starsShader}
        width={400}
        height={300}
        className="w-full h-full"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h3 className="text-white text-lg font-semibold">星空效果</h3>
        <p className="text-white/80 text-sm">使用哈希函数和多层次结构创建动态星空</p>
      </div>
    </div>
  );
};

export default StarsShaderExample;
