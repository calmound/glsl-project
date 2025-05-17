'use client';

import React from 'react';
import ShaderCanvas from '../common/shader-canvas';

const waveShader = `
  precision mediump float;
  
  uniform vec2 u_resolution;
  uniform float u_time;
  
  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 创建波浪效果
    float frequency = 10.0;
    float amplitude = 0.1;
    float y = sin(st.x * frequency + u_time * 2.0) * amplitude;
    
    // 距离波浪的距离
    float distance = abs(st.y - 0.5 - y);
    
    // 颜色渐变
    vec3 color = vec3(0.0);
    color.b = 1.0 - pow(distance * 10.0, 0.8);
    color.g = pow(1.0 - distance * 5.0, 2.0) * 0.5;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const WaveShaderExample: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <ShaderCanvas
        fragmentShader={waveShader}
        width={400}
        height={300}
        className="w-full h-full"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h3 className="text-white text-lg font-semibold">波浪效果</h3>
        <p className="text-white/80 text-sm">使用正弦和渐变创建流动的波浪</p>
      </div>
    </div>
  );
};

export default WaveShaderExample;
