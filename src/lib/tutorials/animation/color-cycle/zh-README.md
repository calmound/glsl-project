<!-- AUTO-GENERATED: tutorial-readme -->
# 颜色循环

使用 sin() 让 RGB 通道随时间循环变化。

## 概览
- 按步骤完成练习。

## 学习目标
- 使用 u_time 制作动画

## 前置知识
- uv-coordinates

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

## 如何实现（步骤）
- 从 vUv 开始。
- 用 u_time 做动画（可选）。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 如果画面全黑，检查遮罩/因子是否一直为 0。
