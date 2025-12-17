<!-- AUTO-GENERATED: tutorial-readme -->
# Toon Shading

Implement a non-photorealistic rendering technique that simulates the visual style of cartoons or comic books by quantizing light intensity into discrete color levels, often combined with edge detection.

## Overview
- Compute lighting terms and shade a shape.

## Learning Objectives
- Understand the basic principles of toon shading: discretization of lighting.
- Learn how to use `step()` or `floor()` functions to map continuous light intensity to a limited number of color levels.
- Master basic edge detection methods (e.g., based on the dot product of normal and view direction) and their application in toon shading.
- Be able to implement a toon shader with hard shadows and outlines.
- Explore how to change the style of toon rendering by adjusting the number of color levels and colors.

## Prerequisites
- phong-lighting
- step-function
- edge-detection-techniques

## Inputs
- `vec2 u_resolution` — Canvas size in pixels.
- `float u_time` — Time in seconds.

## Key Concepts
- Diffuse lighting uses `max(dot(n, l), 0.0)`.

```glsl
float diff = max(dot(n, lightDir), 0.0);
```
- Specular highlights use `pow` (Phong/Blinn-Phong).

```glsl
float spec = pow(max(dot(r, v), 0.0), shininess);
```

## How To Implement (Step-by-step)
- Get normal `n` and a normalized light direction.
- Compute diffuse term with `dot(n, l)`.
- Optionally compute specular with `pow`.
- Combine terms and output.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
- Don’t use raw pixels without normalization.
- Make sure `edge0 < edge1` for smoothstep().
