# Noise Texture

Learn how to generate and use noise functions to create organic textures.

## Learning Objectives

- Understand pseudo-random number generation in shaders
- Learn to create noise functions from scratch
- Practice using noise for texture generation

## Key Concepts

### Pseudo-Random Functions

Create randomness using mathematical functions:
```glsl
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}
```

### Noise Generation

Build noise by:
1. Creating random values at grid points
2. Interpolating between neighboring values
3. Combining multiple octaves for detail

### Texture Applications

Use noise for:
- Surface textures (wood, marble, clouds)
- Displacement mapping
- Animated effects

## Exercise

Create a noise-based texture that resembles organic patterns like clouds or marble.

### Hints

1. Start with a basic random function
2. Scale UV coordinates to control noise frequency
3. Use `smoothstep()` or `mix()` for smooth interpolation
4. Experiment with different scaling factors

## Expected Result

You should see an organic, cloud-like texture with smooth variations across the screen.