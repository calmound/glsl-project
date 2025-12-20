
# 水平条纹

使用 fract() 与 step() 创建水平条纹。

## 概览
- 用 `fract` 与 `step` 创建重复条纹。

## 学习目标
- 构建重复图案

## 前置知识
- uv-coordinates

## 关键概念
- 条纹来自 `fract` 的坐标重复，再用阈值转成 0/1 遮罩。

```glsl
float count = 12.0;
float v = fract(vUv.y * count);
float mask = step(0.5, v);
```
- 用 `mix` 在两种颜色间切换。

```glsl
vec3 color = mix(colorA, colorB, mask);
```

## 如何实现（步骤）
- 用 `fract(vUv.y * count)` 做重复。
- 用 `step(0.5, v)` 转成遮罩。
- 用遮罩 `mix` 切换颜色。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 先缩放再 fract() 才能改变密度。
