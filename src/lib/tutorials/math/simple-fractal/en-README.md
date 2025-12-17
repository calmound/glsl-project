<!-- AUTO-GENERATED: tutorial-readme -->
# Simple Fractals

Learn to create simple fractal patterns and understand the application of recursion and self-similarity concepts in shaders.

## Overview
- Implement a horizontal gradient using UV as the factor.

## Learning Objectives
- Understand the basic concept of self-similarity in fractal patterns.
- Learn to generate simple fractals in a fragment shader through iteration or recursion.
- Master the application of coordinate transformations (e.g., scaling, translation) in fractal generation.
- Understand how to control the number of iterations to adjust the complexity and detail of fractals.

## Prerequisites
- uv-coordinates
- pattern-repetition

## Inputs
- `float u_time` — Time in seconds.
- `vec2 u_resolution` — Canvas size in pixels.

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
- distance = length(pos)
- fractal += circle * amplitude
- amplitude *= 0.5

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
- Don’t use raw pixels without normalization.
- Make sure `edge0 < edge1` for smoothstep().
- Change frequency by scaling before fract().
