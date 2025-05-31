# Smooth Edges

Learn how to create anti-aliased, smooth edges in your shader graphics.

## Learning Objectives

- Understand the importance of anti-aliasing in shaders
- Learn to use `smoothstep()` function effectively
- Practice creating smooth transitions between colors

## Key Concepts

### Anti-Aliasing

Smooth edges prevent jagged, pixelated appearance:
- Sharp transitions create aliasing artifacts
- Smooth transitions look more professional
- Essential for high-quality graphics

### smoothstep() Function

The `smoothstep(edge0, edge1, x)` function:
- Returns 0.0 when `x <= edge0`
- Returns 1.0 when `x >= edge1`
- Smooth interpolation between edge0 and edge1
- Creates natural-looking transitions

### Edge Control

Control smoothness by adjusting edge parameters:
- Smaller difference = sharper edge
- Larger difference = softer edge

## Exercise

Create a circle with perfectly smooth, anti-aliased edges.

### Hints

1. Calculate distance from center: `distance(uv, center)`
2. Use `smoothstep()` instead of `step()` for the edge
3. Try: `smoothstep(radius + 0.01, radius - 0.01, dist)`
4. Experiment with different edge widths
5. Compare with sharp edges to see the difference

## Expected Result

You should see a circle with perfectly smooth edges, free from pixelation or jagged artifacts.