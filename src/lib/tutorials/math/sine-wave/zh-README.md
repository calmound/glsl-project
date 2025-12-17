<!-- AUTO-GENERATED: tutorial-readme -->
# 正弦波动画

学习使用sin函数创建波形效果，理解频率、振幅和相位的概念。

## 概览
- 使用 UV 作为因子实现水平渐变。

## 学习目标
- 理解`sin()`函数如何生成周期性波形。
- 学习调整频率、振幅和相位参数以改变波形特征。
- 掌握将时间变量`u_time`与`sin()`函数结合创建动态波形。
- 了解如何将波形应用于颜色变化或形状位移。

## 前置知识
- uv-coordinates
- time-animation

## 输入
- `vec2 u_resolution` — 画布尺寸（像素）。
- `float u_time` — 时间（秒）。

## 关键概念
- 把像素坐标归一化为 UV。

```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
```
- 水平渐变使用 0-1 因子（通常来自 UV）来混合颜色。

```glsl
float t = uv.x;
vec3 color = vec3(t);
```
- 把因子限制在 `[0,1]`。

```glsl
t = clamp(t, 0.0, 1.0);
```

## 如何实现（步骤）
- wave = sin(uv.x * frequency)
- animatedWave = sin(uv.x * 10.0 + u_time)
- normalizedWave = animatedWave * 0.5 + 0.5
- 用时间或坐标构造 0-1 的 colorMix
- waveColor = mix(color1, color2, colorMix)

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 不要直接用像素坐标，记得归一化。
- `smoothstep` 通常要保证 `edge0 < edge1`。
