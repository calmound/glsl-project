<!-- AUTO-GENERATED: tutorial-readme -->
# Color Mixing

Learn to use the mix function for color blending and understand the concept and application of linear interpolation.

## Overview
- Implement a horizontal gradient using UV as the factor.

## Learning Objectives
- Master the usage of the mix() function
- Understand the mathematical principles of linear interpolation
- Learn how to create smooth transitions between two colors
- Understand how the interpolation factor affects blending results

## Prerequisites
- solid-color

## Inputs
- `vec2 u_resolution` — Canvas size in pixels.

## Key Concepts
- Normalize pixel coordinates to UV.

```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
```
- A horizontal gradient uses a 0-1 factor (usually UV) to blend colors.

```glsl
float t = uv.x;
vec3 color = mix(colorA, colorB, t);
```
- Keep the factor inside `[0,1]`.

```glsl
t = clamp(t, 0.0, 1.0);
```

## How To Implement (Step-by-step)
- Normalize coordinates: `uv = gl_FragCoord.xy / u_resolution.xy`.
- Set factor: `t = uv.x`.
- Map `t` to a color (grayscale or `mix`).
- Output `gl_FragColor` with alpha=1.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
- Don’t use raw pixels without normalization.
