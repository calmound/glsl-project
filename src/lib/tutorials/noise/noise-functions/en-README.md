<!-- AUTO-GENERATED: tutorial-readme -->
# Noise Functions

Learn and implement common noise functions in GLSL, such as random noise, value noise, and gradient noise (like a simplified version of Perlin noise), used for generating various procedural textures and effects.

## Overview
- Generate procedural noise and map it to color.

## Learning Objectives
- Understand the basic principles and characteristics of different types of noise (random noise, value noise, gradient noise).
- Learn how to implement a simple pseudo-random number generator in GLSL.
- Master the implementation of value noise, including lattice points and interpolation.
- Gain an initial understanding of the concept and implementation ideas of gradient noise (like Perlin noise).
- Be able to use the learned noise functions to generate simple procedural textures.

## Prerequisites
- glsl-data-types
- glsl-functions
- vector-operations

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
