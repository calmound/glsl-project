<!-- AUTO-GENERATED: tutorial-readme -->
# Smooth Band

Create a soft horizontal band using smoothstep().

## Overview
- Implement a vertical gradient using UV as the factor.

## Learning Objectives
- Practice coordinate-based coloring

## Prerequisites
- uv-coordinates

## Key Concepts
- A vertical gradient uses a 0-1 factor (usually UV) to blend colors.

```glsl
float t = vUv.y;
vec3 color = vec3(t);
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
- Make sure `edge0 < edge1` for smoothstep().
