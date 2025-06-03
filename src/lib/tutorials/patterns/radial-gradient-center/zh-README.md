# 中心径向渐变

## 学习目标

你将学习如何根据像素到中心的距离，创建从中心向外扩散的渐变视觉效果。

---

## 核心概念详解

### 1. 使用 `distance()` 获取距离

我们先计算每个像素到中心点 `(0.5, 0.5)` 的距离：

```glsl
float dist = distance(vUv, vec2(0.5));
```

中心点距离为 0，越远距离越大。

---

### 2. 构建径向渐变

使用 `mix()` 按距离插值颜色：

```glsl
vec3 color = mix(innerColor, outerColor, dist * 缩放因子);
```

- `dist` 越小 → 趋近 `innerColor`
- `dist` 越大 → 趋近 `outerColor`

缩放因子控制颜色过渡的范围。

---

### 3. 输出颜色

```glsl
gl_FragColor = vec4(color, 1.0);
```

这就形成了一个从中心向外变暗或变色的放射状渐变。
