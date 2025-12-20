
# Circle Drawing (Distance Function)

Draw a circle using normalized coordinates and the distance function length(), then color it with a simple conditional.

## Overview
- Follow the steps to complete the exercise.

## Learning Objectives
- Convert gl_FragCoord into normalized coordinates.
- Use length() to compute distance to the center.
- Use a distance threshold to decide inside/outside and output different colors.

## Prerequisites
- uv-coordinates
- simple-circle

## Inputs
- `vec2 u_resolution` — Canvas size in pixels.

## Key Concepts
- Normalize pixel coordinates using `u_resolution`.

```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
```
- Distance fields with `length/distance`.

```glsl
float d = length(uv - 0.5);
```

## How To Implement (Step-by-step)
- Normalize coordinates to UV.
- Compute a distance value for masks/shapes.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Don’t use raw pixels without normalization.
