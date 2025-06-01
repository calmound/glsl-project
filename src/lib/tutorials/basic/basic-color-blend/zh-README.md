# 双色混合渐变

通过这个练习，我们将实现一个从左至右的线性颜色渐变，掌握 GLSL 中颜色混合与 UV 坐标的使用方式。

## 学习目标

- 理解 `vUv` 表示的纹理坐标含义；
- 学会使用 `mix` 函数进行颜色插值；
- 掌握如何根据 UV 坐标实现方向性渐变。

## 核心概念

### `vUv`：纹理坐标

`vUv` 是从顶点着色器传入片元着色器的二维坐标，范围通常为 `[0.0, 1.0]`，表示当前片元在屏幕中的位置。

```glsl
varying vec2 vUv;
```

### `mix(a, b, t)`：线性插值

GLSL 提供的 `mix` 函数可用于在两个值之间做线性过渡：

```glsl
vec3 color = mix(colorA, colorB, vUv.x);
```

### `gl_FragColor`

最终颜色通过设置 `gl_FragColor` 输出：

```glsl
gl_FragColor = vec4(blendedColor, 1.0);
```