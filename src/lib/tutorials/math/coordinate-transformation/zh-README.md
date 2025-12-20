
# 坐标变换

学习2D坐标变换的基本原理，包括旋转、缩放和重复图案的创建

## 概览
- 用距离场与遮罩来塑形。

## 学习目标
- 理解2D坐标变换的基本原理
- 掌握旋转矩阵的构造和应用
- 学习缩放变换的实现方法
- 了解如何组合多种变换创建复杂效果

## 前置知识
- uv-coordinates
- simple-circle

## 输入
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
- centered = uv - vec2(0.5)
- 替换为 centered.x * cosA - centered.y * sinA
- 替换为 centered.x * sinA + centered.y * cosA
- scaled = rotated * scale
- distance = length(cellCenter)
- 给蓝色通道一个变化（如 sin(u_time)）

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 不要直接用像素坐标，记得归一化。
- `smoothstep` 通常要保证 `edge0 < edge1`。
- 先缩放再 fract() 才能改变密度。
