<!-- AUTO-GENERATED: tutorial-readme -->
# 简单矩形

学习使用条件判断绘制矩形，理解坐标范围和边界检测。

## 概览
- 使用 UV 作为因子实现水平渐变。

## 学习目标
- 理解如何使用逻辑与（&&）组合条件来定义矩形区域。
- 学习根据UV坐标的x和y值进行边界检测。
- 掌握在GLSL中使用条件语句（如`if`或`step`）绘制简单形状。

## 前置知识
- uv-coordinates
- solid-color

## 输入
- `vec2 u_resolution` — 画布尺寸（像素）。
- `float u_time` — 时间（秒）。

## 关键概念
- 把像素坐标归一化为 UV。

```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
```
- 水平渐变使用 0-1 因子（通常来自 UV）来混合颜色。

```glsl
float t = uv.x;
vec3 color = vec3(t);
```
- 把因子限制在 `[0,1]`。

```glsl
t = clamp(t, 0.0, 1.0);
```

## 如何实现（步骤）
- 按注释目标填写边界值
- 填写白色 vec3(1.0)
- 填写黑色 vec3(0.0)

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 不要直接用像素坐标，记得归一化。
