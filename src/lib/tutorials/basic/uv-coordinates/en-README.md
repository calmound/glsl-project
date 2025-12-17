<!-- AUTO-GENERATED: tutorial-readme -->
# UV Coordinates Basics

Understanding UV coordinate system in shaders and its applications. Learn how to map UV coordinates to colors to create gradient effects.

## Overview
- Follow the steps to complete the exercise.

## Learning Objectives
- Understand the UV coordinate system (typically ranging from 0 to 1) and its representation on a 2D plane.
- Learn how to access built-in UV coordinates in a fragment shader (e.g., `gl_FragCoord.xy / u_resolution.xy`).
- Master using the x or y component of UV coordinates directly as values for color channels to create simple linear gradients.
- Understand that UV coordinates are fundamental for texture mapping.

## Prerequisites
- solid-color

## Inputs
- `vec2 u_resolution` — Canvas size in pixels.

## Key Concepts
- Normalize pixel coordinates using `u_resolution`.

```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
```
- Blend values with `mix(a, b, t)`.

```glsl
vec3 color = mix(colorA, colorB, t);
```
- Build a hard mask with `step`.

```glsl
float mask = step(0.5, uv.x);
```
- Use `floor/fract/mod` for tiling and repetition.

```glsl
vec2 cell = floor(uv * 10.0);
float m = mod(cell.x + cell.y, 2.0);
```

## How To Implement (Step-by-step)
- Normalize coordinates to UV.
- Build a hard mask with step().
- Use floor/fract/mod for repetition or patterns.
- Use mix() to blend outputs.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
- Don’t use raw pixels without normalization.
- Change frequency by scaling before fract().
