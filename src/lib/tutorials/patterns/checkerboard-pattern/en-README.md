
# Checkerboard Pattern

Combine the mod() function with floor() to generate a black and white checkerboard texture.

## Overview
- Implement a horizontal gradient using UV as the factor.

## Learning Objectives
- Understand how the `floor()` function rounds down and the `mod()` function calculates the modulus.
- Learn how to control the size of the checkerboard by scaling UV coordinates.
- Master the logic of distinguishing different squares by using `mod(sum, 2.0)` on the result of `floor(uv.x) + floor(uv.y)`.
- Be able to generate checkerboard patterns with custom colors and sizes.

## Prerequisites
- uv-coordinates
- step-function-mask

## Key Concepts
- A horizontal gradient uses a 0-1 factor (usually UV) to blend colors.

```glsl
float t = vUv.x;
vec3 color = vec3(t);
```
- Keep the factor inside `[0,1]`.

```glsl
t = clamp(t, 0.0, 1.0);
```

## How To Implement (Step-by-step)
- Set factor: `t = vUv.x`.
- Map `t` to a color (grayscale or `mix`).
- Output `gl_FragColor` with alpha=1.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
