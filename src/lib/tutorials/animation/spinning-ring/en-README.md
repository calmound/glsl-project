
# Spinning Ring

Rotate polar angle and colorize a ring.

## Overview
- Use polar angle as a gradient factor.

## Learning Objectives
- Animate with u_time

## Prerequisites
- uv-coordinates

## Inputs
- `float u_time` — Time in seconds.

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
- Make sure `edge0 < edge1` for smoothstep().
