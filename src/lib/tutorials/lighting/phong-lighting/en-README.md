<!-- AUTO-GENERATED: tutorial-readme -->
# Phong Lighting Model

Implement the basic Phong lighting model to simulate ambient, diffuse, and specular highlights on object surfaces.

## Overview
- Compute lighting terms and shade a shape.

## Learning Objectives
- Understand the basic components of the Phong lighting model: ambient, diffuse, and specular reflection.
- Learn how to calculate light vectors, view vectors, and reflection vectors in GLSL.
- Master the formulas for diffuse and specular reflection and the meaning of their parameters.
- Be able to implement a basic Phong lighting shader and observe the effects of adjusting parameters.

## Prerequisites
- vector-math
- normal-vectors

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
- Don’t use raw pixels without normalization.
