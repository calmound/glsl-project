<!-- AUTO-GENERATED: tutorial-readme -->
# 绘制圆形

学习使用距离函数绘制基本图形，理解像素坐标系统和distance函数的应用。

## 概览
- 用距离场与遮罩来塑形。

## 学习目标
- 理解像素坐标系以及如何将坐标中心化。
- 掌握`distance()`函数的用法，计算点到圆心的距离。
- 学习如何根据距离和半径绘制圆形。
- 了解`step()`或`smoothstep()`函数在边缘处理中的应用。

## 前置知识
- uv-coordinates

## 输入
- `vec2 u_resolution` — 画布尺寸（像素）。
- `float u_time` — 时间（秒）。

## 关键概念
- 到中心的距离可以构造距离场。

```glsl
vec2 p = vUv - 0.5;
float d = length(p);
```
- 把距离转换为遮罩。

```glsl
float mask = 1.0 - smoothstep(r, r + aa, d);
```

## 如何实现（步骤）
- 使用 vec2(0.5) 作为中心偏移
- 使用 length(center)
- 选择一个合适的半径值（如 0.25）
- 使用 step(radius, distance) 并取反得到圆内为 1.0
- 使用 circle 作为颜色强度

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 不要直接用像素坐标，记得归一化。
