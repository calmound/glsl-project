# 纵横比修正的 UV

当画布不是正方形时，基于归一化 UV 绘制的形状可能会出现拉伸。在这个练习里，你将使用 `u_resolution` **修正纵横比**，让圆形在非正方形画布上依然保持为圆。

## 学习目标

- 使用 `u_resolution` 计算纵横比
- 对居中的 UV 坐标进行纵横比修正
- 使用距离场（`length`）绘制圆形，并用 `smoothstep` 构造遮罩

## 核心思路

1. 让 UV 以画面中心为原点：

```glsl
vec2 p = vUv - 0.5;
```

2. 用纵横比修正 X 分量：

```glsl
float aspect = u_resolution.x / u_resolution.y;
p.x *= aspect;
```

3. 用 `length(p)` 得到到中心的距离，并用 `smoothstep` 得到平滑边缘遮罩。

