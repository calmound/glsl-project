
# 暗角（边缘变暗）

使用到中心的距离与 smoothstep() 让画面四周变暗。

## 概览
- 用距离场与遮罩来塑形。

## 学习目标
- 计算到中心的距离
- 用 smoothstep 构造暗角遮罩

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
