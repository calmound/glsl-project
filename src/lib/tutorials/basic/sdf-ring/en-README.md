
# SDF Ring

Draw a ring using a distance field: abs(length(p) - r) and smoothstep for smooth edges.

## Overview
- Use a distance field and a mask to shape the image.

## Learning Objectives
- Understand distance fields as shape boundaries.
- Build a ring distance with abs(length(p) - r).
- Use smoothstep for anti-aliased / soft edges.

## Prerequisites
- simple-circle
- smooth-edges

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
