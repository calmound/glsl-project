
# SDF Rectangle

Practice core GLSL math building blocks used across shaders.

## Overview
- Follow the steps to complete the exercise.

## Learning Objectives
- Understand the math behind the effect

## Prerequisites
- uv-coordinates

## Key Concepts
- `vUv` is normalized UV in `[0,1]`.

```glsl
vec2 uv = vUv;
```
- Build a soft mask with `smoothstep`.

```glsl
float m = 1.0 - smoothstep(r, r + aa, d);
```
- Distance fields with `length/distance`.

```glsl
float d = length(uv - 0.5);
```

## How To Implement (Step-by-step)
- Start from vUv.
- Compute a distance value for masks/shapes.
- Build a soft mask with smoothstep().

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Make sure `edge0 < edge1` for smoothstep().
