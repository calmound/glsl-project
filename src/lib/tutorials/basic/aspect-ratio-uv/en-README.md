<!-- AUTO-GENERATED: tutorial-readme -->
# Aspect-Ratio Corrected UV

Learn to correct UV aspect ratio with u_resolution so circles stay round on non-square canvases.

## Overview
- Use a distance field and a mask to shape the image.

## Learning Objectives
- Understand how canvas aspect ratio affects shapes.
- Compute aspect from u_resolution and correct coordinates.
- Draw an undistorted circle using a distance field (length).

## Prerequisites
- uv-coordinates

## Inputs
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
- Center coordinates: `p = vUv - 0.5`.
- Compute distance: `d = length(p)`.
- Build a mask with `smoothstep` or `step`.
- Mix foreground/background by the mask.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
- Make sure `edge0 < edge1` for smoothstep().
