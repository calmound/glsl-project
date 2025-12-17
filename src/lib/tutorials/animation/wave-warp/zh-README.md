<!-- AUTO-GENERATED: tutorial-readme -->
# 波动扭曲

用正弦波扭曲 UV，产生动态变形。

## 概览
- 使用 UV 作为因子实现垂直渐变。

## 学习目标
- 使用 u_time 制作动画

## 前置知识
- uv-coordinates

## 输入
- `float u_time` — 时间（秒）。

## 关键概念
- 垂直渐变使用 0-1 因子（通常来自 UV）来混合颜色。

```glsl
float t = vUv.y;
vec3 color = mix(colorA, colorB, t);
```
- 把因子限制在 `[0,1]`。

```glsl
t = clamp(t, 0.0, 1.0);
```

## 如何实现（步骤）
- 设置因子：`t = vUv.y`。
- 把 `t` 映射到颜色（灰度或 `mix`）。
- 输出 `gl_FragColor`，alpha=1。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
