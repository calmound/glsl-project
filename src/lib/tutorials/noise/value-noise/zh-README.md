
# 二维 Value Noise

通过对格点随机值插值，构造平滑噪声。

## 概览
- 生成程序化噪声并映射到颜色。

## 学习目标
- 插值四个角的值
- 用平滑曲线处理 f

## 前置知识
- hash-grid-noise

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
- 先缩放再 fract() 才能改变密度。
