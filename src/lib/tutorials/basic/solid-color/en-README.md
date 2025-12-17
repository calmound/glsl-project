<!-- AUTO-GENERATED: tutorial-readme -->
# Solid Color Fill

Learn the most basic shader concepts and create solid color fill effects. Understand the role of gl_FragColor and RGBA color mode.

## Overview
- Follow the steps to complete the exercise.

## Learning Objectives
- Understand the basic structure of a GLSL shader and the entry point `main()` function.
- Learn how to use `gl_FragColor` to output fragment color.
- Master the RGBA color model and how to represent color values in GLSL (0.0 to 1.0 range).
- Be able to write a minimal GLSL shader to fill the entire canvas with a single color.

## Inputs
- `float u_time` — Time in seconds.
- `vec2 u_resolution` — Canvas size in pixels.

## Key Concepts
- Animate with `u_time` + `sin/cos`.

```glsl
float pulse = sin(u_time) * 0.5 + 0.5;
```

## How To Implement (Step-by-step)
- Animate with u_time (optional).

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- If output is black, check your mask/factor isn’t always 0.
