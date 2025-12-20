
# Rectangle Border

Create a border by subtracting an inner rectangle mask from an outer one.

## Overview
- Follow the steps to complete the exercise.

## Learning Objectives
- Build rectangle masks with step
- Combine masks using subtraction

## Prerequisites
- simple-rectangle
- step-function-mask

## Key Concepts
- `vUv` is normalized UV in `[0,1]`.

```glsl
vec2 uv = vUv;
```
- Blend values with `mix(a, b, t)`.

```glsl
vec3 color = mix(colorA, colorB, t);
```
- Build a hard mask with `step`.

```glsl
float mask = step(0.5, uv.x);
```

## How To Implement (Step-by-step)
- Start from vUv.
- Build a hard mask with step().
- Use mix() to blend outputs.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
