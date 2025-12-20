
# 条纹与带状图案

使用 fract 与 step 构造重复的条纹图案，并用 mix 在两种颜色之间切换。

## 概览
- 用 `fract` 与 `step` 创建重复条纹。

## 学习目标
- 理解 fract 如何制造重复图案。
- 用 step 把连续数值变成 0/1 开关。
- 用 mix 将条纹开关映射为两种颜色。

## 前置知识
- uv-coordinates
- step-function-mask

## 关键概念
- 条纹来自 `fract` 的坐标重复，再用阈值转成 0/1 遮罩。

```glsl
float count = 12.0;
float v = fract(vUv.x * count);
float mask = step(0.5, v);
```
- 用 `mix` 在两种颜色间切换。

```glsl
vec3 color = mix(colorA, colorB, mask);
```

## 如何实现（步骤）
- 设置条纹数量（建议 8.0 - 20.0）
- 使用 fract(vUv.x * stripeCount) 得到每条纹内部的 0-1 坐标
- 使用 step(0.5, x) 得到 0/1 遮罩（条纹两种颜色切换）

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 先缩放再 fract() 才能改变密度。
