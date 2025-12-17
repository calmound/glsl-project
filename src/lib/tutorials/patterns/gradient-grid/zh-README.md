<!-- AUTO-GENERATED: tutorial-readme -->
# 渐变网格

练习基于 UV 构建重复图案。

## 概览
- 按步骤完成练习。

## 学习目标
- 使用 floor/fract/step 构建图案

## 前置知识
- uv-coordinates

## 关键概念
- `vUv` 是归一化 UV（`[0,1]`）。

```glsl
vec2 uv = vUv;
```
- 用 `floor/fract/mod` 做分段与重复。

```glsl
vec2 cell = floor(uv * 10.0);
float m = mod(cell.x + cell.y, 2.0);
```

## 如何实现（步骤）
- 从 vUv 开始。
- 用 floor/fract/mod 做重复/图案。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 如果画面全黑，检查遮罩/因子是否一直为 0。
