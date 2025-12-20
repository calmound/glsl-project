
# 形状组合

将圆形与矩形的遮罩组合在一起，学习用 min/max 或简单的合成方式构建更复杂的图形。

## 概览
- 用距离场与遮罩来塑形。

## 学习目标
- 用 step/smoothstep 构造基础形状遮罩。
- 使用 max 将多个遮罩做并集组合。
- 通过 mix 输出组合后的前景/背景颜色。

## 前置知识
- simple-rectangle
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
- 1) 用 step 构造矩形遮罩 rect（提示：比较 abs(uv - center) 与 halfSize）
- 2) 用 smoothstep 构造圆形遮罩 circle（提示：circle = 1.0 - smoothstep(r, r+aa, length(uv-0.5))）
- 3) 用 max(rect, circle) 合并成 combined

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- `smoothstep` 通常要保证 `edge0 < edge1`。
