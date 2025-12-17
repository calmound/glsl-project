<!-- AUTO-GENERATED: tutorial-readme -->
# 用 pow() 调整对比度

对渐变值使用 pow() 改变曲线，调整对比度。

## 概览
- 使用 UV 作为因子实现水平渐变。

## 学习目标
- 练习基于坐标的着色

## 前置知识
- uv-coordinates

## 关键概念
- 水平渐变使用 0-1 因子（通常来自 UV）来混合颜色。

```glsl
float t = vUv.x;
vec3 color = vec3(t);
```
- 把因子限制在 `[0,1]`。

```glsl
t = clamp(t, 0.0, 1.0);
```

## 如何实现（步骤）
- 设置因子：`t = vUv.x`。
- 把 `t` 映射到颜色（灰度或 `mix`）。
- 输出 `gl_FragColor`，alpha=1。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
