<!-- AUTO-GENERATED: tutorial-readme -->
# Smooth Edges

Learn to create smooth edge transition effects using the smoothstep function, contrasting with the hard edges of the step function.

## Overview
- Use a distance field and a mask to shape the image.

## Learning Objectives
- Understand the three parameters of the `smoothstep()` function and their roles.
- Learn how to use `smoothstep()` to create a smooth transition between two values.
- Compare the effect differences between `smoothstep()` and `step()` in edge processing.
- Master applying `smoothstep()` to shape edges to achieve anti-aliasing or softening effects.

## Prerequisites
- simple-circle
- step-function-mask

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
- Clamp `t` into `[0,1]` when needed.
- Don’t use raw pixels without normalization.
- Make sure `edge0 < edge1` for smoothstep().
