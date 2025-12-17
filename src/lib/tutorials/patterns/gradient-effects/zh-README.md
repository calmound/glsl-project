<!-- AUTO-GENERATED: tutorial-readme -->
# 渐变效果

学习创建多种渐变效果，包括线性渐变、径向渐变、角度渐变和动态混合

## 概览
- 用极角作为渐变因子。

## 学习目标
- 掌握多种渐变效果的创建方法
- 理解线性渐变和径向渐变的区别
- 学习角度渐变和波浪渐变的实现
- 了解如何动态混合多种渐变效果

## 前置知识
- basic-gradients
- uv-coordinates

## 输入
- `float u_time` — 时间（秒）。
- `vec2 u_resolution` — 画布尺寸（像素）。

## 关键概念
- 角度来自 `atan(y, x)`。

```glsl
float a = atan(p.y, p.x);
```
- 把角度归一化到 `[0,1]` 并作为插值因子。

```glsl
float t = (a + PI) / (2.0 * PI);
```

## 如何实现（步骤）
- 蓝色分量可以用 (uv.x + uv.y) * 0.5 或常量
- 绿色分量可用 1.0 - distance
- 给 y 分量一个时间偏移（如 timeOffset * 0.2）
- 混合因子可用 0.5 或 distance

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 不要直接用像素坐标，记得归一化。
- `smoothstep` 通常要保证 `edge0 < edge1`。
