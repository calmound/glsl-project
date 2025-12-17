<!-- AUTO-GENERATED: tutorial-readme -->
# Lambert Lighting (Sphere)

Shade a sphere with Lambert diffuse lighting using an estimated normal.

## Overview
- Compute lighting terms and shade a shape.

## Learning Objectives
- Estimate a normal
- Compute diffuse term with dot(n,l)

## Prerequisites
- simple-circle
- smooth-edges

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
