
# Normal Visualizer

Learn core lighting terms (diffuse/specular/rim) on a simple sphere.

## Overview
- Follow the steps to complete the exercise.

## Learning Objectives
- Understand the math behind the lighting term

## Prerequisites
- lambert-sphere

## Key Concepts
- `vUv` is normalized UV in `[0,1]`.

```glsl
vec2 uv = vUv;
```
- Distance fields with `length/distance`.

```glsl
float d = length(uv - 0.5);
```

## How To Implement (Step-by-step)
- Start from vUv.
- Compute a distance value for masks/shapes.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- If output is black, check your mask/factor isn’t always 0.
