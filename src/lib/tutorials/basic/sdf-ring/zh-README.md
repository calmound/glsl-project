# SDF 圆环

圆形可以用 `length(p)` 表示“到中心的距离”。而 **圆环** 可以表示为“到圆周边界的距离”：

```glsl
float ringDist = abs(length(p) - radius);
```

接着用 `smoothstep` 把距离转换为软边遮罩。

## 练习要求

- 计算居中坐标 `p = vUv - 0.5`
- 计算 `ringDist`
- 使用 `smoothstep` 生成平滑圆环遮罩
- 使用 `mix` 混合前景/背景颜色

