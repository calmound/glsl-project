<!-- AUTO-GENERATED: tutorial-readme -->
# Ping-Pong Band

Move a soft band left and right using sin(u_time).

## Overview
- Implement a horizontal gradient using UV as the factor.

## Learning Objectives
- Animate with u_time

## Prerequisites
- uv-coordinates

## Inputs
- `float u_time` — Time in seconds.

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
- Make sure `edge0 < edge1` for smoothstep().
