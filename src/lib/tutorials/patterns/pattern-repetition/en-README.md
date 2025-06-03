# Pattern Repetition

Learn how to create repeating geometric patterns in GLSL shaders.

## Learning Objectives

- Understand how to use modulo operations for pattern repetition
- Learn coordinate transformation and scaling techniques
- Master creating tiled effects

## Key Concepts

### Modulo Operation (mod)

Use the `mod()` function to create repetition:
```glsl
vec2 repeatedUV = mod(uv * scale, 1.0);
```

### Coordinate Scaling

Control repetition count by scaling UV coordinates:
- Larger scale values = more repetitions
- Smaller scale values = fewer repetitions

### Tiled Patterns

Steps to create tiled effects:
1. Scale UV coordinates
2. Apply modulo operation
3. Draw pattern within each tile

## Exercise

Create a repeating circular pattern arranged in a grid across the screen.

### Hints

1. Use `mod(uv * 4.0, 1.0)` to create a 4x4 repetition grid
2. Draw circles centered in each tile
3. Use `distance()` function to calculate distance to tile center
4. Use `smoothstep()` to create smooth circular edges

## Expected Result

You should see a neat grid of circular patterns, with each circle centered within its tile.