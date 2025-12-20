
# 波点

把画面分成网格，并在每个格子中绘制圆点。

## 概览
- 用距离场与遮罩来塑形。

## 学习目标
- 用 fract() 分格
- 用 smoothstep 画圆点

## 前置知识
- simple-circle
- uv-coordinates

## 关键概念
- 到中心的距离可以构造距离场。

```glsl
vec2 p = vUv - 0.5;
float d = length(p);
```
- 把距离转换为遮罩。

```glsl
float mask = 1.0 - smoothstep(r, r + aa, d);
```

## 如何实现（步骤）
- 把 vUv 分成网格，并让每个单元以中心为原点（提示：fract(vUv*count)-0.5）
- 用 smoothstep 画圆点（单元中心为 1，外部为 0）

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- `smoothstep` 通常要保证 `edge0 < edge1`。
- 先缩放再 fract() 才能改变密度。
