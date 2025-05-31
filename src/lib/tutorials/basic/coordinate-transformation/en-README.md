# Coordinate Transformation

## Learning Objectives

Through this tutorial, you will learn:
- Understand the basic principles of 2D coordinate transformations
- Master the construction and application of rotation matrices
- Learn how to implement scaling transformations
- Understand how to combine multiple transformations to create complex effects
- Master techniques for generating repetitive patterns

## Core Concepts

### Coordinate Transformation
Coordinate transformation is a fundamental concept in computer graphics that allows us to change the position, size, orientation, and shape of geometric figures.

### Rotation Transformation
Rotation transformation uses rotation matrices to change the orientation of points:
```glsl
// 2D rotation matrix
mat2 rotation = mat2(cos(angle), -sin(angle),
                     sin(angle),  cos(angle));
vec2 rotated = rotation * point;
```

### Scaling Transformation
Scaling transformation changes the size of graphics:
```glsl
vec2 scaled = point * scale;
```

## Step-by-Step Implementation

### Step 1: Coordinate Normalization
```glsl
// Get normalized coordinates
vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
```

### Step 2: Move Origin to Center
```glsl
// Move coordinate origin to screen center
vec2 centered = uv - vec2(0.5, 0.5);
```

### Step 3: Apply Rotation Transformation
```glsl
// Create rotation matrix
float angle = u_time;
float cosA = cos(angle);
float sinA = sin(angle);

// Apply rotation
vec2 rotated = vec2(
    centered.x * cosA - centered.y * sinA,
    centered.x * sinA + centered.y * cosA
);
```

### Step 4: Apply Scaling Transformation
```glsl
// Dynamic scaling factor
float scale = 1.0 + sin(u_time * 2.0) * 0.5;
vec2 scaled = rotated * scale;
```

### Step 5: Create Repetitive Patterns
```glsl
// Use fract function to create repetitive effects
vec2 repeated = fract(scaled * 3.0);
```

## Exercise Tasks

1. **Center Coordinates**: Fill in the correct center point coordinates
2. **Rotation Matrix**: Complete the sin and cos values
3. **Scaling Factor**: Set appropriate scaling factors
4. **Repetitive Patterns**: Create grid repetition effects
5. **Color Blending**: Set colors based on transformation results

## Advanced Extensions

### Composite Transformations
Combine multiple transformations to create complex effects:
```glsl
// Scale first, then rotate, finally translate
vec2 transformed = rotate(scale(translate(uv)));
```

### Non-linear Transformations
Use mathematical functions to create non-linear transformations:
```glsl
// Wave deformation
vec2 wave = uv + sin(uv.y * 10.0 + u_time) * 0.1;
```

### Polar Coordinate Transformation
Convert to polar coordinate system:
```glsl
float radius = length(uv - 0.5);
float angle = atan(uv.y - 0.5, uv.x - 0.5);
```

## Common Issues

1. **Transformation Order**: The order of applying transformations affects the final result
2. **Coordinate Range**: Ensure transformed coordinates are within reasonable ranges
3. **Performance Optimization**: Avoid complex matrix operations in fragment shaders

## Next Steps

After mastering coordinate transformations, you can explore:
- 3D transformations and projections
- Complex geometric deformations
- Procedural animations
- Interactive transformation effects