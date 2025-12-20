
# 中心径向渐变

以画布中心为起点，通过 distance() 创建向外扩散的径向渐变。

## 概览
- 按步骤完成练习。

## 学习目标
- 理解如何计算像素点到画布中心的距离。
- 学习使用`distance()`函数创建径向效果。
- 掌握如何将距离值映射到颜色渐变。

## 前置知识
- uv-coordinates
- simple-circle

## 关键概念
- `vUv` 是归一化 UV（`[0,1]`）。

```glsl
vec2 uv = vUv;
```
- 用 `mix(a, b, t)` 混合/插值。

```glsl
vec3 color = mix(colorA, colorB, t);
```
- 用 `length/distance` 构造距离场。

```glsl
float d = length(uv - 0.5);
```

## 如何实现（步骤）
- 计算 vUv 到中心的距离 dist
- 使用 mix() 按距离混合颜色
- 输出径向渐变颜色

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
