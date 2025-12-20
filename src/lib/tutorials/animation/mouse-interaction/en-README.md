
# Mouse Interaction

Learn to create interactive effects using mouse coordinates and understand the passing and usage of uniform variables.

## Overview
- Use a distance field and a mask to shape the image.

## Learning Objectives
- Understand how to receive and use mouse coordinates (`u_mouse`) in GLSL.
- Learn to dynamically change shader output based on mouse position.
- Master the method of passing data between CPU and GPU using uniform variables.

## Prerequisites
- uv-coordinates
- uniforms

## Inputs
- `vec2 u_resolution` — Canvas size in pixels.
- `vec2 u_mouse` — Mouse position in pixels.
- `float u_time` — Time in seconds.

## Key Concepts
- Distance to center builds a distance field.

```glsl
vec2 p = vUv - 0.5;
float d = length(p);
```
- Convert distance into a mask.

```glsl
float mask = 1.0 - smoothstep(r, r + aa, d);
```

## How To Implement (Step-by-step)
- mouse = u_mouse / u_resolution
- distToMouse = distance(uv, mouse)
- mouseColor = vec3(mouse, 0.5)
- pulse = sin(u_time * speed) * 0.5 + 0.5

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
- Don’t use raw pixels without normalization.
- Make sure `edge0 < edge1` for smoothstep().
