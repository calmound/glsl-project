# 暗角（边缘变暗）

使用到中心的距离与 smoothstep() 让画面四周变暗。

## 学习目标
- 计算到中心的距离
- 用 smoothstep 构造暗角遮罩

## 练习要求
- 计算 d = length(vUv - 0.5)
- 构造 v = 1 - smoothstep(inner, outer, d)

## 提示
- 可尝试 inner=0.25, outer=0.6
