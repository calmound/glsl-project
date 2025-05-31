/**
 * 着色器数据结构定义和工具函数
 */

/**
 * 着色器示例接口
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
  uniforms?: Record<string, number | boolean | number[] | string>;
  defaultControls?: ShaderControl[];
  thumbnail?: string;
  references?: { title: string; url: string }[];
  readme?: string;
  exerciseShader?: string;
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
  defaultValue: number | string | boolean;
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

/**
 * 从文件加载着色器内容
 */
export const loadShaderFromFile = async (category: string, id: string, lang: string = 'zh'): Promise<ShaderExample | null> => {
  try {
    const response = await fetch(`/api/shader/${category}/${id}?lang=${lang}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('加载着色器文件时出错:', error);
    return null;
  }
};

// 使用 glslify 模块的着色器示例（用于演示 glslify 功能）
export const glslifyExamples: ShaderExample[] = [
  {
    id: 'glslify-noise-terrain',
    title: '使用 glslify 的噪声地形',
    description: '演示如何使用 glslify 模块系统创建噪声地形效果',
    category: 'procedural',
    difficulty: 'intermediate',
    fragmentShader: `
      precision mediump float;
      
      #pragma glslify: noise = require('glsl-noise/simplex/3d')
      #pragma glslify: hsl2rgb = require('glsl-hsl2rgb')
      
      uniform float u_time;
      uniform vec2 u_resolution;
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        // 使用 glslify 噪声模块生成地形高度
        float height = noise(vec3(uv * 5.0, u_time * 0.1));
        height += noise(vec3(uv * 10.0, u_time * 0.2)) * 0.5;
        height += noise(vec3(uv * 20.0, u_time * 0.3)) * 0.25;
        
        // 使用 glslify 颜色模块转换颜色
        vec3 color = hsl2rgb(height * 0.3 + 0.5, 0.7, 0.5);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    tags: ['glslify', 'noise', 'terrain', 'procedural'],
    uniforms: {
      u_time: 0.0,
      u_resolution: [300, 300],
    },
  },
  {
    id: 'glslify-rotating-shapes',
    title: '使用 glslify 的旋转图形',
    description: '演示如何使用 glslify 数学模块创建旋转图形',
    category: 'animation',
    difficulty: 'beginner',
    fragmentShader: `
      precision mediump float;
      
      #pragma glslify: rotate = require('glsl-rotate/rotate')
      
      uniform float u_time;
      uniform vec2 u_resolution;
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        uv = uv * 2.0 - 1.0;
        uv.x *= u_resolution.x / u_resolution.y;
        
        // 使用 glslify 旋转模块
        uv = rotate(uv, u_time);
        
        // 创建简单的图形
        float d = length(uv) - 0.5;
        float shape = smoothstep(0.0, 0.02, -d);
        
        vec3 color = vec3(shape) * vec3(1.0, 0.5, 0.8);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    tags: ['glslify', 'rotation', 'animation', 'shapes'],
    uniforms: {
      u_time: 0.0,
      u_resolution: [300, 300],
    },
  },
  {
    id: 'glslify-easing-animation',
    title: '使用 glslify 的缓动动画',
    description: '演示如何使用 glslify 缓动函数创建平滑动画',
    category: 'animation',
    difficulty: 'intermediate',
    fragmentShader: `
      precision mediump float;
      
      #pragma glslify: ease = require('glsl-easings/cubic-in-out')
      
      uniform float u_time;
      uniform vec2 u_resolution;
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        // 使用 glslify 缓动函数
        float t = ease(sin(u_time) * 0.5 + 0.5);
        
        // 创建动画效果
        float circle = length(uv - vec2(0.5)) - 0.1 - t * 0.2;
        float shape = smoothstep(0.0, 0.02, -circle);
        
        vec3 color = mix(
          vec3(0.2, 0.4, 0.8),
          vec3(0.8, 0.4, 0.2),
          t
        ) * shape;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    tags: ['glslify', 'easing', 'animation', 'smooth'],
    uniforms: {
      u_time: 0.0,
      u_resolution: [300, 300],
    },
  },
];

/**
 * 根据ID获取着色器示例（优先从 glslify 示例中查找）
 */
export const getShaderById = (id: string): ShaderExample | null => {
  return glslifyExamples.find(shader => shader.id === id) || null;
};

/**
 * 根据类别获取着色器示例
 */
export const getShadersByCategory = (category: ShaderCategory): ShaderExample[] => {
  return glslifyExamples.filter(shader => shader.category === category);
};

/**
 * 根据难度获取着色器示例
 */
export const getShadersByDifficulty = (difficulty: ShaderDifficulty): ShaderExample[] => {
  return glslifyExamples.filter(shader => shader.difficulty === difficulty);
};

/**
 * 获取所有类别
 */
export const getAllCategories = (): ShaderCategory[] => {
  return Array.from(new Set(glslifyExamples.map(s => s.category)));
};
