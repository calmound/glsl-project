
# SDF 圆环

使用距离场绘制圆环：通过 abs(length(p) - r) 得到环的距离，并用 smoothstep 构造平滑边缘。

## 概览
- 用距离场与遮罩来塑形。

## 学习目标
- 理解距离场如何表示形状边界。
- 使用 abs(length(p) - r) 构造圆环距离。
- 用 smoothstep 做抗锯齿/软边过渡。

## 前置知识
- simple-circle
- smooth-edges

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
- 计算圆环距离 ringDist（提示：abs(length(p) - radius)）
- 用 smoothstep 把距离转成遮罩 mask（提示：1.0 - smoothstep(...)）

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- `smoothstep` 通常要保证 `edge0 < edge1`。
