<!-- AUTO-GENERATED: tutorial-readme -->
# 时间动画

学习使用u_time uniform变量创建随时间变化的动画效果，理解sin函数在动画中的应用。

## 概览
- 用距离场与遮罩来塑形。

## 学习目标
- 理解`u_time` uniform变量如何将时间传递给着色器。
- 学习使用时间变量来改变颜色、形状或位置，从而创建动画。
- 掌握`sin()`或`cos()`函数结合`u_time`来创建平滑的周期性动画。
- 能够实现简单的闪烁、脉冲或移动效果。

## 前置知识
- solid-color
- uv-coordinates

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
- 填写运动半径（建议 0.2）
- distance = length(pos)
- 填写半径变化幅度（建议 0.05）
- 填写距离变量（distance）
- 使用 dynamicColor 作为圆形颜色

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 不要直接用像素坐标，记得归一化。
- `smoothstep` 通常要保证 `edge0 < edge1`。
