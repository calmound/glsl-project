# Color Blending Gradient

## Learning Objectives

This example teaches how to use the `mix` function in a fragment shader to blend two colors horizontally using the `vUv.x` coordinate.

## Key Concepts

### 1. `vUv`: UV Coordinates

Each fragment has a `vUv` ranging from 0 to 1. It can be used to represent the fragment’s position on the screen.

```glsl
varying vec2 vUv;
```

In this example, we use `vUv.x` to control the color blend along the horizontal axis.

### 2. `mix(a, b, t)`: Linear Interpolation

This function blends `a` and `b` based on `t`:

```glsl
vec3 color = mix(colorA, colorB, vUv.x);
```

When `vUv.x = 0`, it shows `colorA`; when `vUv.x = 1`, it shows `colorB`. In between, it's a smooth transition.
