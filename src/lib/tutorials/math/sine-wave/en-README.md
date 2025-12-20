
# Sine Wave Animation

Learn to create wave effects using the sin function and understand the concepts of frequency, amplitude, and phase.

## Overview
- Implement a horizontal gradient using UV as the factor.

## Learning Objectives
- Understand how the `sin()` function generates periodic waveforms.
- Learn to adjust frequency, amplitude, and phase parameters to change waveform characteristics.
- Master combining the time variable `u_time` with the `sin()` function to create dynamic waveforms.
- Understand how to apply waveforms to color changes or shape displacements.

## Prerequisites
- uv-coordinates
- time-animation

## Inputs
- `vec2 u_resolution` — Canvas size in pixels.
- `float u_time` — Time in seconds.

## Key Concepts
- Normalize pixel coordinates to UV.

```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
```
- A horizontal gradient uses a 0-1 factor (usually UV) to blend colors.

```glsl
float t = uv.x;
vec3 color = vec3(t);
```
- Keep the factor inside `[0,1]`.

```glsl
t = clamp(t, 0.0, 1.0);
```

## How To Implement (Step-by-step)
- wave = sin(uv.x * frequency)
- animatedWave = sin(uv.x * 10.0 + u_time)
- normalizedWave = animatedWave * 0.5 + 0.5
- waveColor = mix(color1, color2, colorMix)

## Self-check
- Does it compile without errors?
- Does the output match the goal?
- Are key values kept in `[0,1]`?

## Common Mistakes
- Clamp `t` into `[0,1]` when needed.
- Don’t use raw pixels without normalization.
- Make sure `edge0 < edge1` for smoothstep().
