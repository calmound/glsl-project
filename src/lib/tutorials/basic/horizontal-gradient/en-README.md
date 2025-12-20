
# Horizontal Gradient

Create a simple left-to-right gradient using vUv.x and mix().

## Overview
- Implement a horizontal gradient using UV as the factor.

## Learning Objectives
- Use vUv.x as a 0-1 factor
- Blend two colors with mix()

## Prerequisites
- uv-visualizer

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
