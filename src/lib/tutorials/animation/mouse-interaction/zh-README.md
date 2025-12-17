<!-- AUTO-GENERATED: tutorial-readme -->
# 鼠标交互

学习使用鼠标坐标创建交互效果，理解uniform变量的传递和使用。

## 概览
- 用距离场与遮罩来塑形。

## 学习目标
- 理解如何在GLSL中接收和使用鼠标坐标 (`u_mouse`)。
- 学习根据鼠标位置动态改变着色器输出。
- 掌握uniform变量在CPU和GPU之间传递数据的方法。

## 前置知识
- uv-coordinates
- uniforms

## 输入
- `vec2 u_resolution` — 画布尺寸（像素）。
- `vec2 u_mouse` — 鼠标位置（像素）。
- `float u_time` — 时间（秒）。

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
- mouse = u_mouse / u_resolution
- distToMouse = distance(uv, mouse)
- 调整半径值（建议 0.15 - 0.3）
- mouseColor = vec3(mouse, 0.5)
- pulse = sin(u_time * speed) * 0.5 + 0.5

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- 不要直接用像素坐标，记得归一化。
- `smoothstep` 通常要保证 `edge0 < edge1`。
