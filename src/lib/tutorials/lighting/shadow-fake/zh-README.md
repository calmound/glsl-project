<!-- AUTO-GENERATED: tutorial-readme -->
# 假阴影

在简单球体上学习光照项（漫反射/高光/边缘光）。

## 概览
- 计算光照项并为形状着色。

## 学习目标
- 理解光照项的数学含义

## 前置知识
- lambert-sphere

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
- 获得法线 `n` 与归一化光照方向。
- 用 `dot(n, l)` 计算漫反射项。
- 可选：用 `pow` 计算高光。
- 组合各项并输出。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- `smoothstep` 通常要保证 `edge0 < edge1`。
