# Basic Gradients

Learn how to create smooth color gradients in GLSL shaders.

## Learning Objectives

- Understand how to use the `mix()` function for color interpolation
- Learn to create linear gradients using UV coordinates
- Practice combining multiple colors smoothly

## Key Concepts

### The mix() Function

The `mix(a, b, t)` function linearly interpolates between two values:
- `a`: Starting value
- `b`: Ending value  
- `t`: Interpolation factor (0.0 to 1.0)

### UV Coordinates for Gradients

Use UV coordinates to create spatial gradients:
- `gl_FragCoord.x` for horizontal gradients
- `gl_FragCoord.y` for vertical gradients
- Normalize coordinates to 0.0-1.0 range

## Exercise

Create a smooth gradient that transitions from red to blue horizontally across the screen.

### Hints

1. Use `gl_FragCoord.x / u_resolution.x` to get normalized horizontal position
2. Use `mix(color1, color2, factor)` to blend colors
3. Red color: `vec3(1.0, 0.0, 0.0)`
4. Blue color: `vec3(0.0, 0.0, 1.0)`

## Expected Result

You should see a smooth transition from red on the left to blue on the right side of the screen.