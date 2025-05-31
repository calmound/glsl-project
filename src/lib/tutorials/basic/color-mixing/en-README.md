# Color Mixing

## Learning Objectives

Learn how to use coordinate systems and the `mix()` function to create smooth color transitions and gradients.

## Core Concepts

### Coordinate System
- **gl_FragCoord**: Built-in variable containing current pixel coordinates
- **Screen Space**: Coordinates in pixels (e.g., 0-800 for width, 0-600 for height)
- **Normalized Coordinates**: Converting to 0.0-1.0 range for easier calculations

### Color Interpolation
- **Linear Interpolation**: Smooth transition between two values
- **mix() Function**: GLSL's built-in linear interpolation function
- **Gradient Creation**: Using coordinates to control color mixing

## Related Functions and Syntax

### mix() Function
```glsl
mix(a, b, t)  // Returns a * (1-t) + b * t
// When t = 0.0, returns a
// When t = 1.0, returns b
// When t = 0.5, returns average of a and b
```

### Coordinate Normalization
```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;  // Normalize to 0.0-1.0
float x = gl_FragCoord.x / u_resolution.x;    // Normalize X coordinate
float y = gl_FragCoord.y / u_resolution.y;    // Normalize Y coordinate
```

### Vector Operations
```glsl
vec2 coord = gl_FragCoord.xy;  // Extract XY components
vec3 color1 = vec3(1.0, 0.0, 0.0);  // Red
vec3 color2 = vec3(0.0, 0.0, 1.0);  // Blue
```

## Code Analysis

```glsl
precision mediump float;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    vec3 color1 = vec3(1.0, 0.0, 0.0);  // Red
    vec3 color2 = vec3(0.0, 0.0, 1.0);  // Blue
    
    vec3 color = mix(color1, color2, uv.x);
    
    gl_FragColor = vec4(color, 1.0);
}
```

**Line-by-line explanation:**
1. `uniform vec2 u_resolution;` - Screen resolution passed from application
2. `vec2 uv = gl_FragCoord.xy / u_resolution.xy;` - Normalize coordinates to 0.0-1.0
3. `vec3 color1 = vec3(1.0, 0.0, 0.0);` - Define red color
4. `vec3 color2 = vec3(0.0, 0.0, 1.0);` - Define blue color
5. `vec3 color = mix(color1, color2, uv.x);` - Mix colors based on X coordinate
6. `gl_FragColor = vec4(color, 1.0);` - Output final color with full opacity

## Mixing Principles

### Horizontal Gradient
- Use `uv.x` as mixing factor
- Left side (x=0.0) shows first color
- Right side (x=1.0) shows second color
- Creates smooth left-to-right transition

### Vertical Gradient
- Use `uv.y` as mixing factor
- Bottom (y=0.0) shows first color
- Top (y=1.0) shows second color

### Diagonal Gradient
- Use `(uv.x + uv.y) * 0.5` as mixing factor
- Creates diagonal color transition

## Performance Optimization

1. **Efficient Normalization**: Calculate `uv` once and reuse
2. **Constant Colors**: Define colors as constants when possible
3. **Vector Operations**: Use vec3 operations instead of component-wise

## Practice Tips

1. **Try Different Directions**:
   ```glsl
   mix(color1, color2, uv.y);        // Vertical gradient
   mix(color1, color2, 1.0 - uv.x);  // Reverse horizontal
   mix(color1, color2, uv.x * uv.y); // Corner-based mixing
   ```

2. **Experiment with Colors**:
   ```glsl
   vec3 warm = vec3(1.0, 0.5, 0.0);   // Orange
   vec3 cool = vec3(0.0, 0.5, 1.0);   // Light blue
   ```

3. **Non-linear Mixing**:
   ```glsl
   float t = smoothstep(0.0, 1.0, uv.x);  // Smooth transition
   float t = pow(uv.x, 2.0);              // Quadratic curve
   ```

## Common Variations

### Multi-color Gradients
```glsl
vec3 color1 = vec3(1.0, 0.0, 0.0);  // Red
vec3 color2 = vec3(0.0, 1.0, 0.0);  // Green
vec3 color3 = vec3(0.0, 0.0, 1.0);  // Blue

vec3 temp = mix(color1, color2, uv.x * 2.0);
vec3 final = mix(temp, color3, max(0.0, uv.x * 2.0 - 1.0));
```

### Radial Gradients
```glsl
vec2 center = vec2(0.5, 0.5);
float dist = distance(uv, center);
vec3 color = mix(color1, color2, dist);
```

### Animated Gradients
```glsl
uniform float u_time;
float t = sin(u_time) * 0.5 + 0.5;  // Oscillate between 0-1
vec3 color = mix(color1, color2, t);
```

## Color Spaces and Blending

### RGB vs HSV
- RGB mixing: Direct component interpolation
- HSV mixing: Often produces more natural color transitions
- Consider color theory when choosing colors to mix

### Gamma Correction
- Linear RGB mixing may appear darker in middle
- Consider gamma-corrected mixing for better visual results

## Extended Thinking

1. **Why normalize coordinates?** Makes shaders resolution-independent
2. **Mathematical foundation**: Linear interpolation is fundamental in computer graphics
3. **Real-world applications**: UI gradients, sky rendering, material transitions
4. **Performance vs quality**: Simple linear mixing is fast but may not always look natural

## Common Applications

- **UI Design**: Button gradients, background effects
- **Game Development**: Sky gradients, health bars, transition effects
- **Data Visualization**: Heat maps, color-coded data
- **Artistic Effects**: Color washes, atmospheric effects

## Next Steps

After mastering color mixing, explore:
- Shape-based color application
- Time-based color animation
- Texture-based color sampling
- Advanced blending modes