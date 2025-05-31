# Fractal Brownian Motion

Learn how to implement fractal Brownian motion (fBm) to create complex natural textures.

## Learning Objectives

- Understand the mathematical principles of fractal Brownian motion
- Learn how to layer multiple noise octaves
- Master advanced techniques for creating natural textures

## Key Concepts

### Fractal Brownian Motion (fBm)

fBm is created by layering multiple noise functions with different frequencies and amplitudes:
- Each octave has twice the frequency of the previous
- Each octave has half the amplitude of the previous
- Produces self-similar fractal characteristics

### Octave Layering

```glsl
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < octaves; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    return value;
}
```

### Parameter Control

- **Octaves**: Number of detail layers
- **Persistence**: Amplitude decay rate
- **Lacunarity**: Frequency growth rate

## Exercise

Implement a fractal Brownian motion function to create natural textures like clouds or terrain.

### Hints

1. Start with a basic noise function
2. Implement the octave layering loop
3. Try different octave counts (4-8 octaves)
4. Adjust persistence and lacunarity parameters
5. Use the result to control color or height

## Expected Result

You should see complex natural textures with multiple levels of detail, resembling clouds, mountains, or other natural phenomena.