# 简单分形

## 学习目标
- 理解分形的基本概念：自相似和递归
- 学习使用循环创建重复图案
- 掌握 `fract()` 函数的应用
- 了解坐标变换和缩放技巧

## 核心概念

### 分形基础
分形是具有自相似性的几何图形，即部分与整体相似。在着色器中，我们通过重复和缩放来模拟这种效果。

### fract() 函数
```glsl
float f = fract(x);  // 返回 x 的小数部分
vec2 f = fract(uv);  // 对向量的每个分量取小数部分

// fract(2.7) = 0.7
// fract(-1.3) = 0.7  (注意：结果总是正数)
```

### 重复图案创建
```glsl
// 基本重复
vec2 repeated = fract(uv * scale) - 0.5;
// scale 控制重复的密度
// 减去 0.5 将范围从 [0,1] 转换为 [-0.5, 0.5]
```

### 分形循环结构
```glsl
vec2 pos = uv;
float pattern = 0.0;

for (int i = 0; i < iterations; i++) {
    pos *= 2.0;                    // 缩放
    pos = fract(pos) - 0.5;        // 重复
    
    float shape = createShape(pos); // 创建基本形状
    pattern += shape / pow(2.0, float(i + 1)); // 累加，权重递减
}
```

### 权重递减
```glsl
// 每一层的贡献逐渐减少
float weight = 1.0 / pow(2.0, float(i + 1));
// i=0: weight = 0.5
// i=1: weight = 0.25
// i=2: weight = 0.125
// ...
```

### 基本形状函数
```glsl
// 圆形
float circle = 1.0 - smoothstep(0.1, 0.3, length(pos));

// 方形
float square = 1.0 - smoothstep(0.1, 0.3, max(abs(pos.x), abs(pos.y)));

// 菱形
float diamond = 1.0 - smoothstep(0.1, 0.3, abs(pos.x) + abs(pos.y));
```

## 分形变体

### 1. 旋转分形
```glsl
float angle = float(i) * 0.5;
mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
pos = rotation * pos;
```

### 2. 动态分形
```glsl
float timeOffset = u_time * 0.1;
pos *= 2.0 + 0.5 * sin(u_time + float(i));
```

### 3. 颜色分形
```glsl
vec3 layerColor = vec3(
    0.5 + 0.5 * sin(float(i) + u_time),
    0.5 + 0.5 * sin(float(i) + u_time + 2.0),
    0.5 + 0.5 * sin(float(i) + u_time + 4.0)
);
color += layerColor * shape * weight;
```

## 应用场景
- 自然纹理模拟（云朵、山脉、树木）
- 装饰性图案
- 程序化纹理生成
- 艺术效果
- 无限缩放背景

## 练习建议
1. 修改循环次数，观察细节变化
2. 尝试不同的基本形状
3. 调整缩放因子（不一定是 2.0）
4. 添加旋转效果
5. 实验不同的颜色映射
6. 创建动态分形动画
7. 组合多种形状

## 性能注意事项
- 循环次数影响性能，通常 3-6 次足够
- 避免过于复杂的形状函数
- 在移动设备上要特别注意性能

## 扩展学习
```glsl
// Mandelbrot 集合（简化版）
vec2 c = uv;
vec2 z = vec2(0.0);
float iterations = 0.0;

for (int i = 0; i < 50; i++) {
    if (length(z) > 2.0) break;
    z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
    iterations += 1.0;
}

float color = iterations / 50.0;
```

## 相关函数
- `fract()` - 小数部分
- `pow()` - 幂运算
- `length()` - 向量长度
- `max()` / `min()` - 最值函数
- `abs()` - 绝对值