<!-- AUTO-GENERATED: tutorial-readme -->
# 噪声纹理

学习创建伪随机噪声纹理，理解噪声在程序化纹理生成中的重要作用。

## 概览
- 生成程序化噪声并映射到颜色。

## 学习目标
- 理解伪随机噪声的基本概念。
- 学习一种简单的噪声生成算法。
- 掌握如何将噪声值映射到颜色或图案。
- 了解噪声在纹理生成和特效中的应用。

## 前置知识
- uv-coordinates
- time-animation

## 输入
- `float u_time` — 时间（秒）。
- `vec2 u_resolution` — 画布尺寸（像素）。

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
- 替换大数值，观察随机分布变化
- 使用 scale 作为缩放因子
- baseNoise = noise(scaledUV)
- 叠加 amplitude
- 振幅衰减（建议 0.5）
- 使用 switchFactor 切换
- 把 0.4-1.0 映射到 0-1

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 不要直接用像素坐标，记得归一化。
- `smoothstep` 通常要保证 `edge0 < edge1`。
- 先缩放再 fract() 才能改变密度。
