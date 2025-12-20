
# 网格线

使用 fract() 与 step() 绘制网格线。

## 概览
- 按步骤完成练习。

## 学习目标
- 练习基于坐标的着色

## 前置知识
- uv-coordinates

## 关键概念
- `vUv` 是归一化 UV（`[0,1]`）。

```glsl
vec2 uv = vUv;
```
- 用 `mix(a, b, t)` 混合/插值。

```glsl
vec3 color = mix(colorA, colorB, t);
```
- 用 `step` 构造硬边遮罩。

```glsl
float mask = step(0.5, uv.x);
```
- 用 `floor/fract/mod` 做分段与重复。

```glsl
vec2 cell = floor(uv * 10.0);
float m = mod(cell.x + cell.y, 2.0);
```

## 如何实现（步骤）
- 从 vUv 开始。
- 用 step() 构造硬边遮罩。
- 用 floor/fract/mod 做重复/图案。
- 用 mix() 混合输出。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 先缩放再 fract() 才能改变密度。
