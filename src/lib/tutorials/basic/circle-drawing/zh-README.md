# 圆形绘制

## 学习目标

通过本教程，你将学会：
- 理解距离函数在图形绘制中的核心作用
- 掌握欧几里得距离的计算方法
- 学习如何使用距离判断点与圆的位置关系
- 了解平滑边缘和抗锯齿的基本原理

## 核心概念

### 距离函数（Distance Function）
距离函数是着色器编程中最重要的概念之一。它计算空间中任意一点到某个几何形状的最短距离。对于圆形，我们使用欧几里得距离。

### 圆的数学定义
一个圆可以通过以下参数定义：
- **圆心位置**：`vec2 center`
- **半径**：`float radius`
- **距离判断**：点到圆心的距离 ≤ 半径时，点在圆内

### 欧几里得距离公式
```glsl
// 二维空间中两点间的距离
float distance = sqrt((x2-x1)² + (y2-y1)²)

// 在GLSL中
float dist = distance(point1, point2);
// 或者手动计算
float dist = length(point1 - point2);
```

## 相关函数和语法

### 距离和长度函数
```glsl
// 计算两点间距离
float distance(vec2 p1, vec2 p2);

// 计算向量长度（从原点到该点的距离）
float length(vec2 v);

// 手动计算距离
float sqrt(float x);  // 平方根
float dot(vec2 a, vec2 b);  // 点积
```

### 向量运算
```glsl
vec2 a = vec2(1.0, 2.0);
vec2 b = vec2(3.0, 4.0);

vec2 diff = a - b;        // 向量减法
float len = length(diff); // 向量长度
float dist = distance(a, b); // 等价于 length(a - b)
```

### 平滑函数
```glsl
// 平滑阶跃函数，用于抗锯齿
float smoothstep(float edge0, float edge1, float x);

// 普通阶跃函数
float step(float edge, float x);
```

### 数学函数
```glsl
float pow(float x, float y);  // x的y次方
float sqrt(float x);          // 平方根
float abs(float x);           // 绝对值
```

## 代码解析

在练习代码中，你需要完成以下任务：

1. **获取归一化坐标**：
   ```glsl
   vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
   ```

2. **定义圆的参数**：
   ```glsl
   vec2 center = vec2(0.5, 0.5);  // 圆心在屏幕中央
   float radius = 0.3;            // 半径为30%屏幕宽度
   ```

3. **计算点到圆心的距离**：
   ```glsl
   float dist = distance(uv, center);
   // 或者等价的写法
   float dist = length(uv - center);
   ```

4. **判断点是否在圆内**：
   ```glsl
   bool insideCircle = dist < radius;
   ```

5. **设置颜色**：
   ```glsl
   vec3 color;
   if (insideCircle) {
       color = vec3(1.0, 1.0, 1.0);  // 白色
   } else {
       color = vec3(0.0, 0.0, 0.0);  // 黑色
   }
   ```

## 圆形绘制原理

### 距离计算详解
```glsl
// 方法1：使用内置函数
float dist = distance(uv, center);

// 方法2：使用向量长度
vec2 offset = uv - center;
float dist = length(offset);

// 方法3：手动计算
vec2 diff = uv - center;
float dist = sqrt(diff.x * diff.x + diff.y * diff.y);

// 方法4：使用点积（避免开方，性能更好）
vec2 diff = uv - center;
float distSquared = dot(diff, diff);
float radiusSquared = radius * radius;
bool inside = distSquared < radiusSquared;
```

### 边缘处理方式

#### 硬边缘（锯齿状）
```glsl
float circle = step(dist, radius);
vec3 color = vec3(circle);
```

#### 软边缘（平滑抗锯齿）
```glsl
float edge = 0.01;  // 边缘宽度
float circle = smoothstep(radius, radius - edge, dist);
vec3 color = vec3(circle);
```

#### 渐变边缘
```glsl
// 从圆心到边缘的渐变
float gradient = 1.0 - (dist / radius);
gradient = max(0.0, gradient);  // 限制在[0,1]范围
vec3 color = vec3(gradient);
```

### 多种圆形效果

#### 空心圆（圆环）
```glsl
float outerRadius = 0.3;
float innerRadius = 0.2;
bool ring = (dist > innerRadius) && (dist < outerRadius);
```

#### 多个圆
```glsl
vec2 center1 = vec2(0.3, 0.5);
vec2 center2 = vec2(0.7, 0.5);
float dist1 = distance(uv, center1);
float dist2 = distance(uv, center2);
bool anyCircle = (dist1 < radius) || (dist2 < radius);
```

#### 椭圆
```glsl
vec2 offset = uv - center;
offset.x /= 1.5;  // X方向拉伸
float dist = length(offset);
bool ellipse = dist < radius;
```

## 性能优化技巧

### 避免开方运算
```glsl
// 慢：使用开方
float dist = sqrt(dx*dx + dy*dy);
bool inside = dist < radius;

// 快：比较平方值
float distSq = dx*dx + dy*dy;
float radiusSq = radius * radius;
bool inside = distSq < radiusSq;
```

### 早期退出优化
```glsl
// 先检查边界框，减少不必要的距离计算
vec2 offset = abs(uv - center);
if (offset.x > radius || offset.y > radius) {
    // 肯定在圆外
    color = vec3(0.0);
} else {
    // 再进行精确的距离计算
    float dist = length(uv - center);
    // ...
}
```

## 实践提示

- **坐标系理解**：确保理解归一化坐标系统
- **半径单位**：半径使用相对单位（0.0-1.0），便于适配不同分辨率
- **性能考虑**：对于简单判断，比较距离平方可以避免开方运算
- **边缘质量**：使用`smoothstep`可以获得更好的抗锯齿效果

## 常见变体

### 动态圆形
```glsl
// 脉动效果
float time = /* 时间变量 */;
float dynamicRadius = radius + 0.1 * sin(time * 2.0);

// 移动圆心
vec2 dynamicCenter = center + 0.1 * vec2(cos(time), sin(time));
```

### 距离场可视化
```glsl
// 显示距离场
float dist = distance(uv, center);
float normalized = dist / radius;
vec3 color = vec3(normalized);
```

### 多层圆环
```glsl
float dist = distance(uv, center);
float rings = fract(dist * 10.0);  // 创建重复的环
vec3 color = vec3(rings);
```

## 扩展思考

完成基础练习后，可以尝试：
1. 创建多个不同大小和颜色的圆
2. 制作圆环和同心圆效果
3. 实现椭圆和变形圆
4. 添加动画效果（脉动、移动、旋转）
5. 结合噪声函数创建有机形状
6. 使用距离场创建复杂的图案

## 数学背景

### 欧几里得距离
在二维平面上，点P(x₁,y₁)到点Q(x₂,y₂)的欧几里得距离为：
```
d = √[(x₂-x₁)² + (y₂-y₁)²]
```

### 单位圆
以原点为圆心，半径为1的圆称为单位圆，其方程为：
```
x² + y² = 1
```

### 距离场的概念
距离场是一个函数，它为空间中的每个点分配一个值，表示该点到最近表面的距离。这是现代图形学中非常重要的概念。

通过掌握圆形绘制，你将理解距离函数的强大功能，这是创建复杂几何形状和特效的基础。