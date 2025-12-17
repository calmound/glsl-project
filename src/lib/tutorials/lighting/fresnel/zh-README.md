<!-- AUTO-GENERATED: tutorial-readme -->
# Fresnel 效果

在简单球体上学习光照项（漫反射/高光/边缘光）。

## 概览
- 按步骤完成练习。

## 学习目标
- 理解光照项的数学含义

## 前置知识
- lambert-sphere

## 关键概念
- `vUv` 是归一化 UV（`[0,1]`）。

```glsl
vec2 uv = vUv;
```
- 用 `mix(a, b, t)` 混合/插值。

```glsl
vec3 color = mix(colorA, colorB, t);
```
- 用 `length/distance` 构造距离场。

```glsl
float d = length(uv - 0.5);
```

## 如何实现（步骤）
- 从 vUv 开始。
- 计算距离值用于遮罩/形状。
- 用 mix() 混合输出。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
