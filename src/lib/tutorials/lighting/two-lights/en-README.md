<!-- AUTO-GENERATED: tutorial-readme -->
# Two Lights

Learn core lighting terms (diffuse/specular/rim) on a simple sphere.

## Overview
- Compute lighting terms and shade a shape.

## Learning Objectives
- Understand the math behind the lighting term

## Prerequisites
- lambert-sphere

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
