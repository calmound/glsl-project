# 渐变效果

## 学习目标

通过本教程，你将学会：
- 理解线性插值在图形编程中的重要作用
- 掌握各种渐变类型的实现方法
- 学习颜色空间和颜色混合的基础知识
- 了解如何创建复杂的渐变效果

## 核心概念

### 线性插值（Linear Interpolation）
线性插值是在两个值之间平滑过渡的数学方法。在图形学中，它用于创建颜色、位置、大小等属性的平滑变化。

### 渐变的数学原理
渐变本质上是一个映射函数，将空间位置映射到颜色值：
```
color = f(position)
```

### 归一化坐标的作用
在渐变中，我们通常使用归一化坐标（0.0到1.0）作为插值参数，这样可以轻松控制渐变的方向和范围。

## 相关函数和语法

### 插值函数
```glsl
// 线性插值 - 最基础的插值函数
vec3 mix(vec3 a, vec3 b, float t);
float mix(float a, float b, float t);

// 平滑插值 - 使用三次曲线
float smoothstep(float edge0, float edge1, float x);

// 阶跃函数 - 硬切换
float step(float edge, float x);
```

### 数学函数
```glsl
// 限制值在指定范围内
float clamp(float x, float minVal, float maxVal);
vec3 clamp(vec3 x, vec3 minVal, vec3 maxVal);

// 取小数部分
float fract(float x);

// 绝对值
float abs(float x);

// 最大值和最小值
float max(float a, float b);
float min(float a, float b);
```

### 三角函数（用于复杂渐变）
```glsl
float sin(float x);  // 正弦
float cos(float x);  // 余弦
float atan(float y, float x);  // 反正切（用于角度计算）
```

## 代码解析

在练习代码中，你需要完成以下任务：

1. **获取归一化坐标**：
   ```glsl
   vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
   ```

2. **创建水平渐变**：
   ```glsl
   // 使用X坐标作为插值参数
   float t = uv.x;  // 从0.0（左）到1.0（右）
   vec3 color1 = vec3(1.0, 0.0, 0.0);  // 红色
   vec3 color2 = vec3(0.0, 0.0, 1.0);  // 蓝色
   vec3 color = mix(color1, color2, t);
   ```

3. **创建垂直渐变**：
   ```glsl
   // 使用Y坐标作为插值参数
   float t = uv.y;  // 从0.0（下）到1.0（上）
   vec3 color = mix(color1, color2, t);
   ```

4. **创建径向渐变**：
   ```glsl
   vec2 center = vec2(0.5, 0.5);
   float dist = distance(uv, center);
   float t = clamp(dist / 0.5, 0.0, 1.0);  // 归一化距离
   vec3 color = mix(color1, color2, t);
   ```

## 渐变类型详解

### 线性渐变

#### 水平渐变
```glsl
// 从左到右的渐变
float t = uv.x;
vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), t);

// 反向渐变（从右到左）
float t = 1.0 - uv.x;
vec3 color = mix(color1, color2, t);
```

#### 垂直渐变
```glsl
// 从下到上的渐变
float t = uv.y;
vec3 color = mix(color1, color2, t);

// 从上到下的渐变
float t = 1.0 - uv.y;
vec3 color = mix(color1, color2, t);
```

#### 对角线渐变
```glsl
// 从左下到右上
float t = (uv.x + uv.y) * 0.5;
vec3 color = mix(color1, color2, t);

// 从左上到右下
float t = (uv.x + (1.0 - uv.y)) * 0.5;
vec3 color = mix(color1, color2, t);
```

### 径向渐变

#### 圆形径向渐变
```glsl
vec2 center = vec2(0.5, 0.5);
float dist = distance(uv, center);
float maxDist = 0.7;  // 最大半径
float t = clamp(dist / maxDist, 0.0, 1.0);
vec3 color = mix(color1, color2, t);
```

#### 椭圆径向渐变
```glsl
vec2 center = vec2(0.5, 0.5);
vec2 offset = (uv - center);
offset.x *= 2.0;  // X方向拉伸
float dist = length(offset);
float t = clamp(dist / 0.5, 0.0, 1.0);
vec3 color = mix(color1, color2, t);
```

### 角度渐变（圆锥渐变）
```glsl
vec2 center = vec2(0.5, 0.5);
vec2 offset = uv - center;
float angle = atan(offset.y, offset.x);  // 计算角度
angle = (angle + 3.14159) / (2.0 * 3.14159);  // 归一化到[0,1]
vec3 color = mix(color1, color2, angle);
```

## 高级渐变技巧

### 多色渐变
```glsl
// 三色渐变
float t = uv.x;
vec3 color;
if (t < 0.5) {
    // 前半段：红到绿
    color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), t * 2.0);
} else {
    // 后半段：绿到蓝
    color = mix(vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0), (t - 0.5) * 2.0);
}

// 或者使用smoothstep组合
vec3 red = vec3(1.0, 0.0, 0.0);
vec3 green = vec3(0.0, 1.0, 0.0);
vec3 blue = vec3(0.0, 0.0, 1.0);

float t1 = smoothstep(0.0, 0.5, t);
float t2 = smoothstep(0.5, 1.0, t);

vec3 color = mix(red, green, t1);
color = mix(color, blue, t2);
```

### 非线性渐变
```glsl
// 使用数学函数改变渐变曲线
float t = uv.x;

// 二次曲线
t = t * t;

// 平滑曲线
t = smoothstep(0.0, 1.0, t);

// 正弦波渐变
t = sin(t * 3.14159 * 0.5);

vec3 color = mix(color1, color2, t);
```

### 重复渐变
```glsl
// 创建重复的渐变条纹
float t = uv.x * 5.0;  // 重复5次
t = fract(t);  // 取小数部分，创建重复
vec3 color = mix(color1, color2, t);

// 来回渐变
t = abs(fract(t) - 0.5) * 2.0;
vec3 color = mix(color1, color2, t);
```

## 颜色空间和混合

### RGB颜色混合
```glsl
// 标准线性插值
vec3 color = mix(color1, color2, t);

// 分量独立混合
vec3 color;
color.r = mix(color1.r, color2.r, t);
color.g = mix(color1.g, color2.g, t);
color.b = mix(color1.b, color2.b, t);
```

### HSV颜色空间渐变
```glsl
// HSV到RGB的转换函数（简化版）
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// 色相渐变
float hue = uv.x;  // 色相从0到1
vec3 color = hsv2rgb(vec3(hue, 1.0, 1.0));
```

## 性能优化

### 避免条件分支
```glsl
// 慢：使用if语句
if (t < 0.5) {
    color = mix(color1, color2, t * 2.0);
} else {
    color = mix(color2, color3, (t - 0.5) * 2.0);
}

// 快：使用数学函数
float t1 = clamp(t * 2.0, 0.0, 1.0);
float t2 = clamp((t - 0.5) * 2.0, 0.0, 1.0);
vec3 color = mix(color1, color2, t1);
color = mix(color, color3, t2);
```

### 预计算常量
```glsl
// 将常量计算移到外部
const float PI = 3.14159265359;
const float TWO_PI = 6.28318530718;
const vec3 RED = vec3(1.0, 0.0, 0.0);
const vec3 BLUE = vec3(0.0, 0.0, 1.0);
```

## 实践提示

- **插值参数范围**：确保插值参数在[0.0, 1.0]范围内
- **颜色空间选择**：RGB适合大多数情况，HSV适合色相变化
- **性能考虑**：避免复杂的条件分支，优先使用数学函数
- **视觉效果**：使用`smoothstep`可以创建更自然的过渡

## 常见应用场景

### UI设计
```glsl
// 按钮背景渐变
float t = uv.y;
vec3 topColor = vec3(0.8, 0.9, 1.0);
vec3 bottomColor = vec3(0.6, 0.7, 0.9);
vec3 color = mix(bottomColor, topColor, t);
```

### 天空盒渐变
```glsl
// 天空从地平线到天顶的渐变
float t = uv.y;
vec3 horizonColor = vec3(1.0, 0.8, 0.6);  // 橙色地平线
vec3 zenithColor = vec3(0.3, 0.6, 1.0);   // 蓝色天顶
vec3 skyColor = mix(horizonColor, zenithColor, t);
```

### 热力图效果
```glsl
// 温度可视化
float temperature = /* 某个值 */;
vec3 cold = vec3(0.0, 0.0, 1.0);    // 蓝色（冷）
vec3 warm = vec3(1.0, 1.0, 0.0);    // 黄色（温）
vec3 hot = vec3(1.0, 0.0, 0.0);     // 红色（热）

vec3 color;
if (temperature < 0.5) {
    color = mix(cold, warm, temperature * 2.0);
} else {
    color = mix(warm, hot, (temperature - 0.5) * 2.0);
}
```

## 扩展思考

完成基础练习后，可以尝试：
1. 创建彩虹渐变效果
2. 实现动态渐变动画
3. 结合噪声函数创建有机渐变
4. 制作金属质感的渐变
5. 创建多层渐变叠加效果
6. 实现渐变遮罩和混合模式

## 数学背景

### 线性插值公式
```
result = a + t * (b - a)
其中 t ∈ [0, 1]
当 t = 0 时，result = a
当 t = 1 时，result = b
```

### 双线性插值
用于二维渐变：
```
result = mix(mix(a, b, tx), mix(c, d, tx), ty)
```

### 贝塞尔曲线插值
用于更复杂的过渡曲线：
```
B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
```

通过掌握渐变效果，你将理解颜色插值和空间映射的基本原理，这是创建丰富视觉效果的重要基础。