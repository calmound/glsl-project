
# Diagonal Gradient

Combine vUv.x and vUv.y to create a diagonal gradient and interpolate colors with mix.

## Overview
- Implement a horizontal gradient using UV as the factor.

## Learning Objectives
- Build a gradient factor from UV coordinates.
- Clamp values into a valid range.
- Interpolate between two colors with mix.

## Prerequisites
- uv-visualizer
- color-mixing

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
