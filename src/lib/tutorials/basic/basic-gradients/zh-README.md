
# 基础渐变效果

学习如何使用GLSL创建线性和径向渐变效果

## 概览
- 使用 UV 作为因子实现垂直渐变。

## 学习目标
- 理解线性渐变的实现原理
- 学习径向渐变的数学基础
- 掌握GLSL中的颜色混合技巧

## 输入
- `vec2 u_resolution` — 画布尺寸（像素）。
- `float u_time` — 时间（秒）。

## 关键概念
- 把像素坐标归一化为 UV。

```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
```
- 垂直渐变使用 0-1 因子（通常来自 UV）来混合颜色。

```glsl
float t = uv.y;
vec3 color = vec3(t);
```
- 把因子限制在 `[0,1]`。

```glsl
t = clamp(t, 0.0, 1.0);
```

## 如何实现（步骤）
- 先归一化坐标：`uv = gl_FragCoord.xy / u_resolution.xy`。
- 设置因子：`t = uv.y`。
- 把 `t` 映射到颜色（灰度或 `mix`）。
- 输出 `gl_FragColor`，alpha=1。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 不要直接用像素坐标，记得归一化。
