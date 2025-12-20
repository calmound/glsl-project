
# 卡通渲染 (Toon Shading)

实现一种非真实感渲染技术，通过将光照强度量化为离散的色阶，并通常结合边缘检测来模拟卡通或漫画书的视觉风格。

## 概览
- 计算光照项并为形状着色。

## 学习目标
- 理解卡通渲染的基本原理：光照的离散化处理。
- 学习如何使用`step()`或`floor()`函数将连续的光照强度映射到有限的色阶。
- 掌握边缘检测的基本方法（如基于法线和视点方向的点积）及其在卡通渲染中的应用。
- 能够实现一个包含硬阴影和轮廓线的卡通着色器。
- 探索如何通过调整色阶数量和颜色来改变卡通渲染的风格。

## 前置知识
- phong-lighting
- step-function
- edge-detection-techniques

## 输入
- `vec2 u_resolution` — 画布尺寸（像素）。
- `float u_time` — 时间（秒）。

## 关键概念
- 漫反射使用 `max(dot(n, l), 0.0)`。

```glsl
float diff = max(dot(n, lightDir), 0.0);
```
- 高光使用 `pow`（Phong/Blinn-Phong）。

```glsl
float spec = pow(max(dot(r, v), 0.0), shininess);
```

## 如何实现（步骤）
- 调整分级阈值/层数，观察卡通分段效果
- 调整轮廓线 thickness（建议 0.3 - 0.6）

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 不要直接用像素坐标，记得归一化。
- `smoothstep` 通常要保证 `edge0 < edge1`。
