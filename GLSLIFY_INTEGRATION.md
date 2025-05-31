# Glslify 集成指南

本项目已成功集成 Glslify 模块系统，为 GLSL 着色器开发提供模块化支持。

## 🚀 新增功能

### 1. Glslify 模块支持
- 支持使用 `#pragma glslify:` 指令导入模块
- 自动处理模块依赖关系
- 支持社区 GLSL 模块生态

### 2. 增强的语法验证
- 验证 glslify pragma 指令语法
- 检查模块导入和使用情况
- 提供详细的错误提示

### 3. 新增示例
- 噪声地形生成示例
- 旋转图形动画示例
- 缓动动画效果示例

## 📦 已安装的模块

### 核心模块
- `glslify` - 核心模块系统
- `glslify-loader` - Webpack 加载器
- `raw-loader` - 原始文件加载器

### GLSL 功能模块
- `glsl-noise` - 噪声函数库
- `glsl-hsl2rgb` - HSL 到 RGB 颜色转换
- `glsl-rotate` - 旋转变换函数
- `glsl-easings` - 缓动函数库

## 🛠️ 配置说明

### Next.js 配置
在 `next.config.ts` 中已配置 Webpack 支持：
```typescript
webpack: (config) => {
  config.module.rules.push({
    test: /\.(glsl|vs|fs|vert|frag)$/,
    use: [
      {
        loader: 'glslify-loader',
        options: {
          transform: [
            ['glslify-hex', { 'option-1': true, 'option-2': 42 }]
          ]
        }
      },
      {
        loader: 'raw-loader'
      }
    ]
  });
  return config;
}
```

### 语法验证增强
在 `page.tsx` 中的 `validateGLSLSyntax` 函数已更新：
- 支持 pragma 指令验证
- 检查模块使用情况
- 提供更准确的错误信息

## 📝 使用示例

### 基本用法
```glsl
precision mediump float;

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
}
```

### 自定义模块
创建 `src/lib/glsl/` 目录下的模块文件：

**noise.glsl**
```glsl
#pragma glslify: export(noise)

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}
```

**使用自定义模块**
```glsl
#pragma glslify: noise = require('./lib/glsl/noise.glsl')

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float n = noise(uv);
  gl_FragColor = vec4(vec3(n), 1.0);
}
```

## 🎯 新增页面

### Glslify 指南页面
访问 `/glslify-guide` 查看完整的使用指南，包括：
- 基本语法说明
- 常用模块推荐
- 最佳实践建议
- 代码示例

## 🔧 开发建议

### 1. 模块组织
- 将常用功能提取为独立模块
- 使用描述性的模块名称
- 为模块编写清晰的文档

### 2. 性能优化
- 只导入需要的模块
- 避免重复导入相同功能
- 考虑模块的计算复杂度

### 3. 错误处理
- 利用增强的语法验证功能
- 注意模块版本兼容性
- 测试模块在不同设备上的表现

## 🚀 下一步计划

1. **扩展模块库**
   - 添加更多自定义模块
   - 创建项目专用的模块集合

2. **教学内容**
   - 创建模块化开发教程
   - 添加进阶示例

3. **工具改进**
   - 模块依赖可视化
   - 自动代码补全
   - 模块性能分析

## 📚 参考资源

- [Glslify 官方文档](https://github.com/glslify/glslify)
- [GLSL 模块生态](https://www.npmjs.com/search?q=glsl)
- [WebGL 最佳实践](https://webglfundamentals.org/)

---

通过 Glslify 集成，本项目现在支持现代化的 GLSL 开发工作流，为学习者提供了更好的代码组织和复用能力。