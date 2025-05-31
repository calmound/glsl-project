# Toon Shading

Learn how to create cartoon-style non-photorealistic rendering effects.

## Learning Objectives

- Understand the basics of non-photorealistic rendering
- Learn how to quantize lighting values for cartoon effects
- Master using step functions to create hard boundaries

## Key Concepts

### Non-Photorealistic Rendering

Characteristics of toon shading:
- Clear light-shadow boundaries
- Limited color gradations
- Flat lighting effects
- Hand-drawn animation style

### Lighting Quantization

Convert continuous lighting values to discrete levels:
```glsl
float lightIntensity = dot(normal, lightDir);
float toonLevel = floor(lightIntensity * levels) / levels;
```

### Hard Boundary Creation

Use `step()` function to create clear light-shadow divisions:
```glsl
float toon = step(threshold, lightIntensity);
```

## Exercise

Create a cartoon-style shading effect with clear light-shadow layering.

### Hints

1. Calculate basic diffuse lighting
2. Use `step()` or `floor()` functions to quantize lighting values
3. Define 2-4 lighting levels
4. Assign different color intensities to each level
5. Optionally add simple outline effects

## Expected Result

You should see a cartoon-style 3D surface with clear light-shadow boundaries and flat color gradations, similar to animated cartoon visuals.