<!-- AUTO-GENERATED: tutorial-readme -->
# Time Animation

Learn to create time-based animation effects using the u_time uniform variable and understand the application of sin functions in animation.

## Overview
- Use a distance field and a mask to shape the image.

## Learning Objectives
- Understand how the `u_time` uniform variable passes time to the shader.
- Learn to use the time variable to change colors, shapes, or positions to create animations.
- Master using `sin()` or `cos()` functions combined with `u_time` to create smooth periodic animations.
- Be able to implement simple blinking, pulsing, or moving effects.

## Prerequisites
- solid-color
- uv-coordinates

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
