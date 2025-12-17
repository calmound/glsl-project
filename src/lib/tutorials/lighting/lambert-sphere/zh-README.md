# Lambert 光照（球）

用估计法线实现 Lambert 漫反射，为球体着色。

## 学习目标
- 估计法线
- 用 dot(n,l) 计算漫反射

## 练习要求
- 计算 diff = max(dot(n, lightDir), 0.0)
- 用 diff 为球体着色

## 提示
- 确保 lightDir 归一化
