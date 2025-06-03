# Time Animation

## Learning Objectives

Learn how to create dynamic, time-based animations using uniform variables and mathematical functions to bring shaders to life.

## Core Concepts

### Time-based Animation
- **Uniform Variables**: External data passed to shaders (like time)
- **Periodic Functions**: sin(), cos() for repeating animations
- **Frame-independent Animation**: Using time instead of frame counts
- **Smooth Transitions**: Creating fluid, continuous motion

### Mathematical Animation
- **Oscillation**: Back-and-forth motion using trigonometric functions
- **Phase Shifting**: Offsetting animations for variety
- **Frequency Control**: Adjusting animation speed
- **Amplitude Scaling**: Controlling animation intensity

## Related Functions and Syntax

### Time Uniform
```glsl
uniform float u_time;  // Time in seconds since shader start
```

### Trigonometric Functions
```glsl
sin(u_time)                    // Oscillates between -1 and 1
cos(u_time)                    // Cosine wave (90° phase shift from sine)
tan(u_time)                    // Tangent function (less commonly used)
sin(u_time * frequency)        // Control oscillation speed
sin(u_time) * 0.5 + 0.5       // Remap to 0-1 range
```

### Animation Utilities
```glsl
fract(u_time)                  // Sawtooth wave (0 to 1, repeating)
mod(u_time, period)            // Modulo for custom periods
abs(sin(u_time))               // Always positive sine wave
smoothstep(0.0, 1.0, t)        // Smooth transitions
```

### Phase and Frequency
```glsl
sin(u_time * 2.0)              // Double frequency
sin(u_time + 1.0)              // Phase offset
sin(u_time * freq + phase)     // General form
```

## Code Analysis

```glsl
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Oscillating color intensity
    float intensity = sin(u_time * 2.0) * 0.5 + 0.5;
    
    // Animated color
    vec3 color = vec3(intensity, 0.5, 1.0 - intensity);
    
    gl_FragColor = vec4(color, 1.0);
}
```

**Line-by-line explanation:**
1. `uniform float u_time;` - Receive time value from application
2. `float intensity = sin(u_time * 2.0) * 0.5 + 0.5;` - Create oscillating value (0-1)
   - `sin(u_time * 2.0)` - Sine wave with double frequency
   - `* 0.5 + 0.5` - Remap from [-1,1] to [0,1] range
3. `vec3 color = vec3(intensity, 0.5, 1.0 - intensity);` - Animated color mixing
4. Result: Red and blue channels oscillate inversely

## Animation Types

### Color Animation
```glsl
// Pulsing color
float pulse = sin(u_time * 3.0) * 0.5 + 0.5;
vec3 color = vec3(pulse, 0.0, 1.0 - pulse);

// Hue cycling
float hue = fract(u_time * 0.1);  // Slow hue rotation
vec3 color = hsv2rgb(vec3(hue, 1.0, 1.0));

// RGB cycling
vec3 color = vec3(
    sin(u_time) * 0.5 + 0.5,
    sin(u_time + 2.094) * 0.5 + 0.5,  // 120° phase shift
    sin(u_time + 4.188) * 0.5 + 0.5   // 240° phase shift
);
```

### Position Animation
```glsl
// Oscillating position
vec2 center = vec2(0.5 + sin(u_time) * 0.2, 0.5);
float dist = length(uv - center);

// Circular motion
float radius = 0.2;
vec2 center = vec2(
    0.5 + cos(u_time) * radius,
    0.5 + sin(u_time) * radius
);

// Figure-8 motion
vec2 center = vec2(
    0.5 + sin(u_time) * 0.3,
    0.5 + sin(u_time * 2.0) * 0.2
);
```

### Shape Morphing
```glsl
// Pulsing circle
float baseRadius = 0.2;
float pulse = sin(u_time * 4.0) * 0.1;
float radius = baseRadius + pulse;

// Breathing rectangle
vec2 size = vec2(0.3, 0.2);
float breathe = sin(u_time * 2.0) * 0.1 + 1.0;
vec2 animatedSize = size * breathe;

// Morphing between shapes
float morph = sin(u_time) * 0.5 + 0.5;
float circle = length(uv - vec2(0.5)) - 0.2;
float square = max(abs(uv.x - 0.5), abs(uv.y - 0.5)) - 0.2;
float shape = mix(circle, square, morph);
```

## Advanced Animation Techniques

### Multi-frequency Combinations
```glsl
// Complex oscillation
float wave1 = sin(u_time * 2.0);
float wave2 = sin(u_time * 3.0) * 0.5;
float wave3 = sin(u_time * 5.0) * 0.25;
float complex = wave1 + wave2 + wave3;

// Normalize result
complex = complex / 1.75;  // Approximate normalization
```

### Phase Offsets
```glsl
// Multiple objects with phase offsets
for (int i = 0; i < 5; i++) {
    float phase = float(i) * 1.256;  // 72° apart
    float x = 0.5 + sin(u_time + phase) * 0.3;
    // Draw object at position x
}

// Grid animation with phase
vec2 gridPos = floor(uv * 8.0);
float phase = (gridPos.x + gridPos.y) * 0.5;
float intensity = sin(u_time * 3.0 + phase) * 0.5 + 0.5;
```

### Easing Functions
```glsl
// Smooth start/stop
float easeInOut(float t) {
    return t * t * (3.0 - 2.0 * t);
}

// Bounce effect
float bounce = abs(sin(u_time * 2.0));
bounce = pow(bounce, 0.5);  // Soften the bounce

// Elastic effect
float elastic = sin(u_time * 8.0) * exp(-u_time * 2.0);
```

### Noise Animation
```glsl
// Animated noise (pseudo-code)
float noise1 = noise(uv + u_time * 0.1);
float noise2 = noise(uv * 2.0 + u_time * 0.05);
float combined = noise1 + noise2 * 0.5;

// Flowing texture
vec2 flow = vec2(sin(u_time * 0.5), cos(u_time * 0.3)) * 0.1;
float texture = noise(uv + flow);
```

## Performance Optimization

### Efficient Time Calculations
```glsl
// Pre-calculate common time values
float slowTime = u_time * 0.5;
float fastTime = u_time * 3.0;
float phase1 = sin(slowTime);
float phase2 = cos(fastTime);

// Reuse calculations
float sinTime = sin(u_time);
float cosTime = cos(u_time);
vec2 rotation = vec2(cosTime, sinTime);
```

### Minimize Function Calls
```glsl
// Instead of multiple sin() calls
float s = sin(u_time);
float c = cos(u_time);

// Use for multiple purposes
vec2 offset1 = vec2(s, c) * 0.1;
vec2 offset2 = vec2(c, -s) * 0.2;
```

## Practice Tips

1. **Start Simple**:
   ```glsl
   // Basic pulsing
   float pulse = sin(u_time) * 0.5 + 0.5;
   gl_FragColor = vec4(vec3(pulse), 1.0);
   ```

2. **Experiment with Frequencies**:
   ```glsl
   float slow = sin(u_time * 0.5);      // Slow oscillation
   float medium = sin(u_time * 2.0);    // Medium speed
   float fast = sin(u_time * 8.0);      // Fast oscillation
   ```

3. **Combine Different Waves**:
   ```glsl
   float wave = sin(u_time) + sin(u_time * 1.618) * 0.5;
   wave = wave / 1.5;  // Normalize
   ```

4. **Use Phase for Variety**:
   ```glsl
   float red = sin(u_time) * 0.5 + 0.5;
   float green = sin(u_time + 2.094) * 0.5 + 0.5;
   float blue = sin(u_time + 4.188) * 0.5 + 0.5;
   ```

## Common Applications

### UI Animation
- **Loading Indicators**: Spinning, pulsing, progress bars
- **Button Hover Effects**: Color transitions, glow effects
- **Background Animation**: Subtle movement, color shifts
- **Notification Effects**: Attention-grabbing animations

### Game Development
- **Particle Systems**: Floating, twinkling, flowing effects
- **Environmental Effects**: Water waves, fire flicker, wind
- **Character Animation**: Breathing, idle movements
- **Power-up Effects**: Glowing, pulsing, energy fields

### Data Visualization
- **Real-time Charts**: Animated data updates
- **Progress Visualization**: Smooth value transitions
- **Interactive Elements**: Hover animations, selection feedback
- **Attention Direction**: Highlighting important data

### Artistic Effects
- **Generative Art**: Evolving patterns, organic movement
- **Music Visualization**: Beat-synchronized effects
- **Ambient Graphics**: Calming, meditative animations
- **Abstract Animation**: Non-representational motion

## Extended Thinking

1. **Frame Rate Independence**: Using time ensures consistent animation speed
2. **Mathematical Beauty**: Trigonometric functions create natural motion
3. **Performance Considerations**: GPU-friendly animation techniques
4. **User Experience**: How animation affects perception and usability

## Advanced Topics

### Synchronized Animation
```glsl
// Multiple elements in harmony
float masterTime = u_time * 2.0;
float element1 = sin(masterTime);
float element2 = sin(masterTime * 1.5);
float element3 = sin(masterTime * 0.75);
```

### Conditional Animation
```glsl
// Animation that changes behavior
float cycle = fract(u_time * 0.1);  // 10-second cycle
if (cycle < 0.5) {
    // First half: pulsing
    intensity = sin(u_time * 4.0) * 0.5 + 0.5;
} else {
    // Second half: rotating
    intensity = (sin(u_time) + cos(u_time * 1.618)) * 0.25 + 0.5;
}
```

### State-based Animation
```glsl
// Animation with memory (using external state)
uniform float u_animationState;  // 0.0 to 1.0
float transition = smoothstep(0.0, 1.0, u_animationState);
vec3 color = mix(startColor, endColor, transition);
```

## Mathematical Background

### Trigonometric Functions
- **Sine Wave**: Smooth oscillation, fundamental to animation
- **Cosine Wave**: 90° phase shift from sine, useful for 2D motion
- **Period**: 2π for standard trig functions
- **Frequency**: Controls oscillation speed
- **Amplitude**: Controls oscillation range
- **Phase**: Controls timing offset

### Wave Equations
- **General Form**: `A * sin(ωt + φ) + C`
  - A: Amplitude
  - ω: Angular frequency
  - t: Time
  - φ: Phase
  - C: Vertical offset

## Next Steps

After mastering time animation, explore:
- Interactive animations responding to user input
- Complex particle systems
- Physics-based animation
- Procedural animation using noise
- 3D transformations and rotations
- Audio-reactive visual effects