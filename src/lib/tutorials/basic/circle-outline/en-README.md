
# Circle Outline

Draw a ring by using abs(distance - radius) and smoothstep().

## Overview
- Draw a ring by measuring distance to a circle boundary.

## Learning Objectives
- Compute distance to center
- Build a ring mask from abs(d-r)

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
float ringDist = abs(d - r);
float mask = 1.0 - smoothstep(w, w + aa, ringDist);
```

## How To Implement (Step-by-step)
- Compute distance `d` from center.
- Compute ring distance: `abs(d - r)`.
- Convert ring distance to mask with `smoothstep`.
- Mix colors and output.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
- Make sure `edge0 < edge1` for smoothstep().
