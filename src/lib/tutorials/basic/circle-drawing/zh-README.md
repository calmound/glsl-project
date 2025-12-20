
# 圆形绘制（距离函数）

使用归一化坐标与距离函数 length() 绘制圆形，并通过条件判断输出不同颜色。

## 概览
- 按步骤完成练习。

## 学习目标
- 理解如何将 gl_FragCoord 转换为归一化坐标。
- 学会使用 length() 计算到中心点的距离。
- 通过距离阈值判断像素是否在圆内，并输出不同颜色。

## 前置知识
- uv-coordinates
- simple-circle

## 输入
- `vec2 u_resolution` — 画布尺寸（像素）。

## 关键概念
- 用 `u_resolution` 把像素坐标归一化。

```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
```
- 用 `length/distance` 构造距离场。

```glsl
float d = length(uv - 0.5);
```

## 如何实现（步骤）
- 使用 vec2(0.5) 作为中心点偏移
- 使用 length(center)
- 判断 distance < radius
- 圆内颜色（白色）
- 圆外颜色（黑色）

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 不要直接用像素坐标，记得归一化。
