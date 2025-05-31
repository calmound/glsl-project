'use client';

import { LanguageSupport, StreamLanguage } from '@codemirror/language';

// 定义 GLSL 语言 Token 规则，用于语法高亮
export function glsl() {
  return StreamLanguage.define({
    name: 'glsl',
    startState: function () {
      return {
        tokenize: null as ((stream: any, state: any) => string) | null,
        inBlock: false,
        blockType: '',
        lastToken: null,
        indentLevel: 0,
        indentInfo: null,
      };
    },
    token: function (stream, state) {
      // 处理注释
      if (stream.match('//')) {
        stream.skipToEnd();
        return 'comment';
      }

      if (stream.match('/*')) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      }

      // 处理字符串
      if (stream.match('"')) {
        state.tokenize = tokenString;
        return tokenString(stream, state);
      }

      // 处理数字
      if (stream.match(/^-?\d+\.\d+/) || stream.match(/^-?\d+/)) {
        return 'number';
      }

      // 处理预处理指令
      if (stream.match('#')) {
        while (stream.peek() && stream.peek() != '\n') {
          stream.next();
        }
        return 'meta';
      }

      // GLSL 保留字
      const keywords = [
        'attribute',
        'const',
        'uniform',
        'varying',
        'buffer',
        'shared',
        'coherent',
        'volatile',
        'restrict',
        'readonly',
        'writeonly',
        'atomic_uint',
        'layout',
        'centroid',
        'flat',
        'smooth',
        'noperspective',
        'patch',
        'sample',
        'break',
        'continue',
        'do',
        'for',
        'while',
        'switch',
        'case',
        'default',
        'if',
        'else',
        'subroutine',
        'in',
        'out',
        'inout',
        'float',
        'double',
        'int',
        'void',
        'bool',
        'true',
        'false',
        'invariant',
        'precise',
        'discard',
        'return',
        'mat2',
        'mat3',
        'mat4',
        'mat2x2',
        'mat2x3',
        'mat2x4',
        'mat3x2',
        'mat3x3',
        'mat3x4',
        'mat4x2',
        'mat4x3',
        'mat4x4',
        'vec2',
        'vec3',
        'vec4',
        'ivec2',
        'ivec3',
        'ivec4',
        'bvec2',
        'bvec3',
        'bvec4',
        'uint',
        'uvec2',
        'uvec3',
        'uvec4',
        'lowp',
        'mediump',
        'highp',
        'precision',
        'sampler1D',
        'sampler2D',
        'sampler3D',
        'samplerCube',
        'sampler1DShadow',
        'sampler2DShadow',
        'samplerCubeShadow',
        'sampler1DArray',
        'sampler2DArray',
        'sampler1DArrayShadow',
        'sampler2DArrayShadow',
        'isampler1D',
        'isampler2D',
        'isampler3D',
        'isamplerCube',
        'isampler1DArray',
        'isampler2DArray',
        'usampler1D',
        'usampler2D',
        'usampler3D',
        'usamplerCube',
        'usampler1DArray',
        'usampler2DArray',
        'struct',
      ];

      // 内置函数
      const builtins = [
        'abs',
        'acos',
        'acosh',
        'asin',
        'asinh',
        'atan',
        'atanh',
        'ceil',
        'clamp',
        'cos',
        'cosh',
        'cross',
        'degrees',
        'dFdx',
        'dFdy',
        'distance',
        'dot',
        'equal',
        'exp',
        'exp2',
        'faceforward',
        'floor',
        'fract',
        'ftransform',
        'fwidth',
        'greaterThan',
        'greaterThanEqual',
        'inversesqrt',
        'length',
        'lessThan',
        'lessThanEqual',
        'log',
        'log2',
        'matrixCompMult',
        'max',
        'min',
        'mix',
        'mod',
        'normalize',
        'not',
        'notEqual',
        'pow',
        'radians',
        'reflect',
        'refract',
        'shadow1D',
        'shadow1DLod',
        'shadow1DProj',
        'shadow1DProjLod',
        'shadow2D',
        'shadow2DLod',
        'shadow2DProj',
        'shadow2DProjLod',
        'sign',
        'sin',
        'sinh',
        'smoothstep',
        'sqrt',
        'step',
        'tan',
        'tanh',
        'texture1D',
        'texture1DLod',
        'texture1DProj',
        'texture1DProjLod',
        'texture2D',
        'texture2DLod',
        'texture2DProj',
        'texture2DProjLod',
        'texture3D',
        'texture3DLod',
        'texture3DProj',
        'texture3DProjLod',
        'textureCube',
        'textureCubeLod',
        'transpose',
      ];

      // 内置变量
      const builtin_variables = [
        'gl_BackColor',
        'gl_BackLightModelProduct',
        'gl_BackLightProduct',
        'gl_BackMaterial',
        'gl_BackSecondaryColor',
        'gl_ClipPlane',
        'gl_ClipVertex',
        'gl_Color',
        'gl_DepthRange',
        'gl_DepthRangeParameters',
        'gl_EyePlaneQ',
        'gl_EyePlaneR',
        'gl_EyePlaneS',
        'gl_EyePlaneT',
        'gl_Fog',
        'gl_FogCoord',
        'gl_FogFragCoord',
        'gl_FogParameters',
        'gl_FragColor',
        'gl_FragCoord',
        'gl_FragData',
        'gl_FragDepth',
        'gl_FrontColor',
        'gl_FrontFacing',
        'gl_FrontLightModelProduct',
        'gl_FrontLightProduct',
        'gl_FrontMaterial',
        'gl_FrontSecondaryColor',
        'gl_LightModel',
        'gl_LightModelParameters',
        'gl_LightModelProducts',
        'gl_LightProducts',
        'gl_LightSource',
        'gl_LightSourceParameters',
        'gl_MaterialParameters',
        'gl_MaxClipPlanes',
        'gl_MaxCombinedTextureImageUnits',
        'gl_MaxDrawBuffers',
        'gl_MaxFragmentUniformComponents',
        'gl_MaxLights',
        'gl_MaxTextureCoords',
        'gl_MaxTextureImageUnits',
        'gl_MaxTextureUnits',
        'gl_MaxVaryingFloats',
        'gl_MaxVertexAttribs',
        'gl_MaxVertexTextureImageUnits',
        'gl_MaxVertexUniformComponents',
        'gl_ModelViewMatrix',
        'gl_ModelViewMatrixInverse',
        'gl_ModelViewMatrixInverseTranspose',
        'gl_ModelViewMatrixTranspose',
        'gl_ModelViewProjectionMatrix',
        'gl_ModelViewProjectionMatrixInverse',
        'gl_ModelViewProjectionMatrixInverseTranspose',
        'gl_ModelViewProjectionMatrixTranspose',
        'gl_MultiTexCoord0',
        'gl_MultiTexCoord1',
        'gl_MultiTexCoord2',
        'gl_MultiTexCoord3',
        'gl_MultiTexCoord4',
        'gl_MultiTexCoord5',
        'gl_MultiTexCoord6',
        'gl_MultiTexCoord7',
        'gl_Normal',
        'gl_NormalMatrix',
        'gl_NormalScale',
        'gl_ObjectPlaneQ',
        'gl_ObjectPlaneR',
        'gl_ObjectPlaneS',
        'gl_ObjectPlaneT',
        'gl_Point',
        'gl_PointParameters',
        'gl_PointSize',
        'gl_Position',
        'gl_ProjectionMatrix',
        'gl_ProjectionMatrixInverse',
        'gl_ProjectionMatrixInverseTranspose',
        'gl_ProjectionMatrixTranspose',
        'gl_SecondaryColor',
        'gl_TexCoord',
        'gl_TextureEnvColor',
        'gl_TextureMatrix',
        'gl_TextureMatrixInverse',
        'gl_TextureMatrixInverseTranspose',
        'gl_TextureMatrixTranspose',
        'gl_Vertex',
        'gl_VertexID',
      ];

      // 匹配保留字
      if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
        const word = stream.current();
        if (keywords.includes(word)) return 'keyword';
        if (builtins.includes(word)) return 'builtin';
        if (builtin_variables.includes(word)) return 'variable-3';
        return 'variable';
      }

      // 匹配运算符和标点符号
      if (stream.match(/^[+\-*\/=<>!&|^~?:%]/)) {
        return 'operator';
      }

      // 匹配括号
      if (stream.match(/^[{}()\[\]]/)) {
        return 'bracket';
      }

      // 匹配分号或逗号
      if (stream.match(/^[;,]/)) {
        return 'punctuation';
      }

      // 跳过不匹配的字符
      stream.next();
      return null;
    },
    indent: function () {
      return 0;
    },
  });

    // 处理注释的辅助函数
  function tokenComment(stream: any, state: any) {
    let maybeEnd = false,
      ch;
    while ((ch = stream.next())) {
      if (ch === '/' && maybeEnd) {
        state.tokenize = null;
        break;
      }
      maybeEnd = ch === '*';
    }
    return 'comment';
  }

  // 处理字符串的辅助函数
  function tokenString(stream: any, state: any) {
    let escaped = false,
      ch;
    while ((ch = stream.next()) != null) {
      if (ch === '"' && !escaped) {
        state.tokenize = null;
        break;
      }
      escaped = !escaped && ch === '\\';
    }
    return 'string';
  }
}

// 导出 GLSL 语言支持对象
export function glslLanguage() {
  return new LanguageSupport(glsl());
}
