
# 纵横比修正的 UV

学习使用 u_resolution 修正 UV 的纵横比，让圆形在非正方形画布上依然保持为圆。

## 概览
- 用距离场与遮罩来塑形。

## 学习目标
- 理解画布纵横比对形状的影响。
- 学会使用 u_resolution 计算 aspect 并修正坐标。
- 能用距离场（length）绘制不变形的圆。

## 前置知识
- uv-coordinates

## 输入
- `vec2 u_resolution` — 画布尺寸（像素）。

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
- 居中坐标：`p = vUv - 0.5`。
- 计算距离：`d = length(p)`。
- 用 `smoothstep` 或 `step` 构造遮罩。
- 用遮罩混合前景/背景。

## 自检
- 是否能无错误编译？
- 输出是否符合目标？
- 关键数值是否在 `[0,1]`？

## 常见坑
- 必要时把 `t` 用 clamp 限制到 `[0,1]`。
- `smoothstep` 通常要保证 `edge0 < edge1`。
