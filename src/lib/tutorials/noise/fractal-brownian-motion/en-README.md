
# Fractal Brownian Motion (FBM)

Create complex patterns with self-similarity by layering multiple noise octaves (usually Perlin or Simplex noise) with varying frequencies and amplitudes, often used to generate natural phenomena like mountains, clouds, and water surfaces.

## Overview
- Generate procedural noise and map it to color.

## Learning Objectives
- Understand the basic principle of Fractal Brownian Motion: achieved by iteratively layering noise.
- Learn how to implement the FBM algorithm in GLSL, including controlling octaves, persistence, and lacunarity.
- Master how to use FBM to generate natural-looking textures like terrain and clouds.
- Be able to adjust FBM parameters to achieve different styles of noise effects.

## Prerequisites
- noise-functions
- looping-constructs

## Inputs
- `vec2 u_resolution` — Canvas size in pixels.
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
- Don’t use raw pixels without normalization.
- Make sure `edge0 < edge1` for smoothstep().
- Change frequency by scaling before fract().
