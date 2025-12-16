import { CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { GLSL_SNIPPETS } from '../lib/code-snippets';
import { type Locale } from '../lib/i18n';

/**
 * GLSL 内置函数和关键字
 */
const GLSL_KEYWORDS = [
  'void', 'bool', 'int', 'float', 'vec2', 'vec3', 'vec4',
  'mat2', 'mat3', 'mat4', 'sampler2D', 'samplerCube',
  'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'return',
  'const', 'uniform', 'attribute', 'varying', 'in', 'out', 'inout',
  'precision', 'lowp', 'mediump', 'highp',
  'struct', 'true', 'false'
];

const GLSL_FUNCTIONS = [
  // 三角函数
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'radians', 'degrees',
  // 指数函数
  'pow', 'exp', 'log', 'exp2', 'log2', 'sqrt', 'inversesqrt',
  // 常用函数
  'abs', 'sign', 'floor', 'ceil', 'fract', 'mod', 'min', 'max', 'clamp',
  // 插值和步进
  'mix', 'step', 'smoothstep',
  // 几何函数
  'length', 'distance', 'dot', 'cross', 'normalize', 'faceforward', 'reflect', 'refract',
  // 矩阵函数
  'matrixCompMult', 'transpose', 'inverse', 'determinant',
  // 向量关系函数
  'lessThan', 'lessThanEqual', 'greaterThan', 'greaterThanEqual',
  'equal', 'notEqual', 'any', 'all', 'not',
  // 纹理函数
  'texture2D', 'texture2DProj', 'texture2DLod', 'texture2DProjLod',
  'textureCube', 'textureCubeLod',
  'texture', 'textureProj', 'textureLod', 'textureOffset',
  // 微分函数
  'dFdx', 'dFdy', 'fwidth'
];

const GLSL_VARIABLES = [
  // Fragment Shader 内置变量
  'gl_FragColor', 'gl_FragCoord', 'gl_FragDepth', 'gl_FrontFacing',
  // Vertex Shader 内置变量
  'gl_Position', 'gl_PointSize',
  // 常用 uniform 变量
  'u_time', 'u_resolution', 'u_mouse',
  // 常用 varying 变量
  'vUv', 'vNormal', 'vPosition'
];

const GLSL_CONSTANTS = [
  { label: 'PI', apply: '3.14159265359', detail: '圆周率 π' },
  { label: 'TAU', apply: '6.28318530718', detail: '2π' },
  { label: 'PHI', apply: '1.61803398875', detail: '黄金比例' },
  { label: 'E', apply: '2.71828182846', detail: '自然常数 e' }
];

/**
 * 创建GLSL自动补全函数
 */
export function createGLSLCompletion(category: string = 'basic', locale: Locale = 'zh') {
  return (context: CompletionContext): CompletionResult | null => {
    const word = context.matchBefore(/\w*/);

    if (!word || (word.from === word.to && !context.explicit)) {
      return null;
    }

    const options = [];

    // 1. 添加代码片段
    const snippets = GLSL_SNIPPETS[category] || GLSL_SNIPPETS.basic;
    for (const snippet of snippets) {
      const title = snippet.title[locale] || snippet.title.zh;
      const description = snippet.description?.[locale] || snippet.description?.zh || '';

      // 提取第一个单词作为触发词
      const trigger = snippet.id.replace(/-/g, '');

      options.push({
        label: trigger,
        type: 'snippet',
        detail: title,
        info: description,
        apply: snippet.code,
        boost: 100 // 片段优先级最高
      });
    }

    // 2. 添加GLSL关键字
    for (const keyword of GLSL_KEYWORDS) {
      options.push({
        label: keyword,
        type: 'keyword',
        boost: 90
      });
    }

    // 3. 添加GLSL内置函数
    for (const func of GLSL_FUNCTIONS) {
      options.push({
        label: func,
        type: 'function',
        apply: `${func}()`,
        boost: 80
      });
    }

    // 4. 添加常用变量
    for (const variable of GLSL_VARIABLES) {
      options.push({
        label: variable,
        type: 'variable',
        boost: 85
      });
    }

    // 5. 添加数学常量
    for (const constant of GLSL_CONSTANTS) {
      options.push({
        ...constant,
        type: 'constant',
        boost: 95
      });
    }

    return {
      from: word.from,
      options,
      validFor: /^\w*$/
    };
  };
}

/**
 * 获取所有类别的代码片段补全
 */
export function getAllSnippetsCompletion(locale: Locale = 'zh') {
  return (context: CompletionContext): CompletionResult | null => {
    const word = context.matchBefore(/\w*/);

    if (!word || (word.from === word.to && !context.explicit)) {
      return null;
    }

    const options = [];

    // 添加所有类别的代码片段
    for (const category in GLSL_SNIPPETS) {
      const snippets = GLSL_SNIPPETS[category];
      for (const snippet of snippets) {
        const title = snippet.title[locale] || snippet.title.zh;
        const description = snippet.description?.[locale] || snippet.description?.zh || '';

        // 提取触发词
        const trigger = snippet.id.replace(/-/g, '');

        options.push({
          label: trigger,
          type: 'snippet',
          detail: `${title} [${category}]`,
          info: description,
          apply: snippet.code,
          boost: 100
        });
      }
    }

    // 添加GLSL关键字
    for (const keyword of GLSL_KEYWORDS) {
      options.push({
        label: keyword,
        type: 'keyword',
        boost: 90
      });
    }

    // 添加GLSL内置函数
    for (const func of GLSL_FUNCTIONS) {
      options.push({
        label: func,
        type: 'function',
        apply: `${func}()`,
        boost: 80
      });
    }

    // 添加常用变量
    for (const variable of GLSL_VARIABLES) {
      options.push({
        label: variable,
        type: 'variable',
        boost: 85
      });
    }

    // 添加数学常量
    for (const constant of GLSL_CONSTANTS) {
      options.push({
        ...constant,
        type: 'constant',
        boost: 95
      });
    }

    return {
      from: word.from,
      options,
      validFor: /^\w*$/
    };
  };
}
