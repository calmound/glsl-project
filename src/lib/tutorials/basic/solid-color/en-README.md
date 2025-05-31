# Solid Color

## Learning Objectives

Learn the basic structure of GLSL fragment shaders and understand how to set solid colors.

## Core Concepts

### Fragment Shader Basics
- **Fragment Shader**: Runs for each pixel, determining the final color
- **gl_FragColor**: The output variable that sets the pixel color
- **vec4**: A 4-component vector representing RGBA color values

### Color System
- **RGBA**: Red, Green, Blue, Alpha (transparency)
- **Value Range**: Each component ranges from 0.0 to 1.0
- **Color Representation**: (1.0, 0.0, 0.0, 1.0) represents opaque red

## Related Functions and Syntax

### vec4 Constructor
```glsl
vec4(r, g, b, a)  // Create a 4-component color vector
vec4(0.5)         // Create a gray color (0.5, 0.5, 0.5, 0.5)
vec4(rgb, a)      // Combine vec3 RGB with alpha
```

### Color Assignment
```glsl
gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Red
gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);  // Green
gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);  // Blue
```

## Code Analysis

```glsl
precision mediump float;

void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
```

**Line-by-line explanation:**
1. `precision mediump float;` - Sets floating-point precision (required in fragment shaders)
2. `void main() {` - Main function entry point
3. `gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);` - Sets pixel color to opaque red
4. `}` - End of main function

## Practice Tips

1. **Try Different Colors**:
   - `vec4(0.0, 1.0, 0.0, 1.0)` - Green
   - `vec4(0.0, 0.0, 1.0, 1.0)` - Blue
   - `vec4(1.0, 1.0, 0.0, 1.0)` - Yellow
   - `vec4(1.0, 0.0, 1.0, 1.0)` - Magenta

2. **Experiment with Alpha**:
   - `vec4(1.0, 0.0, 0.0, 0.5)` - Semi-transparent red
   - `vec4(0.0, 0.0, 0.0, 0.0)` - Fully transparent

3. **Use Intermediate Values**:
   - `vec4(0.5, 0.5, 0.5, 1.0)` - Gray
   - `vec4(0.8, 0.2, 0.4, 1.0)` - Custom pink

## Common Variations

### Grayscale Colors
```glsl
gl_FragColor = vec4(0.5);  // Equivalent to vec4(0.5, 0.5, 0.5, 0.5)
gl_FragColor = vec4(vec3(0.7), 1.0);  // Gray with full opacity
```

### Using Constants
```glsl
const vec3 RED = vec3(1.0, 0.0, 0.0);
gl_FragColor = vec4(RED, 1.0);
```

## Extended Thinking

1. **Why use 0.0-1.0 range?** This normalized range makes calculations easier and is hardware-friendly
2. **What happens with values > 1.0?** They get clamped to 1.0
3. **Performance considerations**: Simple solid colors are very fast to render
4. **Real-world applications**: UI backgrounds, solid overlays, color swatches

## Next Steps

Once you master solid colors, you can move on to:
- Color mixing and interpolation
- Using coordinates to create gradients
- Time-based color animation
- Texture sampling and color manipulation