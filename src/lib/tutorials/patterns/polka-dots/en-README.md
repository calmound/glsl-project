
# Polka Dots

Build a dot pattern on a grid and draw circles in each cell.

## Overview
- Use a distance field and a mask to shape the image.

## Learning Objectives
- Use fract() grid cells
- Draw circles with smoothstep

## Prerequisites
- simple-circle
- uv-coordinates

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
- Change frequency by scaling before fract().
