
# UV Visualizer

Directly convert UV coordinates to color values to facilitate understanding of vUv color mapping.

## Overview
- Follow the steps to complete the exercise.

## Learning Objectives
- Learn how to map the x and y components of UV coordinates to the R and G channels of color, respectively.
- Understand how this visualization method can help debug and understand the distribution of UV coordinates.
- Be able to create a simple UV visualizer shader.
- Recognize the importance of UV coordinates in texture sampling and procedural pattern generation.

## Prerequisites
- uv-coordinates

## Key Concepts
- `vUv` is normalized UV in `[0,1]`.

```glsl
vec2 uv = vUv;
```

## How To Implement (Step-by-step)
- Start from vUv.

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- If output is black, check your mask/factor isn’t always 0.
