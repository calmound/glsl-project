
# 分形布朗运动 (FBM)

通过叠加多个不同频率和振幅的噪声层（通常是Perlin噪声或Simplex噪声）来创建具有自相似性的复杂图案，常用于生成自然现象如山脉、云彩、水面等。

## 概览
- 生成程序化噪声并映射到颜色。

## 学习目标
- 理解分形布朗运动的基本原理：通过迭代叠加噪声实现。
- 学习如何在GLSL中实现FBM算法，包括控制倍频程(octaves)、持续性(persistence)和疏密度(lacunarity)。
- 掌握如何使用FBM生成类似地形、云朵等自然纹理。
- 能够调整FBM参数以获得不同风格的噪声效果。

## 前置知识
- noise-functions
- looping-constructs

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
- 缩放 UV 控制频率（如 `p = vUv * 6.0`）。
- 计算基础噪声（hash/valueNoise）。
- 可选：叠加多层（FBM）增强细节。
- 把噪声映射到灰度或颜色。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 不要直接用像素坐标，记得归一化。
- `smoothstep` 通常要保证 `edge0 < edge1`。
- 先缩放再 fract() 才能改变密度。
