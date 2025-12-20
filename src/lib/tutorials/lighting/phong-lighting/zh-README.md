
# Phong光照模型

实现基础的Phong光照模型，模拟物体表面的环境光、漫反射和镜面高光效果。

## 概览
- 计算光照项并为形状着色。

## 学习目标
- 理解Phong光照模型的基本组成：环境光、漫反射和镜面高光。
- 学习如何在GLSL中计算光照向量、视点向量和反射向量。
- 掌握漫反射和镜面反射的计算公式及其参数意义。
- 能够实现一个基本的Phong光照着色器，并调整参数观察效果变化。

## 前置知识
- vector-math
- normal-vectors

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
- 调整 shininess（越大高光越小越锐利）
- 观察 shininess 改变后的高光差异

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 不要直接用像素坐标，记得归一化。
