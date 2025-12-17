<!-- AUTO-GENERATED: tutorial-readme -->
# 噪声函数

学习和实现 GLSL 中常用的噪声函数，如随机噪声、值噪声和梯度噪声（如Perlin噪声的简化版），用于生成各种程序化纹理和效果。

## 概览
- 生成程序化噪声并映射到颜色。

## 学习目标
- 理解不同类型噪声（随机噪声、值噪声、梯度噪声）的基本原理和特性。
- 学习如何在GLSL中实现一个简单的伪随机数生成器。
- 掌握值噪声的实现方法，包括晶格点和插值。
- 初步了解梯度噪声（如Perlin噪声）的概念和实现思路。
- 能够运用所学噪声函数生成简单的程序化纹理。

## 前置知识
- glsl-data-types
- glsl-functions
- vector-operations

## 输入
- `vec2 u_resolution` — 画布尺寸（像素）。
- `float u_time` — 时间（秒）。

## 关键概念
- 噪声由格点随机值 + 平滑插值构成。

```glsl
vec2 i = floor(p);
vec2 f = fract(p);
vec2 u = f*f*(3.0-2.0*f);
float n = mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
```
- 用 `mix` 或阈值把噪声映射到颜色。

```glsl
vec3 color = mix(colorA, colorB, n);
```

## 如何实现（步骤）
- 用平滑曲线替代线性插值（比如 u = f*f*(3-2f)）
- 修改 scale/pos，观察随机噪声与平滑噪声的区别

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 不要直接用像素坐标，记得归一化。
- `smoothstep` 通常要保证 `edge0 < edge1`。
- 先缩放再 fract() 才能改变密度。
