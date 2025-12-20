
# Color Blending Gradient

Implement a horizontal gradient between red and blue using the mix() function to help understand linear interpolation.

## Overview
- Implement a horizontal gradient using UV as the factor.

## Learning Objectives
- Gain a deeper understanding of how the `mix(colorA, colorB, factor)` function interpolates between two colors based on a factor.
- Learn to use the x-component of UV coordinates as the interpolation factor for the `mix` function.
- Master creating gradient effects that smoothly transition from one specified color to another.
- Be able to adjust the interpolation factor to change the way the gradient transitions.

## Prerequisites
- basic-color-blend
- uv-coordinates

## Key Concepts
- A horizontal gradient uses a 0-1 factor (usually UV) to blend colors.

```glsl
float t = vUv.x;
vec3 color = mix(colorA, colorB, t);
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
