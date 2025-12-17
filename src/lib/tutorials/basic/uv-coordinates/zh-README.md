<!-- AUTO-GENERATED: tutorial-readme -->
# UV坐标基础

理解着色器中的UV坐标系统及其应用。学习如何将UV坐标映射到颜色，创建渐变效果。

## 概览
- 按步骤完成练习。

## 学习目标
- 理解UV坐标系（通常为0到1范围）及其在2D平面上的表示。
- 学习如何在片元着色器中访问内置的UV坐标（例如`gl_FragCoord.xy / u_resolution.xy`）。
- 掌握将UV坐标的x或y分量直接用作颜色通道的值，以创建简单的线性渐变。
- 了解UV坐标是纹理映射的基础。

## 前置知识
- solid-color

## 输入
- `vec2 u_resolution` — 画布尺寸（像素）。

## 关键概念
- 用 `u_resolution` 把像素坐标归一化。

```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
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
- 使用 gl_FragCoord.xy
- 使用 u_resolution
- 将 uv 映射到颜色：vec3(uv, 0.0)
- 设定网格密度（如 10.0）
- 使用 mix(uvColor, gridColor, gridLines) 混合

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 不要直接用像素坐标，记得归一化。
- 先缩放再 fract() 才能改变密度。
