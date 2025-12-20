
# Simple Rectangle

Learn to draw rectangles using conditional statements and understand coordinate ranges and boundary detection.

## Overview
- Implement a horizontal gradient using UV as the factor.

## Learning Objectives
- Understand how to use logical AND (&&) to combine conditions to define a rectangular area.
- Learn to perform boundary detection based on the x and y values of UV coordinates.
- Master drawing simple shapes in GLSL using conditional statements (e.g., `if` or `step`).

## Prerequisites
- uv-coordinates
- solid-color

## Inputs
- `vec2 u_resolution` — Canvas size in pixels.
- `float u_time` — Time in seconds.

## Key Concepts
- Normalize pixel coordinates to UV.

```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
```
- A horizontal gradient uses a 0-1 factor (usually UV) to blend colors.

```glsl
float t = uv.x;
vec3 color = vec3(t);
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
