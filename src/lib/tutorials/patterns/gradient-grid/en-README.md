
# Gradient Grid

Practice building repeating patterns from UV coordinates.

## Overview
- Follow the steps to complete the exercise.

## Learning Objectives
- Use floor/fract/step to create patterns

## Prerequisites
- uv-coordinates

## Key Concepts
- `vUv` is normalized UV in `[0,1]`.

```glsl
vec2 uv = vUv;
```
- Use `floor/fract/mod` for tiling and repetition.

```glsl
vec2 cell = floor(uv * 10.0);
float m = mod(cell.x + cell.y, 2.0);
```

## How To Implement (Step-by-step)
- Start from vUv.
- Use floor/fract/mod for repetition or patterns.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- If output is black, check your mask/factor isn’t always 0.
