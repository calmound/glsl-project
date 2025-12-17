<!-- AUTO-GENERATED: tutorial-readme -->
# 图案重复

学习如何创建重复的几何图案，包括网格系统、随机变化和动画效果

## 概览
- 用距离场与遮罩来塑形。

## 学习目标
- 掌握网格系统的创建方法
- 学习使用fract函数创建重复效果
- 了解如何为每个网格单元添加随机变化
- 掌握程序化图案生成技巧

## 前置知识
- coordinate-transformation
- simple-circle

## 输入
- `float u_time` — 时间（秒）。
- `vec2 u_resolution` — 画布尺寸（像素）。

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
- 使用 repeatCount
- centered = repeated - vec2(0.5)
- 竖线宽度也使用 crossWidth
- cross = max(horizontal, vertical)
- circle 使用 distance
- 使用 switchTime 作为切换因子
- 使用 pattern 作为遮罩

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 不要直接用像素坐标，记得归一化。
- `smoothstep` 通常要保证 `edge0 < edge1`。
- 先缩放再 fract() 才能改变密度。
