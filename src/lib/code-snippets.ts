import { type Locale } from './i18n';

interface CodeSnippet {
  id: string;
  title: {
    zh: string;
    en: string;
  };
  description?: {
    zh: string;
    en: string;
  };
  code: string;
}

export const GLSL_SNIPPETS: Record<string, CodeSnippet[]> = {
  basic: [
    {
      id: 'main-function',
      title: { zh: '主函数模板', en: 'Main Function Template' },
      description: { zh: '基本的 main 函数结构', en: 'Basic main function structure' },
      code: `void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  gl_FragColor = vec4(uv, 0.0, 1.0);
}`
    },
    {
      id: 'normalize-coords',
      title: { zh: '归一化坐标', en: 'Normalize Coordinates' },
      description: { zh: '将坐标归一化到 -1 到 1', en: 'Normalize coordinates to -1 to 1' },
      code: `vec2 uv = gl_FragCoord.xy / u_resolution;
uv = uv * 2.0 - 1.0;
uv.x *= u_resolution.x / u_resolution.y;`
    },
    {
      id: 'circle',
      title: { zh: '圆形函数', en: 'Circle Function' },
      description: { zh: '绘制圆形的函数', en: 'Function to draw a circle' },
      code: `float circle(vec2 st, float radius) {
  return step(radius, length(st - 0.5));
}`
    },
    {
      id: 'rectangle',
      title: { zh: '矩形函数', en: 'Rectangle Function' },
      description: { zh: '绘制矩形的函数', en: 'Function to draw a rectangle' },
      code: `float rectangle(vec2 st, vec2 size) {
  vec2 uv = step(size, st) * step(size, 1.0 - st);
  return uv.x * uv.y;
}`
    }
  ],

  math: [
    {
      id: 'smoothstep',
      title: { zh: '平滑过渡', en: 'Smooth Transition' },
      description: { zh: '使用 smoothstep 创建平滑过渡', en: 'Create smooth transition with smoothstep' },
      code: `float smoothEdge = smoothstep(0.4, 0.6, value);`
    },
    {
      id: 'mix',
      title: { zh: '颜色混合', en: 'Color Mixing' },
      description: { zh: '在两个颜色之间混合', en: 'Mix between two colors' },
      code: `vec3 color1 = vec3(1.0, 0.0, 0.0);
vec3 color2 = vec3(0.0, 0.0, 1.0);
vec3 finalColor = mix(color1, color2, factor);`
    },
    {
      id: 'rotate',
      title: { zh: '2D 旋转', en: '2D Rotation' },
      description: { zh: '旋转 2D 坐标', en: 'Rotate 2D coordinates' },
      code: `vec2 rotate(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}`
    },
    {
      id: 'fract-pattern',
      title: { zh: '重复图案', en: 'Repeating Pattern' },
      description: { zh: '使用 fract 创建重复图案', en: 'Create repeating pattern with fract' },
      code: `vec2 uv = fract(st * 5.0);`
    }
  ],

  patterns: [
    {
      id: 'checkerboard',
      title: { zh: '棋盘图案', en: 'Checkerboard Pattern' },
      description: { zh: '创建黑白棋盘', en: 'Create black and white checkerboard' },
      code: `float checker = mod(floor(st.x * 8.0) + floor(st.y * 8.0), 2.0);`
    },
    {
      id: 'grid',
      title: { zh: '网格', en: 'Grid' },
      description: { zh: '创建网格线', en: 'Create grid lines' },
      code: `vec2 grid = fract(st * 10.0);
float pattern = step(0.9, max(grid.x, grid.y));`
    },
    {
      id: 'waves',
      title: { zh: '波浪', en: 'Waves' },
      description: { zh: '使用 sin 创建波浪', en: 'Create waves with sin' },
      code: `float wave = sin(st.x * 10.0 + u_time) * 0.5 + 0.5;`
    },
    {
      id: 'spiral',
      title: { zh: '螺旋', en: 'Spiral' },
      description: { zh: '创建螺旋图案', en: 'Create spiral pattern' },
      code: `vec2 center = st - 0.5;
float angle = atan(center.y, center.x);
float radius = length(center);
float spiral = sin(angle * 5.0 + radius * 20.0);`
    }
  ],

  animation: [
    {
      id: 'pulse',
      title: { zh: '脉冲动画', en: 'Pulse Animation' },
      description: { zh: '创建脉冲效果', en: 'Create pulse effect' },
      code: `float pulse = abs(sin(u_time * 2.0));`
    },
    {
      id: 'rotate-time',
      title: { zh: '旋转动画', en: 'Rotation Animation' },
      description: { zh: '基于时间的旋转', en: 'Time-based rotation' },
      code: `vec2 rotated = rotate(st - 0.5, u_time) + 0.5;`
    },
    {
      id: 'oscillate',
      title: { zh: '振荡', en: 'Oscillate' },
      description: { zh: '在两个值之间振荡', en: 'Oscillate between two values' },
      code: `float osc = sin(u_time) * 0.5 + 0.5;`
    }
  ],

  noise: [
    {
      id: 'random',
      title: { zh: '随机函数', en: 'Random Function' },
      description: { zh: '伪随机数生成', en: 'Pseudo-random number generation' },
      code: `float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}`
    },
    {
      id: 'noise-2d',
      title: { zh: '2D 噪声', en: '2D Noise' },
      description: { zh: '简单的 2D 噪声函数', en: 'Simple 2D noise function' },
      code: `float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}`
    }
  ],

  lighting: [
    {
      id: 'diffuse',
      title: { zh: '漫反射光照', en: 'Diffuse Lighting' },
      description: { zh: '简单的漫反射计算', en: 'Simple diffuse lighting' },
      code: `vec3 normal = normalize(vec3(st.x, st.y, 1.0));
vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
float diff = max(dot(normal, lightDir), 0.0);`
    },
    {
      id: 'specular',
      title: { zh: '镜面高光', en: 'Specular Highlight' },
      description: { zh: '镜面反射高光', en: 'Specular reflection highlight' },
      code: `vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
vec3 reflectDir = reflect(-lightDir, normal);
float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);`
    }
  ]
};

/**
 * 根据分类获取代码片段
 */
export function getSnippetsByCategory(category: string): CodeSnippet[] {
  return GLSL_SNIPPETS[category] || GLSL_SNIPPETS.basic;
}

/**
 * 获取片段的本地化标题
 */
export function getSnippetTitle(snippet: CodeSnippet, locale: Locale): string {
  return snippet.title[locale] || snippet.title.zh;
}

/**
 * 获取片段的本地化描述
 */
export function getSnippetDescription(snippet: CodeSnippet, locale: Locale): string | undefined {
  return snippet.description ? (snippet.description[locale] || snippet.description.zh) : undefined;
}
