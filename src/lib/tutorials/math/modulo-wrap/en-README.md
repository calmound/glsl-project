
# Modulo Wrap

Practice core GLSL math building blocks used across shaders.

## Overview
- Create repeating stripes using `fract` and `step`.

## Learning Objectives
- Understand the math behind the effect

## Prerequisites
- uv-coordinates

## Key Concepts
- Stripes come from repeating coordinates with `fract` and converting them to a 0/1 mask.

```glsl
float count = 12.0;
float v = fract(vUv.x * count);
float mask = step(0.5, v);
```
- Use `mix` to select between two colors.

```glsl
vec3 color = mix(colorA, colorB, mask);
```

## How To Implement (Step-by-step)
- Repeat with `fract(vUv.x * count)`.
- Convert to mask with `step(0.5, v)`.
- Use `mix` to switch colors by mask.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Change frequency by scaling before fract().
