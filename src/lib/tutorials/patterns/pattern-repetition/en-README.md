<!-- AUTO-GENERATED: tutorial-readme -->
# Pattern Repetition

Learn how to create repetitive geometric patterns, including grid systems, random variations, and animation effects

## Overview
- Use a distance field and a mask to shape the image.

## Learning Objectives
- Master methods for creating grid systems
- Learn to use the fract function to create repetitive effects
- Understand how to add random variations to each grid cell
- Master procedural pattern generation techniques

## Prerequisites
- coordinate-transformation
- simple-circle

## Inputs
- `float u_time` — Time in seconds.
- `vec2 u_resolution` — Canvas size in pixels.

## Key Concepts
- Distance to center builds a distance field.

```glsl
vec2 p = vUv - 0.5;
float d = length(p);
```
- Convert distance into a mask.

```glsl
float mask = 1.0 - smoothstep(r, r + aa, d);
```

## How To Implement (Step-by-step)
- centered = repeated - vec2(0.5)
- cross = max(horizontal, vertical)

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
- Don’t use raw pixels without normalization.
- Make sure `edge0 < edge1` for smoothstep().
- Change frequency by scaling before fract().
