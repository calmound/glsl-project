# 坐标变换

## 学习目标

通过本教程，你将学会：
- 理解2D坐标变换的基本原理
- 掌握旋转矩阵的构造和应用
- 学习缩放变换的实现方法
- 了解如何组合多种变换创建复杂效果
- 掌握重复图案的生成技巧

## 核心概念

### 坐标变换（Coordinate Transformation）
坐标变换是计算机图形学中的基础概念，它允许我们改变几何图形的位置、大小、方向和形状。

### 旋转变换（Rotation）
旋转变换使用旋转矩阵来改变点的方向：
```glsl
// 2D旋转矩阵
mat2 rotation = mat2(cos(angle), -sin(angle),
                     sin(angle),  cos(angle));
vec2 rotated = rotation * point;
```

### 缩放变换（Scaling）
缩放变换改变图形的大小：
```glsl
vec2 scaled = point * scale;
```

## 逐步实现

### 步骤1：坐标归一化
```glsl
// 获取归一化坐标
vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
```

### 步骤2：移动原点到中心
```glsl
// 将坐标原点移到屏幕中心
vec2 centered = uv - vec2(0.5, 0.5);
```

### 步骤3：应用旋转变换
```glsl
// 创建旋转矩阵
float angle = u_time;
float cosA = cos(angle);
float sinA = sin(angle);

// 应用旋转
vec2 rotated = vec2(
    centered.x * cosA - centered.y * sinA,
    centered.x * sinA + centered.y * cosA
);
```

### 步骤4：应用缩放变换
```glsl
// 动态缩放因子
float scale = 1.0 + sin(u_time * 2.0) * 0.5;
vec2 scaled = rotated * scale;
```

### 步骤5：创建重复图案
```glsl
// 使用fract函数创建重复效果
vec2 repeated = fract(scaled * 3.0);
```

## 练习任务

1. **中心坐标**：填写正确的中心点坐标
2. **旋转矩阵**：完成sin和cos值的填写
3. **缩放因子**：设置合适的缩放因子
4. **重复图案**：创建网格重复效果
5. **颜色混合**：根据变换结果设置颜色

## 高级扩展

### 复合变换
组合多种变换创建复杂效果：
```glsl
// 先缩放，再旋转，最后平移
vec2 transformed = rotate(scale(translate(uv)));
```

### 非线性变换
使用数学函数创建非线性变换：
```glsl
// 波浪变形
vec2 wave = uv + sin(uv.y * 10.0 + u_time) * 0.1;
```

### 极坐标变换
转换到极坐标系统：
```glsl
float radius = length(uv - 0.5);
float angle = atan(uv.y - 0.5, uv.x - 0.5);
```

## 常见问题

1. **变换顺序**：变换的应用顺序会影响最终结果
2. **坐标范围**：确保变换后的坐标在合理范围内
3. **性能优化**：避免在片段着色器中进行复杂的矩阵运算

## 下一步学习

掌握坐标变换后，你可以探索：
- 3D变换和投影
- 复杂的几何变形
- 程序化动画
- 交互式变换效果