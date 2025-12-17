<!-- AUTO-GENERATED: tutorial-readme -->
# Smoothstep Edge Fade

Use smoothstep() to achieve a fade transition at the edges of a shape, contrasting with step().

## Overview
- Use a distance field and a mask to shape the image.

## Learning Objectives
- Gain a deeper understanding of the application of `smoothstep()` in edge processing.
- Learn how to control the range and intensity of the fade by adjusting the parameters of `smoothstep()`.
- Master creating graphical effects with soft edges.
- Be able to explain the main visual differences between `smoothstep()` and `step()`.

## Prerequisites
- smooth-edges
- step-function

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
