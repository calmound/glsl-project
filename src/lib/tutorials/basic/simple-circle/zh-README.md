# 绘制圆形

## 学习目标
- 理解像素坐标系统
- 学习坐标系转换
- 掌握距离函数的使用
- 了解条件判断在着色器中的应用

## 核心概念

### 坐标系转换
```glsl
// gl_FragCoord.xy 是像素坐标 (0 到分辨率)
vec2 uv = gl_FragCoord.xy / u_resolution.xy; // 转换为 0~1
vec2 center = uv - vec2(0.5); // 移动原点到中心
```

### 距离函数
- `distance(a, b)` - 计算两点间的距离
- `length(v)` - 计算向量的长度（到原点的距离）
- 用于判断点是否在图形内部

### 条件判断
```glsl
if (condition) {
    // 条件为真时执行
} else {
    // 条件为假时执行
}
```

### step 函数
`step(edge, x)` 是一个阶跃函数：
- 如果 x < edge，返回 0.0
- 如果 x >= edge，返回 1.0
- 常用于创建硬边界

## 练习建议
1. 修改圆的半径，观察大小变化
2. 改变圆的颜色
3. 尝试移动圆的位置
4. 使用 step 函数重写条件判断
5. 创建多个圆形

## 相关函数
- `distance()` - 距离函数
- `length()` - 向量长度
- `step()` - 阶跃函数
- `gl_FragCoord` - 片段坐标