<!-- AUTO-GENERATED: tutorial-readme -->
# 圆角矩形

练习着色器中常用的数学基础积木。

## 概览
- 按步骤完成练习。

## 学习目标
- 理解效果背后的数学

## 前置知识
- uv-coordinates

## 关键概念
- `vUv` 是归一化 UV（`[0,1]`）。

```glsl
vec2 uv = vUv;
```
- 用 `smoothstep` 构造软边遮罩。

```glsl
float m = 1.0 - smoothstep(r, r + aa, d);
```
- 用 `length/distance` 构造距离场。

```glsl
float d = length(uv - 0.5);
```

## 如何实现（步骤）
- 从 vUv 开始。
- 计算距离值用于遮罩/形状。
- 用 smoothstep() 构造软边遮罩。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- `smoothstep` 通常要保证 `edge0 < edge1`。
