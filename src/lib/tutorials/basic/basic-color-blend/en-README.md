# Two-Color Blended Gradient

In this exercise, we'll implement a horizontal gradient that smoothly transitions between two colors. This helps build an understanding of UV mapping and color interpolation in GLSL.

## Learning Objectives

- Understand the role of `vUv` as a texture coordinate;
- Use the `mix` function to interpolate between two colors;
- Implement a directional gradient using UV coordinates.

## Key Concepts

### `vUv`: UV Coordinates

The `vUv` value represents the normalized 2D position of a pixel on the surface, usually ranging from `0.0` to `1.0`.

```glsl
varying vec2 vUv;
```

### `mix(a, b, t)`: Linear Interpolation

The `mix` function interpolates smoothly between two values:

```glsl
vec3 color = mix(colorA, colorB, vUv.x);
```

### `gl_FragColor`

Final output is passed to the screen through:

```glsl
gl_FragColor = vec4(blendedColor, 1.0);
```