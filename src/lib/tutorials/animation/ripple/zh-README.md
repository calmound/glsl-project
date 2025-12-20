
# 波纹

将距离与时间结合到正弦波中，创建圆形波纹。

## 概览
- 按步骤完成练习。

## 学习目标
- 用距离作为波输入
- 用时间推进相位

## 前置知识
- simple-circle
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
- 用 `length/distance` 构造距离场。

```glsl
float d = length(uv - 0.5);
```

## 如何实现（步骤）
- 从 vUv 开始。
- 计算距离值用于遮罩/形状。
- 用 mix() 混合输出。
- 用 u_time 做动画（可选）。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
