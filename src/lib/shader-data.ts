'use client';

import React from 'react';

/**
 * 着色器数据结构定义
 */
export interface ShaderExample {
  id: string;
  title: string;
  description: string;
  category: ShaderCategory;
  difficulty: ShaderDifficulty;
  fragmentShader: string;
  vertexShader?: string;
  tags: string[];
  uniforms?: Record<string, any>;
  defaultControls?: ShaderControl[];
  thumbnail?: string;
  references?: { title: string; url: string }[];
}

export type ShaderCategory =
  | 'basic'
  | 'noise'
  | 'lighting'
  | 'procedural'
  | 'effects'
  | 'animation'
  | 'simulation'
  | 'background'
  | 'advanced';
export type ShaderDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ShaderControl {
  name: string;
  label: string;
  type: 'range' | 'color' | 'checkbox';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: any;
}

// 显示名称映射
export const categoryDisplayNames: Record<ShaderCategory, string> = {
  basic: '基础',
  noise: '噪声',
  lighting: '光照',
  procedural: '程序化生成',
  effects: '特效',
  animation: '动画',
  simulation: '模拟',
  background: '背景',
  advanced: '高级技术',
};

export const difficultyDisplayNames: Record<ShaderDifficulty, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
};

// 原始着色器代码库
export const SHADER_CODE = {
  // 波浪效果
  wave: {
    fragment: `
      precision mediump float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        // 创建多层波浪
        float wave1 = sin(uv.x * 10.0 + u_time * 2.0) * 0.1;
        float wave2 = sin(uv.x * 20.0 - u_time * 3.0) * 0.05;
        
        // 组合波浪并映射到颜色
        float wave = wave1 + wave2;
        uv.y += wave;
        
        // 平滑过渡
        float threshold = 0.5 + wave * 0.5;
        float edge = smoothstep(threshold - 0.05, threshold + 0.05, uv.y);
        
        // 水色渐变
        vec3 waterColor = mix(
          vec3(0.0, 0.5, 0.8),
          vec3(0.0, 0.3, 0.6),
          uv.y
        );
        
        // 最终颜色
        vec3 color = mix(waterColor, vec3(0.8, 0.9, 1.0), edge);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    vertex: `
      attribute vec4 position;
      varying vec2 vUv;
      
      void main() {
        vUv = position.xy * 0.5 + 0.5;
        gl_Position = position;
      }
    `,
  },

  // 火焰效果
  fire: {
    fragment: `
      precision mediump float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      
      // 噪声函数
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        
        // 四角随机值
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        
        // 平滑插值
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      // 分形布朗运动
      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for (int i = 0; i < 5; i++) {
          value += amplitude * noise(frequency * st);
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        
        return value;
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        // 扭曲底部坐标创建火焰形状
        uv.y = 1.0 - uv.y;
        uv.x = uv.x * 2.0 - 1.0;
        uv.x *= 1.0 + uv.y * 0.5;
        
        // 动态噪声
        float noise1 = fbm(uv * 2.0 + u_time * 0.5);
        float noise2 = fbm(uv * 4.0 - u_time * 0.5);
        
        // 火焰形状
        float shape = uv.y * 2.0;
        shape *= 1.0 + noise1 * 0.7 + noise2 * 0.3;
        shape = 1.0 - smoothstep(0.0, 1.4, shape);
        
        // 颜色渐变
        vec3 color1 = vec3(1.0, 0.5, 0.0);    // 橙色
        vec3 color2 = vec3(1.0, 0.0, 0.0);    // 红色
        vec3 color3 = vec3(1.0, 0.9, 0.0);    // 黄色
        
        float t = fbm(uv * 5.0 + noise2 * 0.1) * shape;
        vec3 color = mix(color2, color1, uv.y);
        color = mix(color, color3, clamp(noise1 * 2.0, 0.0, 1.0) * shape);
        
        gl_FragColor = vec4(color * shape, shape);
      }
    `,
    vertex: `
      attribute vec4 position;
      varying vec2 vUv;
      
      void main() {
        vUv = position.xy * 0.5 + 0.5;
        gl_Position = position;
      }
    `,
  },

  // 星空效果
  stars: {
    fragment: `
      precision mediump float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      
      // 随机函数
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      // 星星函数
      float star(vec2 st, float size, float brightness) {
        vec2 pos = vec2(0.5) - st;
        float d = length(pos) * 2.0;
        return 1.0 - smoothstep(size, size + 0.01 + (1.0 - brightness) * 0.1, d);
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        // 深蓝色背景
        vec3 backgroundColor = vec3(0.0, 0.02, 0.05);
        
        // 创建星空
        vec3 color = backgroundColor;
        
        // 划分网格
        float gridSize = 40.0;
        vec2 gridPos = fract(uv * gridSize);
        vec2 cellId = floor(uv * gridSize);
        
        // 每个网格单元随机生成星星
        float randVal = random(cellId);
        if (randVal > 0.8) {
          // 星星的位置、大小和亮度
          vec2 starPos = gridPos;
          float starSize = clamp(random(cellId + 0.2) * 0.2, 0.01, 0.15);
          float brightness = clamp(random(cellId + 0.3), 0.5, 1.0);
          
          // 星星闪烁
          float twinkle = sin(u_time * 3.0 * random(cellId + 0.4)) * 0.3 + 0.7;
          brightness *= twinkle;
          
          // 生成星星
          float s = star(starPos, starSize * 0.2, brightness);
          vec3 starColor = vec3(0.9, 0.9, 1.0) * brightness;
          
          // 添加一些颜色变化
          if (random(cellId + 0.5) > 0.7) {
            starColor = mix(starColor, vec3(0.9, 0.9, 0.6), random(cellId + 0.6));
          }
          
          color = mix(color, starColor, s);
        }
        
        // 添加星云效果
        float nebula = 0.0;
        for (float i = 1.0; i < 4.0; i++) {
          vec2 offset = vec2(cos(u_time * 0.1 * i), sin(u_time * 0.05 * i)) * 0.3;
          float noise = random(uv * (0.5 * i) + offset + vec2(u_time * 0.01));
          nebula += smoothstep(0.5, 1.0, noise) * 0.1 * (1.0 / i);
        }
        
        vec3 nebulaColor = mix(
          vec3(0.1, 0.0, 0.2),
          vec3(0.0, 0.2, 0.4),
          nebula * 3.0
        );
        
        color += nebulaColor * nebula;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    vertex: `
      attribute vec4 position;
      varying vec2 vUv;
      
      void main() {
        vUv = position.xy * 0.5 + 0.5;
        gl_Position = position;
      }
    `,
  },

  // 光线行进效果
  raymarch: {
    fragment: `
      precision mediump float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      
      #define MAX_STEPS 100
      #define MAX_DIST 100.0
      #define SURF_DIST 0.001
      
      // 符号距离函数：球体
      float sdSphere(vec3 p, float r) {
        return length(p) - r;
      }
      
      // 符号距离函数：平面
      float sdPlane(vec3 p) {
        return p.y;
      }
      
      // 场景距离函数
      float getDist(vec3 p) {
        // 移动的球体
        vec3 spherePos = vec3(sin(u_time) * 1.0, 1.0, 0.0);
        float sphereDist = sdSphere(p - spherePos, 1.0);
        
        // 地面
        float planeDist = sdPlane(p);
        
        // 返回最近的距离
        return min(sphereDist, planeDist);
      }
      
      // 光线行进
      float rayMarch(vec3 ro, vec3 rd) {
        float dO = 0.0; // 行进距离
        
        for (int i = 0; i < MAX_STEPS; i++) {
          vec3 p = ro + rd * dO;
          float dS = getDist(p);
          dO += dS;
          if (dS < SURF_DIST || dO > MAX_DIST) break;
        }
        
        return dO;
      }
      
      // 计算法线
      vec3 getNormal(vec3 p) {
        float d = getDist(p);
        vec2 e = vec2(0.01, 0.0);
        
        vec3 n = d - vec3(
          getDist(p - e.xyy),
          getDist(p - e.yxy),
          getDist(p - e.yyx)
        );
        
        return normalize(n);
      }
      
      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
        
        // 相机设置
        vec3 ro = vec3(0.0, 1.0, -3.0); // 相机位置
        vec3 rd = normalize(vec3(uv.x, uv.y, 1.0)); // 光线方向
        
        // 光线行进
        float d = rayMarch(ro, rd);
        
        // 着色
        vec3 color = vec3(0.0);
        
        if (d < MAX_DIST) {
          vec3 p = ro + rd * d;
          vec3 n = getNormal(p);
          
          // 光源方向
          vec3 lightDir = normalize(vec3(1.0, 2.0, -1.0));
          
          // 漫反射
          float diff = max(dot(n, lightDir), 0.0);
          
          // 阴影
          float shadow = 1.0;
          
          // 颜色
          color = vec3(1.0, 0.8, 0.6) * diff * shadow;
          
          // 环境光
          color += vec3(0.1, 0.2, 0.3) * 0.2;
        }
        
        // 雾效
        color = mix(color, vec3(0.5, 0.6, 0.7), 1.0 - exp(-0.0005 * d * d));
        
        // Gamma校正
        color = pow(color, vec3(0.4545));
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    vertex: `
      attribute vec4 position;
      varying vec2 vUv;
      
      void main() {
        vUv = position.xy * 0.5 + 0.5;
        gl_Position = position;
      }
    `,
  },
};

/**
 * 着色器示例数据
 */
export const shaderExamples: ShaderExample[] = [
  {
    id: 'wave',
    title: '波浪效果',
    category: 'animation',
    difficulty: 'beginner',
    description: '使用正弦和余弦函数创建平滑的波浪动画效果，模拟水面波纹。',
    tags: ['正弦波', '平滑插值', '颜色混合'],
    thumbnail: '/wave-shader.jpg',
    fragmentShader: SHADER_CODE.wave.fragment,
    vertexShader: SHADER_CODE.wave.vertex,
    uniforms: {},
    defaultControls: [
      {
        name: 'u_waveSpeed',
        label: '波浪速度',
        type: 'range',
        min: 0.1,
        max: 5.0,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        name: 'u_waveHeight',
        label: '波浪高度',
        type: 'range',
        min: 0.01,
        max: 0.2,
        step: 0.01,
        defaultValue: 0.1,
      },
    ],
  },
  {
    id: 'fire',
    title: '火焰效果',
    category: 'simulation',
    difficulty: 'intermediate',
    description: '通过噪声函数和颜色渐变模拟逼真的火焰效果，实现动态燃烧视觉。',
    tags: ['分形布朗运动', '噪声函数', '颜色渐变'],
    thumbnail: '/fire-shader.jpg',
    fragmentShader: SHADER_CODE.fire.fragment,
    vertexShader: SHADER_CODE.fire.vertex,
    uniforms: {},
    defaultControls: [
      {
        name: 'u_flameIntensity',
        label: '火焰强度',
        type: 'range',
        min: 0.5,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        name: 'u_flameSpeed',
        label: '火焰速度',
        type: 'range',
        min: 0.1,
        max: 2.0,
        step: 0.1,
        defaultValue: 0.5,
      },
    ],
  },
  {
    id: 'stars',
    title: '星空效果',
    category: 'background',
    difficulty: 'beginner',
    description: '使用随机函数和点精灵创建动态星空背景，包含闪烁星星和星云。',
    tags: ['随机函数', '网格划分', '动态闪烁'],
    thumbnail: '/stars-shader.jpg',
    fragmentShader: SHADER_CODE.stars.fragment,
    vertexShader: SHADER_CODE.stars.vertex,
    uniforms: {},
    defaultControls: [
      {
        name: 'u_starDensity',
        label: '星星密度',
        type: 'range',
        min: 10.0,
        max: 100.0,
        step: 5.0,
        defaultValue: 40.0,
      },
      {
        name: 'u_twinkleSpeed',
        label: '闪烁速度',
        type: 'range',
        min: 0.1,
        max: 5.0,
        step: 0.1,
        defaultValue: 1.0,
      },
    ],
  },
  {
    id: 'raymarch',
    title: '光线行进',
    category: 'advanced',
    difficulty: 'advanced',
    description: '使用光线行进算法实现基于距离场的3D渲染效果，展现动态光影。',
    tags: ['符号距离函数', '光线行进', '漫反射光照'],
    thumbnail: '/raymarch-shader.jpg',
    fragmentShader: SHADER_CODE.raymarch.fragment,
    vertexShader: SHADER_CODE.raymarch.vertex,
    uniforms: {},
    defaultControls: [
      {
        name: 'u_sphereRadius',
        label: '球体大小',
        type: 'range',
        min: 0.5,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        name: 'u_lightIntensity',
        label: '光照强度',
        type: 'range',
        min: 0.5,
        max: 3.0,
        step: 0.1,
        defaultValue: 1.0,
      },
    ],
  },
  {
    id: 'simple-gradient',
    title: '简单渐变',
    description: '从左到右的简单颜色渐变',
    category: 'basic',
    difficulty: 'beginner',
    tags: ['color', 'gradient'],
    fragmentShader: `
precision mediump float;

uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec3 color = vec3(uv.x, 0.5, 1.0 - uv.x);
  gl_FragColor = vec4(color, 1.0);
}
`,
    defaultControls: [],
  },
  {
    id: 'circle',
    title: '圆形',
    description: '中心圆形渐变效果',
    category: 'basic',
    difficulty: 'beginner',
    tags: ['shape', 'circle'],
    fragmentShader: `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_radius;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 center = vec2(0.5, 0.5);
  
  float dist = distance(uv, center);
  float circle = 1.0 - smoothstep(u_radius - 0.01, u_radius + 0.01, dist);
  
  vec3 color = circle * vec3(1.0, 0.5, 0.2);
  gl_FragColor = vec4(color, 1.0);
}
`,
    uniforms: {
      u_radius: 0.25,
    },
    defaultControls: [
      {
        name: 'u_radius',
        label: '半径',
        type: 'range',
        min: 0.0,
        max: 0.5,
        step: 0.01,
        defaultValue: 0.25,
      },
    ],
  },
];

/**
 * 实用函数
 */

// 从文件系统加载着色器
export const loadShaderFromFile = async (
  category: string,
  id: string
): Promise<ShaderExample | null> => {
  try {
    // 构建文件路径
    const filePath = `/api/shader-file?path=${category}/${id}`;

    console.log('加载着色器文件:', filePath);

    // 从API获取着色器文件内容
    const response = await fetch(filePath);
    if (!response.ok) {
      console.error(`未能加载着色器文件: ${response.statusText}`);
      return null;
    }

    const shaderContent = await response.text();
    console.log('着色器内容长度:', shaderContent.length);

    if (shaderContent.length > 0) {
      console.log('着色器内容预览:', shaderContent.substring(0, 100) + '...');
    } else {
      console.error('着色器内容为空');
    }

    // 简单解析文件内容，提取标题和描述
    const titleMatch = shaderContent.match(/\/\/\s*(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : id;

    // 检查是否包含必要的着色器语法
    if (!shaderContent.includes('void main()')) {
      console.error('着色器内容似乎不是有效的GLSL：缺少main函数');
    }

    // 默认着色器示例对象
    const shaderExample: ShaderExample = {
      id,
      title,
      description: `${category}/${id}着色器示例`,
      category: category as ShaderCategory,
      difficulty: 'beginner', // 默认难度
      fragmentShader: shaderContent,
      tags: [category, id],
      uniforms: {
        u_time: 0.0,
        u_resolution: [300, 300],
      },
    };

    return shaderExample;
  } catch (error) {
    console.error('加载着色器文件时出错:', error);
    return null;
  }
};

// 根据ID获取着色器示例
export const getShaderById = (id: string): ShaderExample | null => {
  return shaderExamples.find(shader => shader.id === id) || null;
};

// 根据类别获取着色器示例
export const getShadersByCategory = (category: ShaderCategory): ShaderExample[] => {
  return shaderExamples.filter(shader => shader.category === category);
};

// 根据难度获取着色器示例
export const getShadersByDifficulty = (difficulty: ShaderDifficulty): ShaderExample[] => {
  return shaderExamples.filter(shader => shader.difficulty === difficulty);
};

// 获取所有类别
export const getAllCategories = (): ShaderCategory[] => {
  return Array.from(new Set(shaderExamples.map(s => s.category)));
};
