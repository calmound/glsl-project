<!-- AUTO-GENERATED: tutorial-readme -->
# Coordinate Transformation

Learn the basic principles of 2D coordinate transformations, including rotation, scaling, and creating repetitive patterns

## Overview
- Use a distance field and a mask to shape the image.

## Learning Objectives
- Understand the basic principles of 2D coordinate transformations
- Master the construction and application of rotation matrices
- Learn how to implement scaling transformations
- Understand how to combine multiple transformations to create complex effects

## Prerequisites
- uv-coordinates
- simple-circle

## Inputs
- `float u_time` — Time in seconds.

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
- centered = uv - vec2(0.5)
- scaled = rotated * scale
- distance = length(cellCenter)

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
- Don’t use raw pixels without normalization.
- Make sure `edge0 < edge1` for smoothstep().
- Change frequency by scaling before fract().
