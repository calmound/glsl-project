<!-- AUTO-GENERATED: tutorial-readme -->
# Horizontal Stripes

Create horizontal stripes using fract() and step().

## Overview
- Create repeating stripes using `fract` and `step`.

## Learning Objectives
- Build repeating patterns

## Prerequisites
- uv-coordinates

## Key Concepts
- Stripes come from repeating coordinates with `fract` and converting them to a 0/1 mask.

```glsl
float count = 12.0;
float v = fract(vUv.y * count);
float mask = step(0.5, v);
```
- Use `mix` to select between two colors.

```glsl
vec3 color = mix(colorA, colorB, mask);
```

## How To Implement (Step-by-step)
- Repeat with `fract(vUv.y * count)`.
- Convert to mask with `step(0.5, v)`.
- Use `mix` to switch colors by mask.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
- Change frequency by scaling before fract().
