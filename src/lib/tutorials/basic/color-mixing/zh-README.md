# 颜色混合

## 学习目标

通过本教程，你将学会：
- 理解颜色混合的基本原理
- 掌握`mix()`函数的使用方法
- 学习如何使用坐标创建渐变效果
- 了解`gl_FragCoord`和坐标归一化的概念

## 核心概念

### 颜色混合（Color Mixing）
颜色混合是计算机图形学中的基础概念，它允许我们在两种或多种颜色之间创建平滑的过渡效果。在GLSL中，我们可以使用数学函数来实现各种混合效果。

### gl_FragCoord 内置变量
`gl_FragCoord` 是GLSL的内置变量，包含当前片段在屏幕空间中的坐标：
- `gl_FragCoord.x`：当前像素的X坐标（以像素为单位）
- `gl_FragCoord.y`：当前像素的Y坐标（以像素为单位）
- 坐标原点(0,0)位于屏幕左下角

### 坐标归一化
为了创建与分辨率无关的效果，我们通常将像素坐标归一化到[0.0, 1.0]范围：
```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
```
这样，无论屏幕大小如何，左下角始终是(0,0)，右上角始终是(1,1)。

## 相关函数和语法

### mix() 函数
`mix()`是GLSL中最重要的混合函数：
```glsl
mix(a, b, t)
```
- **a**：起始值
- **b**：结束值  
- **t**：混合因子（0.0到1.0）

**工作原理**：
- 当 `t = 0.0` 时，返回 `a`
- 当 `t = 1.0` 时，返回 `b`
- 当 `t = 0.5` 时，返回 `a` 和 `b` 的中间值
- 数学公式：`result = a * (1.0 - t) + b * t`

### vec3 颜色向量
```glsl
vec3 color = vec3(r, g, b);  // 创建RGB颜色
vec3 red = vec3(1.0, 0.0, 0.0);
vec3 blue = vec3(0.0, 0.0, 1.0);
```

### 常用颜色定义
```glsl
vec3 red = vec3(1.0, 0.0, 0.0);
vec3 green = vec3(0.0, 1.0, 0.0);
vec3 blue = vec3(0.0, 0.0, 1.0);
vec3 yellow = vec3(1.0, 1.0, 0.0);
vec3 magenta = vec3(1.0, 0.0, 1.0);
vec3 cyan = vec3(0.0, 1.0, 1.0);
vec3 white = vec3(1.0, 1.0, 1.0);
vec3 black = vec3(0.0, 0.0, 0.0);
```

## 代码解析

在练习代码中，你需要完成以下任务：

1. **获取归一化坐标**：
   ```glsl
   vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
   ```
   这里假设画布大小为300x300像素。

2. **定义颜色**：
   ```glsl
   vec3 redColor = vec3(1.0, 0.0, 0.0);   // 纯红色
   vec3 blueColor = vec3(0.0, 0.0, 1.0);  // 纯蓝色
   ```

3. **使用mix函数混合**：
   ```glsl
   vec3 finalColor = mix(redColor, blueColor, uv.x);
   ```
   - `uv.x` 作为混合因子，从左到右变化（0.0到1.0）
   - 左边（uv.x=0.0）显示红色
   - 右边（uv.x=1.0）显示蓝色
   - 中间区域显示红蓝混合的紫色

## 渐变效果原理

### 水平渐变
使用 `uv.x` 作为混合因子创建从左到右的渐变：
```glsl
vec3 gradient = mix(colorA, colorB, uv.x);
```

### 垂直渐变
使用 `uv.y` 作为混合因子创建从下到上的渐变：
```glsl
vec3 gradient = mix(colorA, colorB, uv.y);
```

### 对角渐变
使用坐标的组合创建对角渐变：
```glsl
float diagonal = (uv.x + uv.y) * 0.5;
vec3 gradient = mix(colorA, colorB, diagonal);
```

## 实践提示

- **混合因子的范围**：确保混合因子在[0.0, 1.0]范围内，超出范围会被自动截断
- **颜色空间**：RGB颜色混合是线性的，但视觉效果可能不够自然
- **多重混合**：可以嵌套使用mix函数创建复杂的颜色过渡
- **实验不同方向**：尝试使用不同的坐标分量创建各种方向的渐变

## 扩展思考

完成基础练习后，可以尝试：
1. 创建垂直渐变（红色到绿色）
2. 使用三种颜色创建更复杂的渐变
3. 结合数学函数（如sin、cos）创建波浪形渐变
4. 使用距离函数创建径向渐变

通过掌握颜色混合，你将能够创建丰富多彩的视觉效果，这是许多高级着色器技术的基础。