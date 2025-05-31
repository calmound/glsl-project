# Circle Drawing

## Learning Objectives

Learn how to use distance functions and mathematical operations to draw smooth circular shapes in GLSL.

## Core Concepts

### Distance Functions
- **Euclidean Distance**: Mathematical formula for distance between two points
- **length() Function**: GLSL's built-in function for calculating vector magnitude
- **Circle Definition**: All points at equal distance from a center point

### Mathematical Foundation
- **Pythagorean Theorem**: a² + b² = c² (distance calculation basis)
- **Vector Operations**: Working with 2D coordinate vectors
- **Threshold Testing**: Using distance comparisons for shape boundaries

## Related Functions and Syntax

### Distance Calculation
```glsl
length(vec2(x, y))           // Calculate magnitude of vector
distance(point1, point2)     // Distance between two points
length(uv - center)          // Distance from center to current pixel
```

### Vector Operations
```glsl
vec2 center = vec2(0.5, 0.5);     // Circle center
vec2 offset = uv - center;        // Vector from center to pixel
float dist = length(offset);      // Distance to center
```

### Circle Testing
```glsl
float radius = 0.3;
bool insideCircle = (dist < radius);
bool onCircleEdge = (abs(dist - radius) < 0.01);
```

## Code Analysis

```glsl
precision mediump float;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    vec2 center = vec2(0.5, 0.5);
    float radius = 0.3;
    
    float dist = length(uv - center);
    
    if (dist < radius) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Red circle
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);  // Black background
    }
}
```

**Line-by-line explanation:**
1. `vec2 center = vec2(0.5, 0.5);` - Define circle center (screen center)
2. `float radius = 0.3;` - Set circle radius (30% of screen)
3. `float dist = length(uv - center);` - Calculate distance from center to current pixel
4. `if (dist < radius)` - Test if pixel is inside circle
5. Color assignment based on inside/outside test

## Drawing Principles

### Circle Mathematics
- **Distance Formula**: `d = √((x₂-x₁)² + (y₂-y₁)²)`
- **GLSL Implementation**: `length(uv - center)`
- **Circle Equation**: All points where `distance ≤ radius`

### Coordinate System
- **Center Point**: Usually vec2(0.5, 0.5) for screen center
- **Radius Units**: In normalized coordinates (0.0-1.0)
- **Aspect Ratio**: May need correction for non-square displays

### Boolean Logic
```glsl
// Simple circle test
bool inside = (dist < radius);

// Circle with border
bool border = (dist > radius - borderWidth && dist < radius + borderWidth);
```

## Performance Optimization

### Avoid Square Root
```glsl
// Instead of: length(uv - center) < radius
// Use: dot(offset, offset) < radius * radius
vec2 offset = uv - center;
float distSquared = dot(offset, offset);
float radiusSquared = radius * radius;
bool inside = (distSquared < radiusSquared);
```

### Vectorized Operations
```glsl
// Calculate multiple circles efficiently
vec2 center1 = vec2(0.3, 0.3);
vec2 center2 = vec2(0.7, 0.7);
float dist1 = length(uv - center1);
float dist2 = length(uv - center2);
```

### GPU-Friendly Alternatives
```glsl
// Using step() for branchless code
float inside = 1.0 - step(radius, dist);
vec3 color = mix(backgroundColor, circleColor, inside);
```

## Practice Tips

1. **Different Sizes**:
   ```glsl
   float smallRadius = 0.1;   // Small circle
   float largeRadius = 0.4;   // Large circle
   float tinyRadius = 0.05;   // Tiny circle
   ```

2. **Different Positions**:
   ```glsl
   vec2 topLeft = vec2(0.25, 0.75);     // Top-left quadrant
   vec2 bottomRight = vec2(0.75, 0.25); // Bottom-right quadrant
   vec2 offCenter = vec2(0.3, 0.6);     // Off-center position
   ```

3. **Multiple Circles**:
   ```glsl
   float dist1 = length(uv - vec2(0.3, 0.5));
   float dist2 = length(uv - vec2(0.7, 0.5));
   
   if (dist1 < 0.15) {
       gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Red circle
   } else if (dist2 < 0.15) {
       gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);  // Green circle
   } else {
       gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);  // Black background
   }
   ```

## Common Variations

### Circle with Smooth Edges
```glsl
float dist = length(uv - center);
float circle = 1.0 - smoothstep(radius - 0.01, radius + 0.01, dist);
gl_FragColor = vec4(vec3(circle), 1.0);
```

### Circle with Border
```glsl
float dist = length(uv - center);
float borderWidth = 0.02;

if (dist < radius - borderWidth) {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);  // Green fill
} else if (dist < radius + borderWidth) {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Red border
} else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);  // Black background
}
```

### Gradient Circle
```glsl
float dist = length(uv - center);
float intensity = 1.0 - (dist / radius);
intensity = max(0.0, intensity);  // Clamp to positive values
gl_FragColor = vec4(vec3(intensity), 1.0);
```

### Ellipse (Stretched Circle)
```glsl
vec2 center = vec2(0.5, 0.5);
vec2 radii = vec2(0.4, 0.2);  // Different X and Y radii
vec2 offset = (uv - center) / radii;
float dist = length(offset);

if (dist < 1.0) {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
} else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
```

### Aspect Ratio Correction
```glsl
// Correct for non-square displays
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
uv.x *= u_resolution.x / u_resolution.y;  // Correct aspect ratio

vec2 center = vec2(0.5 * u_resolution.x / u_resolution.y, 0.5);
float dist = length(uv - center);
```

## Advanced Techniques

### Signed Distance Fields (SDF)
```glsl
// SDF for perfect circle
float circleSDF(vec2 p, vec2 center, float radius) {
    return length(p - center) - radius;
}

float sdf = circleSDF(uv, vec2(0.5), 0.3);
float circle = step(0.0, -sdf);  // Inside when SDF < 0
```

### Anti-aliased Circles
```glsl
float dist = length(uv - center);
float pixelSize = fwidth(dist);  // Estimate pixel size
float circle = 1.0 - smoothstep(radius - pixelSize, radius + pixelSize, dist);
```

## Mathematical Background

### Distance Formula Derivation
- **2D Distance**: `d = √((x₂-x₁)² + (y₂-y₁)²)`
- **Vector Form**: `d = |v|` where `v = p₂ - p₁`
- **GLSL Implementation**: `length(vec2)` computes vector magnitude

### Circle Equation
- **Standard Form**: `(x-h)² + (y-k)² = r²`
- **Distance Form**: `distance(point, center) ≤ radius`
- **Parametric Form**: `x = h + r*cos(θ), y = k + r*sin(θ)`

## Extended Thinking

1. **Why use distance functions?** They provide smooth, resolution-independent shapes
2. **Performance considerations**: Square root operations can be expensive
3. **Mathematical elegance**: Distance fields enable complex shape operations
4. **Real-world applications**: UI elements, particle systems, procedural graphics

## Common Applications

- **UI Design**: Buttons, icons, avatars, loading indicators
- **Game Development**: Collision detection, particle effects, power-ups
- **Data Visualization**: Scatter plots, bubble charts, radar charts
- **Artistic Effects**: Bokeh, light sources, organic shapes

## Debugging Tips

1. **Visualize Distance**: Use distance as grayscale to see the field
   ```glsl
   float dist = length(uv - center);
   gl_FragColor = vec4(vec3(dist), 1.0);
   ```

2. **Check Center Position**: Ensure center coordinates are within 0.0-1.0
3. **Radius Validation**: Make sure radius fits within screen bounds
4. **Aspect Ratio Issues**: Test on different screen resolutions

## Next Steps

After mastering circles, explore:
- Complex shapes using multiple distance functions
- Shape transformations (rotation, scaling, translation)
- Combining shapes with boolean operations
- Animated circles and morphing effects
- 3D sphere rendering using ray marching