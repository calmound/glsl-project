# Simple Fractal

Learn how to create basic fractal patterns using iterative mathematical functions.

## Learning Objectives

- Understand iterative algorithms in shaders
- Learn to create self-similar patterns
- Practice using loops and mathematical transformations

## Key Concepts

### Fractal Basics

Fractals are patterns that repeat at different scales:
- Self-similarity at multiple zoom levels
- Created through iterative processes
- Mathematical beauty in simple rules

### Iterative Process

Basic fractal algorithm:
```glsl
vec2 z = uv;
for (int i = 0; i < iterations; i++) {
    z = transform(z);
    if (length(z) > threshold) break;
}
```

### Common Transformations

- Mandelbrot: `z = z*z + c`
- Julia sets: `z = z*z + constant`
- Simple geometric transformations

## Exercise

Create a simple fractal pattern using iterative coordinate transformations.

### Hints

1. Start with centered UV coordinates: `uv - 0.5`
2. Use a loop to apply transformations repeatedly
3. Track when values exceed a threshold
4. Color based on iteration count
5. Experiment with different transformation functions

## Expected Result

You should see an intricate fractal pattern with repeating structures at different scales.