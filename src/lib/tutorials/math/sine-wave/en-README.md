# Sine Wave

Learn how to create wave patterns using trigonometric functions in GLSL.

## Learning Objectives

- Understand how to use `sin()` and `cos()` functions
- Learn to create wave-based visual effects
- Practice controlling wave frequency and amplitude

## Key Concepts

### Sine Function

The `sin()` function creates oscillating values:
- Input: angle in radians
- Output: value between -1.0 and 1.0
- Creates smooth, periodic waves

### Wave Parameters

Control wave appearance:
- **Frequency**: How many waves fit in the space
- **Amplitude**: Height of the waves
- **Phase**: Horizontal shift of the wave

### Wave Equation

```glsl
float wave = amplitude * sin(frequency * x + phase);
```

## Exercise

Create a colorful sine wave pattern that varies across the screen.

### Hints

1. Use UV coordinates as input to sine function
2. Experiment with different frequencies (try `sin(uv.x * 10.0)`)
3. Add multiple waves together for complex patterns
4. Use wave values to control color intensity
5. Try both horizontal and vertical waves

## Expected Result

You should see smooth, flowing wave patterns with colors that oscillate based on the sine function.