<!-- AUTO-GENERATED: tutorial-readme -->
# Drawing Circles

Learn to draw basic shapes using distance functions and understand the pixel coordinate system and distance function applications.

## Overview
- Use a distance field and a mask to shape the image.

## Learning Objectives
- Understand the pixel coordinate system and how to center coordinates.
- Master the usage of the `distance()` function to calculate the distance from a point to the circle's center.
- Learn how to draw a circle based on distance and radius.
- Understand the application of `step()` or `smoothstep()` functions in edge handling.

## Prerequisites
- uv-coordinates

## Inputs
- `vec2 u_resolution` — Canvas size in pixels.
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
- Center coordinates: `p = vUv - 0.5`.
- Compute distance: `d = length(p)`.
- Build a mask with `smoothstep` or `step`.
- Mix foreground/background by the mask.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Don’t use raw pixels without normalization.
