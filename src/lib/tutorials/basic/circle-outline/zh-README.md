# 圆形描边

使用 abs(距离-半径) 与 smoothstep() 绘制圆环描边。

## 学习目标
- 计算到中心距离
- 用 abs(d-r) 构造圆环遮罩

## 练习要求
- 计算 ring = 1 - smoothstep(w, w+aa, abs(d-r))

## 提示
- 使用 r=0.28, w=0.02
