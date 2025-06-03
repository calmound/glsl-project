# Gradient Effects

## Learning Objectives

Master advanced gradient techniques and interpolation functions to create sophisticated color transitions and visual effects.

## Core Concepts

### Advanced Interpolation
- **Linear Interpolation**: Basic smooth transitions between values
- **Non-linear Interpolation**: Curved transitions using mathematical functions
- **Multi-point Gradients**: Transitions between multiple colors or values
- **Directional Gradients**: Controlling gradient direction and orientation

### Mathematical Functions
- **smoothstep()**: S-curve interpolation for natural transitions
- **Trigonometric Functions**: sin(), cos() for wave-like gradients
- **Power Functions**: pow() for exponential curves
- **Distance-based Gradients**: Using spatial relationships

## Related Functions and Syntax

### Interpolation Functions
```glsl
mix(a, b, t)                    // Linear interpolation
smoothstep(edge0, edge1, x)     // Smooth Hermite interpolation
step(edge, x)                   // Hard step function
clamp(x, minVal, maxVal)        // Constrain value to range
```

### Mathematical Functions
```glsl
sin(x), cos(x), tan(x)          // Trigonometric functions
pow(x, y)                       // Power function (x^y)
exp(x), log(x)                  // Exponential and logarithmic
sqrt(x)                         // Square root
abs(x)                          // Absolute value
```

### Vector Operations
```glsl
length(v)                       // Vector magnitude
normalize(v)                    // Unit vector
dot(a, b)                       // Dot product
cross(a, b)                     // Cross product (3D)
```

## Code Analysis

```glsl
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Linear gradient
    float gradient = uv.x;
    
    // Smooth gradient
    float smoothGradient = smoothstep(0.0, 1.0, uv.x);
    
    // Radial gradient
    vec2 center = vec2(0.5, 0.5);
    float radialGradient = length(uv - center);
    
    // Use smooth gradient for color mixing
    vec3 color1 = vec3(1.0, 0.0, 0.0);  // Red
    vec3 color2 = vec3(0.0, 0.0, 1.0);  // Blue
    vec3 finalColor = mix(color1, color2, smoothGradient);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
```

**Line-by-line explanation:**
1. `float gradient = uv.x;` - Simple linear gradient based on X coordinate
2. `float smoothGradient = smoothstep(0.0, 1.0, uv.x);` - Smooth S-curve gradient
3. `float radialGradient = length(uv - center);` - Distance-based radial gradient
4. `vec3 finalColor = mix(color1, color2, smoothGradient);` - Apply gradient to color mixing

## Gradient Types

### Linear Gradients
```glsl
// Horizontal gradient
float t = uv.x;

// Vertical gradient
float t = uv.y;

// Diagonal gradient
float t = (uv.x + uv.y) * 0.5;

// Angled gradient
float angle = radians(45.0);
vec2 direction = vec2(cos(angle), sin(angle));
float t = dot(uv, direction);
```

### Radial Gradients
```glsl
// Circular gradient from center
vec2 center = vec2(0.5, 0.5);
float t = length(uv - center);

// Elliptical gradient
vec2 scale = vec2(2.0, 1.0);
float t = length((uv - center) * scale);

// Off-center radial
vec2 center = vec2(0.3, 0.7);
float t = length(uv - center);
```

### Angular Gradients
```glsl
// Conical gradient
vec2 center = vec2(0.5, 0.5);
vec2 dir = uv - center;
float angle = atan(dir.y, dir.x);
float t = (angle + 3.14159) / (2.0 * 3.14159);  // Normalize to 0-1

// Spiral gradient
float spiral = angle + length(dir) * 10.0;
float t = fract(spiral / (2.0 * 3.14159));
```

## Advanced Gradient Techniques

### Multi-color Gradients
```glsl
vec3 color1 = vec3(1.0, 0.0, 0.0);  // Red
vec3 color2 = vec3(0.0, 1.0, 0.0);  // Green
vec3 color3 = vec3(0.0, 0.0, 1.0);  // Blue

float t = uv.x;
vec3 finalColor;

if (t < 0.5) {
    finalColor = mix(color1, color2, t * 2.0);
} else {
    finalColor = mix(color2, color3, (t - 0.5) * 2.0);
}

// Alternative smooth approach
vec3 temp1 = mix(color1, color2, smoothstep(0.0, 0.5, t));
vec3 temp2 = mix(color2, color3, smoothstep(0.5, 1.0, t));
finalColor = mix(temp1, temp2, step(0.5, t));
```

### Non-linear Gradients
```glsl
// Exponential gradient
float t = pow(uv.x, 2.0);  // Quadratic curve

// Sine wave gradient
float t = sin(uv.x * 3.14159 * 0.5);  // Quarter sine wave

// Bounce gradient
float t = abs(sin(uv.x * 3.14159));

// Elastic gradient
float t = 1.0 - pow(1.0 - uv.x, 3.0);
```

### Repeating Gradients
```glsl
// Repeating linear gradient
float t = fract(uv.x * 5.0);  // Repeat 5 times

// Ping-pong gradient
float t = abs(fract(uv.x * 2.5) * 2.0 - 1.0);

// Sawtooth gradient
float t = fract(uv.x * 3.0 + u_time);
```

## Color Space and Blending

### RGB vs HSV Gradients
```glsl
// RGB gradient (direct interpolation)
vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), t);

// HSV gradient (hue interpolation)
vec3 hsv1 = vec3(0.0, 1.0, 1.0);    // Red in HSV
vec3 hsv2 = vec3(0.67, 1.0, 1.0);   // Blue in HSV
vec3 hsvMix = mix(hsv1, hsv2, t);
vec3 color = hsv2rgb(hsvMix);  // Convert back to RGB
```

### Gamma-Corrected Gradients
```glsl
// Linear RGB mixing can appear dark in middle
vec3 color1 = vec3(1.0, 0.0, 0.0);
vec3 color2 = vec3(0.0, 0.0, 1.0);

// Gamma-corrected mixing
vec3 gamma1 = pow(color1, vec3(2.2));
vec3 gamma2 = pow(color2, vec3(2.2));
vec3 mixed = mix(gamma1, gamma2, t);
vec3 final = pow(mixed, vec3(1.0/2.2));
```

## Performance Optimization

### Efficient Calculations
```glsl
// Pre-calculate common values
vec2 center = vec2(0.5);
vec2 offset = uv - center;
float dist = length(offset);
float angle = atan(offset.y, offset.x);

// Use built-in functions when possible
float t = smoothstep(0.2, 0.8, dist);  // Instead of custom curves
```

### Vectorized Operations
```glsl
// Process multiple gradients simultaneously
vec4 gradients = vec4(
    uv.x,                    // Linear X
    uv.y,                    // Linear Y
    length(uv - vec2(0.5)),  // Radial
    (uv.x + uv.y) * 0.5      // Diagonal
);
```

## Practice Tips

1. **Experiment with Functions**:
   ```glsl
   float t1 = smoothstep(0.0, 1.0, uv.x);           // S-curve
   float t2 = pow(uv.x, 0.5);                       // Square root
   float t3 = 1.0 - pow(1.0 - uv.x, 2.0);          // Ease-out
   float t4 = sin(uv.x * 3.14159 * 0.5);           // Sine ease
   ```

2. **Combine Multiple Gradients**:
   ```glsl
   float horizontal = uv.x;
   float vertical = uv.y;
   float radial = length(uv - vec2(0.5));
   float combined = horizontal * vertical * (1.0 - radial);
   ```

3. **Animate Gradients**:
   ```glsl
   float t = uv.x + sin(u_time) * 0.2;  // Oscillating gradient
   float rotating = atan(uv.y - 0.5, uv.x - 0.5) + u_time;
   ```

## Common Applications

### UI Design
- **Button Gradients**: Depth and interactivity
- **Background Effects**: Subtle color transitions
- **Progress Bars**: Visual feedback
- **Loading Animations**: Dynamic color changes

### Game Development
- **Sky Rendering**: Day/night transitions
- **Health Bars**: Color-coded status
- **Particle Effects**: Fade-out gradients
- **Environmental Effects**: Fog, lighting

### Data Visualization
- **Heat Maps**: Value-to-color mapping
- **Terrain Rendering**: Height-based coloring
- **Scientific Visualization**: Data representation
- **Infographics**: Smooth transitions

### Artistic Effects
- **Color Washes**: Painterly effects
- **Atmospheric Rendering**: Mood and ambiance
- **Abstract Art**: Procedural color patterns
- **Photo Effects**: Filters and overlays

## Extended Thinking

1. **Mathematical Beauty**: Gradients demonstrate interpolation theory
2. **Perceptual Considerations**: How humans perceive color transitions
3. **Performance Trade-offs**: Complex gradients vs. rendering speed
4. **Design Principles**: When to use subtle vs. dramatic gradients

## Advanced Topics

### Noise-based Gradients
```glsl
// Add noise to gradient for organic feel
float noise = random(uv) * 0.1;  // Assume random() function exists
float t = uv.x + noise;
vec3 color = mix(color1, color2, t);
```

### Gradient Mapping
```glsl
// Use gradient as lookup for complex color schemes
float intensity = length(uv - vec2(0.5));
vec3 color = gradientLookup(intensity);  // Custom function
```

### Multi-dimensional Gradients
```glsl
// 3D gradient using time as third dimension
vec3 pos = vec3(uv, u_time * 0.1);
float t = length(pos) * 0.5;
vec3 color = mix(color1, color2, t);
```

## Next Steps

After mastering gradients, explore:
- Noise functions for organic textures
- Procedural pattern generation
- Complex shape rendering with gradients
- Real-time gradient animation
- Advanced color theory and harmony