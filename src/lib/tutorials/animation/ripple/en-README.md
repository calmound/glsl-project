<!-- AUTO-GENERATED: tutorial-readme -->
# Ripple

Create circular ripples by combining distance and time in a sine wave.

## Overview
- Follow the steps to complete the exercise.

## Learning Objectives
- Use distance as wave input
- Animate phase with time

## Prerequisites
- simple-circle
- time-pulse

## Inputs
- `float u_time` — Time in seconds.

## Key Concepts
- `vUv` is normalized UV in `[0,1]`.

```glsl
vec2 uv = vUv;
```
- Animate with `u_time` + `sin/cos`.

```glsl
float pulse = sin(u_time) * 0.5 + 0.5;
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
- Animate with u_time (optional).

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
