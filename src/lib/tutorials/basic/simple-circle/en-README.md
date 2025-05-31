# Simple Circle

Learn how to draw a basic circle using distance functions in GLSL.

## Learning Objectives

- Understand distance-based shape rendering
- Learn to use the `distance()` function
- Practice creating smooth edges with `smoothstep()`

## Key Concepts

### Distance Function

Calculate distance from current pixel to circle center:
```glsl
float dist = distance(uv, center);
```

### Circle Rendering

Create a circle by comparing distance to radius:
- Inside circle: `dist < radius`
- Outside circle: `dist >= radius`

### Smooth Edges

Use `smoothstep()` for anti-aliased edges:
```glsl
float circle = 1.0 - smoothstep(radius - edge, radius + edge, dist);
```

## Exercise

Draw a white circle on a black background, centered on the screen.

### Hints

1. Center the UV coordinates: `uv - 0.5`
2. Choose an appropriate radius (try 0.3)
3. Use `distance()` to calculate pixel distance from center
4. Use `step()` or `smoothstep()` to create the circle

## Expected Result

You should see a clean white circle centered on a black background.