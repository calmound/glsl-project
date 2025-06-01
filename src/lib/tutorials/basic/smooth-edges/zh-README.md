# 平滑边缘

## 学习目标
- 理解 `smoothstep()` 函数的工作原理
- 学习创建平滑的边缘过渡效果
- 对比 `step()` 和 `smoothstep()` 的区别
- 掌握边缘控制技巧

## 核心概念

### smoothstep() 函数
```glsl
smoothstep(edge0, edge1, x)
```
- `edge0` - 过渡开始位置
- `edge1` - 过渡结束位置
- `x` - 输入值
- 在 edge0 和 edge1 之间创建平滑的 S 型曲线过渡
- 当 x < edge0 时返回 0.0
- 当 x > edge1 时返回 1.0
- 当 edge0 < x < edge1 时返回平滑插值

### step() vs smoothstep()
```glsl
// 硬边缘（突然变化）
float hard = step(0.5, x);

// 平滑边缘（渐变过渡）
float smooth = smoothstep(0.4, 0.6, x);
```

### 边缘宽度控制
```glsl
float radius = 0.5;
float edgeWidth = 0.1; // 边缘宽度

float edge0 = radius - edgeWidth;
float edge1 = radius + edgeWidth;
float mask = smoothstep(edge0, edge1, distance);
```

### 反向平滑
```glsl
// 从 1.0 到 0.0 的平滑过渡
float inverseMask = 1.0 - smoothstep(edge0, edge1, distance);
```

## 应用场景
- 抗锯齿效果
- 柔和的图形边缘
- 渐变遮罩
- 光晕效果
- UI 元素的柔和边框

## 练习建议
1. 调整 edge0 和 edge1 的值，观察边缘变化
2. 尝试创建不同形状的平滑边缘
3. 使用 mix 函数结合 smoothstep 创建颜色过渡
4. 对比 step 和 smoothstep 的视觉效果
5. 创建多层平滑边缘效果

## 相关函数
- `smoothstep()` - 平滑阶跃函数
- `step()` - 阶跃函数
- `mix()` - 线性插值
- `length()` - 向量长度