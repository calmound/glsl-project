# 柔边渐隐（Smoothstep）

## 学习目标

本案例展示如何使用 `smoothstep()` 取代 `step()`，实现更自然柔和的图形边缘效果，是 UI 渲染与特效中常用技巧。

---

## 核心概念详解

### 1. `smoothstep(edge0, edge1, x)`

比 `step()` 更平滑的插值函数：

```glsl
float result = smoothstep(0.3, 0.5, dist);
```

- `x <= edge0` 时返回 0  
- `x >= edge1` 时返回 1  
- 中间部分平滑过渡（非跳变）

---

### 2. 构造柔边遮罩

```glsl
float dist = distance(vUv, vec2(0.5));
float mask = smoothstep(0.3, 0.5, dist);
```

我们创建一个以中心为圆心、半径为 0.3~0.5 的渐变边缘区域。

---

### 3. 渐隐混合颜色

```glsl
vec3 color = mix(亮色, 背景色, mask);
```

当 mask 接近 0，显示亮色；mask 趋近 1 时，逐渐变为背景色，实现柔和过渡。
