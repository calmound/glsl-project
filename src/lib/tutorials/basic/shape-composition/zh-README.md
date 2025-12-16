# 形状组合

更复杂的图形通常来自 **多个遮罩的组合**。本练习将：

- 用 `step` 构造矩形遮罩
- 用 `smoothstep` 构造圆形遮罩
- 用 `max` 做并集（union）组合

## 练习要求

1. 构造居中矩形遮罩 `rectMask`
2. 构造圆形遮罩 `circleMask`
3. 使用 `max(rectMask, circleMask)` 组合
4. 用 `mix` 输出背景/前景

