
# 柔边渐隐

使用 smoothstep() 实现图形边缘的渐隐过渡，对比 step()。

## 概览
- 用距离场与遮罩来塑形。

## 学习目标
- 深入理解`smoothstep()`在边缘处理中的应用。
- 学习如何通过调整`smoothstep()`的参数来控制渐隐的范围和强度。
- 掌握创建具有柔和边缘的图形效果。
- 能够解释`smoothstep()`与`step()`在视觉效果上的主要区别。

## 前置知识
- smooth-edges
- step-function

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
- 计算 vUv 到中心点的距离 dist
- 使用 smoothstep() 生成软边遮罩 mask
- 混合中心亮色和黑色背景
- 输出颜色

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- `smoothstep` 通常要保证 `edge0 < edge1`。
