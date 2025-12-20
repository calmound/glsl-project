
# 矩形边框

通过“外矩形 - 内矩形”构造矩形边框。

## 概览
- 按步骤完成练习。

## 学习目标
- 用 step 构造矩形遮罩
- 通过相减组合遮罩

## 前置知识
- simple-rectangle
- step-function-mask

## 关键概念
- `vUv` 是归一化 UV（`[0,1]`）。

```glsl
vec2 uv = vUv;
```
- 用 `mix(a, b, t)` 混合/插值。

```glsl
vec3 color = mix(colorA, colorB, t);
```
- 用 `step` 构造硬边遮罩。

```glsl
float mask = step(0.5, uv.x);
```

## 如何实现（步骤）
- 计算外矩形遮罩 inside（矩形内为 1，外为 0）
- 计算内矩形遮罩 insideInner
- 边框遮罩 border = inside - insideInner

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
