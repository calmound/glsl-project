
# Noise Color Map

Learn procedural noise building blocks and common stylizations.

## Overview
- Generate procedural noise and map it to color.

## Learning Objectives
- Combine noise functions for richer textures

## Prerequisites
- value-noise

## Inputs
- `float u_time` — Time in seconds.

## Key Concepts
- Noise is built from random values on a grid plus smooth interpolation.

```glsl
vec2 i = floor(p);
vec2 f = fract(p);
vec2 u = f*f*(3.0-2.0*f);
float n = mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
```
- Map noise to color with `mix` or thresholds.

```glsl
vec3 color = mix(colorA, colorB, n);
```

## How To Implement (Step-by-step)
- Scale UV to control frequency (e.g. `p = vUv * 6.0`).
- Compute base noise (hash/valueNoise).
- Optionally sum octaves (FBM) for detail.
- Map noise to grayscale or color.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
- Change frequency by scaling before fract().
