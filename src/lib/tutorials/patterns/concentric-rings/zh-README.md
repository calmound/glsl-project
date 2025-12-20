
# 同心圆环

练习基于 UV 构建重复图案。

## 概览
- 用距离场与遮罩来塑形。

## 学习目标
- 使用 floor/fract/step 构建图案

## 前置知识
- uv-coordinates

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
- 先缩放再 fract() 才能改变密度。
