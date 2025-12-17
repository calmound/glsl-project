<!-- AUTO-GENERATED: tutorial-readme -->
# 圆形描边

使用 abs(距离-半径) 与 smoothstep() 绘制圆环描边。

## 概览
- 通过到圆周边界的距离绘制圆环。

## 学习目标
- 计算到中心距离
- 用 abs(d-r) 构造圆环遮罩

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
float ringDist = abs(d - r);
float mask = 1.0 - smoothstep(w, w + aa, ringDist);
```

## 如何实现（步骤）
- 计算到中心距离 `d`。
- 计算圆环距离：`abs(d - r)`。
- 用 `smoothstep` 把距离转成遮罩。
- 混合颜色并输出。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- `smoothstep` 通常要保证 `edge0 < edge1`。
