<!-- AUTO-GENERATED: tutorial-readme -->
# Gradient Effects

Learn to create various gradient effects, including linear gradients, radial gradients, angular gradients, and dynamic blending

## Overview
- Use polar angle as a gradient factor.

## Learning Objectives
- Master methods for creating various gradient effects
- Understand the differences between linear and radial gradients
- Learn to implement angular and wave gradients
- Understand how to dynamically blend multiple gradient effects

## Prerequisites
- basic-gradients
- uv-coordinates

## Inputs
- `float u_time` — Time in seconds.
- `vec2 u_resolution` — Canvas size in pixels.

## Key Concepts
- Angle comes from `atan(y, x)`.

```glsl
float a = atan(p.y, p.x);
```
- Normalize angle to `[0,1]` and use it as a factor.

```glsl
float t = (a + PI) / (2.0 * PI);
```

## How To Implement (Step-by-step)
- Center coordinates: `p = vUv - 0.5`.
- Angle: `a = atan(p.y, p.x)`.
- Normalize: `t = (a + PI) / (2*PI)`.
- Use `t` to mix colors.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
- Don’t use raw pixels without normalization.
- Make sure `edge0 < edge1` for smoothstep().
