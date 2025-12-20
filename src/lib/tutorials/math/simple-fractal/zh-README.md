
# 简单分形

学习创建简单的分形图案，理解递归和自相似的概念在着色器中的应用。

## 概览
- 使用 UV 作为因子实现水平渐变。

## 学习目标
- 理解分形图案中自相似性的基本概念。
- 学习通过迭代或递归的方式在片元着色器中生成简单分形。
- 掌握坐标变换（如缩放、平移）在分形生成中的应用。
- 了解如何控制迭代次数以调整分形的复杂度和细节。

## 前置知识
- uv-coordinates
- pattern-repetition

## 输入
- `float u_time` — 时间（秒）。
- `vec2 u_resolution` — 画布尺寸（像素）。

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
- 设置初始振幅（建议 0.5）
- distance = length(pos)
- fractal += circle * amplitude
- amplitude *= 0.5
- 用 fractal 作为混合因子（可适当放大）
- 让 finalColor 乘以 pulse

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 不要直接用像素坐标，记得归一化。
- `smoothstep` 通常要保证 `edge0 < edge1`。
- 先缩放再 fract() 才能改变密度。
