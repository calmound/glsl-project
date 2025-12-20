
# 2D Rotation Matrix

Rotate coordinates using a 2D rotation matrix.

## Overview
- Follow the steps to complete the exercise.

## Learning Objectives
- Build mat2 rotation
- Apply rotation to shapes

## Prerequisites
- uv-coordinates
- time-pulse

## Inputs
- `float u_time` — Time in seconds.

## Key Concepts
- `vUv` is normalized UV in `[0,1]`.

```glsl
vec2 uv = vUv;
```
- Animate with `u_time` + `sin/cos`.

```glsl
float pulse = sin(u_time) * 0.5 + 0.5;
```
- Blend values with `mix(a, b, t)`.

```glsl
vec3 color = mix(colorA, colorB, t);
```
- Build a soft mask with `smoothstep`.

```glsl
float m = 1.0 - smoothstep(r, r + aa, d);
```

## How To Implement (Step-by-step)
- Start from vUv.
- Build a soft mask with smoothstep().
- Use mix() to blend outputs.
- Animate with u_time (optional).

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
- Make sure `edge0 < edge1` for smoothstep().
