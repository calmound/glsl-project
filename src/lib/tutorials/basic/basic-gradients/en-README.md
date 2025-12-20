
# Basic Gradient Effects

Learn how to create linear and radial gradient effects using GLSL

## Overview
- Implement a vertical gradient using UV as the factor.

## Learning Objectives
- Understand the principles of linear gradients
- Learn the mathematical foundations of radial gradients
- Master color blending techniques in GLSL

## Inputs
- `vec2 u_resolution` — Canvas size in pixels.
- `float u_time` — Time in seconds.

## Key Concepts
- Normalize pixel coordinates to UV.

```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
```
- A vertical gradient uses a 0-1 factor (usually UV) to blend colors.

```glsl
float t = uv.y;
vec3 color = vec3(t);
```
- Keep the factor inside `[0,1]`.

```glsl
t = clamp(t, 0.0, 1.0);
```

## How To Implement (Step-by-step)
- Normalize coordinates: `uv = gl_FragCoord.xy / u_resolution.xy`.
- Set factor: `t = uv.y`.
- Map `t` to a color (grayscale or `mix`).
- Output `gl_FragColor` with alpha=1.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Don’t use raw pixels without normalization.
