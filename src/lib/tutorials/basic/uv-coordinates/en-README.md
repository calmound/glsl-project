# UV Coordinates

Learn the fundamentals of UV coordinate system in GLSL shaders.

## Learning Objectives

- Understand the UV coordinate system
- Learn how to manipulate and transform coordinates
- Practice using coordinates for pattern creation

## Key Concepts

### UV Coordinate System

UV coordinates map screen space to 0.0-1.0 range:
- **U**: Horizontal axis (left = 0.0, right = 1.0)
- **V**: Vertical axis (bottom = 0.0, top = 1.0)
- Origin (0,0) is at bottom-left corner

### Coordinate Transformations

Common transformations:
- **Centering**: `uv - 0.5` (range: -0.5 to 0.5)
- **Scaling**: `uv * scale`
- **Translation**: `uv + offset`
- **Rotation**: Using rotation matrices

### Coordinate Visualization

Use coordinates directly as colors:
```glsl
vec3 color = vec3(uv.x, uv.y, 0.0);
```

## Exercise

Create a visualization that shows how UV coordinates work by using them as color values.

### Optional Extension: Grid Overlay

After you get the basic UV gradient working, try overlaying a simple grid:

- Create repeating cells with `fract(uv * density)`
- Turn the cell edges into a mask with `step`
- Blend the grid lines on top of the UV color with `mix`

### Hints

1. Use `uv.x` for red channel (horizontal gradient)
2. Use `uv.y` for green channel (vertical gradient)
3. Set blue channel to 0.0 or a constant
4. Experiment with coordinate transformations
5. Try `abs(uv - 0.5)` for different effects

## Expected Result

You should see a gradient that transitions from black at bottom-left to yellow at top-right, clearly showing the UV coordinate mapping.
