# Mouse Interaction

Learn how to create interactive shaders that respond to mouse input.

## Learning Objectives

- Understand how to use mouse coordinates in shaders
- Learn to create interactive visual effects
- Practice distance calculations and circular effects

## Key Concepts

### Mouse Uniforms

The shader receives mouse position through uniforms:
- `u_mouse`: Mouse position in screen coordinates
- Normalize mouse coordinates to match UV space

### Distance Function

Use `distance()` function to calculate proximity to mouse:
```glsl
float dist = distance(uv, mousePos);
```

### Interactive Effects

Create effects that change based on mouse position:
- Color changes near mouse cursor
- Ripple effects from mouse position
- Brightness or size variations

## Exercise

Create a shader that draws a bright circle that follows the mouse cursor.

### Hints

1. Normalize mouse coordinates: `u_mouse / u_resolution`
2. Calculate distance from current pixel to mouse position
3. Use `smoothstep()` to create a smooth circular falloff
4. Make the circle brighter near the center

## Expected Result

You should see a bright circular glow that follows your mouse cursor around the screen.