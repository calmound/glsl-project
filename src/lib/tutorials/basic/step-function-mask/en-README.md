
# Step Function Mask

Construct a mask with clear boundaries using the step() function, mastering binary processing in GLSL.

## Overview
- Implement a horizontal gradient using UV as the factor.

## Learning Objectives
- Understand how the `step(edge, x)` function works and how it returns 0.0 or 1.0.
- Learn to use the `step()` function to create hard edge effects based on a threshold.
- Master applying the `step()` function to distance fields or UV coordinates to create shape masks.
- Be able to use masks to achieve coloring or effects in specific areas.

## Prerequisites
- simple-circle
- uv-coordinates

## Key Concepts
- A horizontal gradient uses a 0-1 factor (usually UV) to blend colors.

```glsl
float t = vUv.x;
vec3 color = vec3(t);
```
- Keep the factor inside `[0,1]`.

```glsl
t = clamp(t, 0.0, 1.0);
```

## How To Implement (Step-by-step)
- Set factor: `t = vUv.x`.
- Map `t` to a color (grayscale or `mix`).
- Output `gl_FragColor` with alpha=1.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
