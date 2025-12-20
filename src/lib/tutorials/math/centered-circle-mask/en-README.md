
# Centered Circle Mask

Create a mask area centered on the canvas using distance().

## Overview
- Use a distance field and a mask to shape the image.

## Learning Objectives
- Understand how the `distance()` function calculates the distance between two points.
- Learn how to use the screen center as a reference point to calculate the distance of each fragment to the center.
- Master using distance and a threshold (e.g., combined with `step()` or `smoothstep()`) to create a circular mask.
- Be able to apply a circular mask to show or hide content in specific areas.

## Prerequisites
- simple-circle
- step-function-mask

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
