
# Two-Color Blended Gradient

Achieve a left-to-right two-color gradient effect on the screen through linear interpolation, mastering the basics of blending and UV coordinates in GLSL.

## Overview
- Implement a horizontal gradient using UV as the factor.

## Learning Objectives
- Understand the application of linear interpolation (mix function) in color blending.
- Learn how to use the x-component of UV coordinates to control the gradient direction.
- Master creating simple two-color horizontal gradient effects.
- Understand how colors are represented and manipulated in GLSL.

## Prerequisites
- uv-coordinates
- solid-color

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
