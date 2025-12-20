
# Centered UV Visual

Visualize centered UV (vUv-0.5) as colors.

## Overview
- Follow the steps to complete the exercise.

## Learning Objectives
- Practice coordinate-based coloring

## Prerequisites
- uv-coordinates

## Key Concepts
- `vUv` is normalized UV in `[0,1]`.

```glsl
vec2 uv = vUv;
```

## How To Implement (Step-by-step)
- Start from vUv.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- If output is black, check your mask/factor isn’t always 0.
