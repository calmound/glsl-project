
# Radial Gradient Center

Create an outward-spreading radial gradient starting from the canvas center using distance().

## Overview
- Follow the steps to complete the exercise.

## Learning Objectives
- Understand how to calculate the distance from a pixel to the canvas center.
- Learn to use the `distance()` function to create radial effects.
- Master how to map distance values to color gradients.

## Prerequisites
- uv-coordinates
- simple-circle

## Key Concepts
- `vUv` is normalized UV in `[0,1]`.

```glsl
vec2 uv = vUv;
```
- Blend values with `mix(a, b, t)`.

```glsl
vec3 color = mix(colorA, colorB, t);
```
- Distance fields with `length/distance`.

```glsl
float d = length(uv - 0.5);
```

## How To Implement (Step-by-step)
- Start from vUv.
- Compute a distance value for masks/shapes.
- Use mix() to blend outputs.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
