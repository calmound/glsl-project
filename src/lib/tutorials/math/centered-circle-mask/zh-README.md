<!-- AUTO-GENERATED: tutorial-readme -->
# 中心圆遮罩

使用 distance() 创建一个以画布中心为圆心的遮罩区域。

## 概览
- 用距离场与遮罩来塑形。

## 学习目标
- 理解`distance()`函数如何计算两点之间的距离。
- 学习如何将屏幕中心作为参考点来计算每个片元到中心的距离。
- 掌握使用距离和阈值（例如结合`step()`或`smoothstep()`）来创建圆形遮罩。
- 能够应用圆形遮罩来显示或隐藏特定区域的内容。

## 前置知识
- simple-circle
- step-function-mask

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
- 定义中心点 center（0.5, 0.5）
- 计算当前像素与中心的距离 dist
- 使用 step() 判断是否在圆形内，生成遮罩值 inside
- 使用 mix() 混合颜色
- 输出最终颜色

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
