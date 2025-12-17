<!-- AUTO-GENERATED: tutorial-readme -->
# Color Cycle

Cycle RGB channels over time using sin().

## Overview
- Follow the steps to complete the exercise.

## Learning Objectives
- Animate with u_time

## Prerequisites
- uv-coordinates

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

## How To Implement (Step-by-step)
- Start from vUv.
- Animate with u_time (optional).

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- If output is black, check your mask/factor isn’t always 0.
