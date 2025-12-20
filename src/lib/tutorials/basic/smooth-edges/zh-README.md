
# 平滑边缘

学习使用smoothstep函数创建平滑的边缘过渡效果，对比step函数的硬边缘。

## 概览
- 用距离场与遮罩来塑形。

## 学习目标
- 理解`smoothstep()`函数的三个参数及其作用。
- 学习如何使用`smoothstep()`在两个值之间创建平滑过渡。
- 对比`smoothstep()`和`step()`在边缘处理上的效果差异。
- 掌握将`smoothstep()`应用于形状边缘以实现抗锯齿或柔化效果。

## 前置知识
- simple-circle
- step-function-mask

## 输入
- `vec2 u_resolution` — 画布尺寸（像素）。
- `float u_time` — 时间（秒）。

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
- 用 step 构造硬边缘圆，并让圆内为 1.0
- 使用 radius 与 softness 构造平滑边缘
- 用 max(squareCoord.x, squareCoord.y) 计算方形距离
- 用 smoothstep 设置方形平滑范围（如 0.15 到 0.15 + softness）
- 尝试用 max 组合 smoothCircle 与 smoothSquare
- 用 combined 或其它函数作为混合因子

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 不要直接用像素坐标，记得归一化。
- `smoothstep` 通常要保证 `edge0 < edge1`。
