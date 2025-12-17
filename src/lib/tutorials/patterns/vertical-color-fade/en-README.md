<!-- AUTO-GENERATED: tutorial-readme -->
# Vertical Color Fade

Implement a bottom-to-top color gradient based on vUv.y, suitable for practicing UV coordinate usage.

## Overview
- Implement a vertical gradient using UV as the factor.

## Learning Objectives
- Learn how to use the y-component of UV coordinates to control color changes.
- Master creating a vertical linear gradient from one color to another.
- Understand the basic application of the `mix()` function in color interpolation.
- Be able to adjust the start and end colors of the gradient.

## Prerequisites
- uv-coordinates
- basic-gradients

## Key Concepts
- A vertical gradient uses a 0-1 factor (usually UV) to blend colors.

```glsl
float t = vUv.y;
vec3 color = mix(colorA, colorB, t);
```
- Keep the factor inside `[0,1]`.

```glsl
t = clamp(t, 0.0, 1.0);
```

## How To Implement (Step-by-step)
- Set factor: `t = vUv.y`.
- Map `t` to a color (grayscale or `mix`).
- Output `gl_FragColor` with alpha=1.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
