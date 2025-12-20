
# Brick Wall

Practice building repeating patterns from UV coordinates.

## Overview
- Implement a horizontal gradient using UV as the factor.

## Learning Objectives
- Use floor/fract/step to create patterns

## Prerequisites
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
- Change frequency by scaling before fract().
