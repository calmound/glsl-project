
# Breathing Color Block

Implement a periodically changing color breathing animation using the sin() function and a time variable.

## Overview
- Follow the steps to complete the exercise.

## Learning Objectives
- Understand how to use the `sin()` function and `u_time` to create smooth periodic changes.
- Learn to map periodically changing values to color channels.
- Master creating animation effects where colors transition smoothly over time.
- Understand how to adjust the frequency and amplitude of the `sin()` function to change the speed and range of the animation.

## Prerequisites
- time-animation
- solid-color

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
