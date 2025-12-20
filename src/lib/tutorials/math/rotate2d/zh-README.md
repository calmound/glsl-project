
# 二维旋转矩阵

使用二维旋转矩阵旋转坐标。

## 概览
- 按步骤完成练习。

## 学习目标
- 构造 mat2 旋转矩阵
- 对形状应用旋转

## 前置知识
- uv-coordinates
- time-pulse

## 输入
- `float u_time` — 时间（秒）。

## 关键概念
- `vUv` 是归一化 UV（`[0,1]`）。

```glsl
vec2 uv = vUv;
```
- 用 `u_time` + `sin/cos` 做动画。

```glsl
float pulse = sin(u_time) * 0.5 + 0.5;
```
- 用 `mix(a, b, t)` 混合/插值。

```glsl
vec3 color = mix(colorA, colorB, t);
```
- 用 `smoothstep` 构造软边遮罩。

```glsl
float m = 1.0 - smoothstep(r, r + aa, d);
```

## 如何实现（步骤）
- 从 vUv 开始。
- 用 smoothstep() 构造软边遮罩。
- 用 mix() 混合输出。
- 用 u_time 做动画（可选）。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- `smoothstep` 通常要保证 `edge0 < edge1`。
