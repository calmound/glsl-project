# Aspect-Ratio Corrected UV

When your canvas is not square, shapes based on normalized UV may look stretched. In this exercise you will **correct the aspect ratio** using `u_resolution` so a circle stays round.

## Learning Objectives

- Use `u_resolution` to compute the aspect ratio
- Correct centered UV coordinates
- Render a circle using a distance field (`length`)

## Key Idea

1. Center UV around the middle:

```glsl
vec2 p = vUv - 0.5;
```

2. Correct X with aspect ratio:

```glsl
float aspect = u_resolution.x / u_resolution.y;
p.x *= aspect;
```

3. Use `length(p)` as distance to center and build a mask with `smoothstep`.

