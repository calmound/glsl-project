# Simple Rectangle

## Learning Objectives

Learn how to use conditional statements and coordinate comparisons to draw geometric shapes, starting with a simple rectangle.

## Core Concepts

### Conditional Rendering
- **if-else statements**: Control color output based on conditions
- **Coordinate testing**: Check if current pixel is inside a shape
- **Boolean logic**: Combine multiple conditions for complex shapes

### Coordinate System
- **Normalized coordinates**: Working with 0.0-1.0 range
- **Boundary testing**: Checking if coordinates fall within specific ranges
- **Shape definition**: Using mathematical conditions to define geometry

## Related Functions and Syntax

### Conditional Statements
```glsl
if (condition) {
    // Execute when condition is true
} else {
    // Execute when condition is false
}
```

### Comparison Operators
```glsl
uv.x > 0.2        // Greater than
uv.x < 0.8        // Less than
uv.x >= 0.2       // Greater than or equal
uv.x <= 0.8       // Less than or equal
uv.x == 0.5       // Equal (rarely used with floats)
```

### Logical Operators
```glsl
condition1 && condition2  // AND - both must be true
condition1 || condition2  // OR - at least one must be true
!condition               // NOT - inverts the condition
```

### Rectangle Boundary Test
```glsl
bool insideRect = (uv.x > left && uv.x < right && uv.y > bottom && uv.y < top);
```

## Code Analysis

```glsl
precision mediump float;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    if (uv.x > 0.2 && uv.x < 0.8 && uv.y > 0.3 && uv.y < 0.7) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Red rectangle
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);  // Black background
    }
}
```

**Line-by-line explanation:**
1. `vec2 uv = gl_FragCoord.xy / u_resolution.xy;` - Normalize coordinates
2. `if (uv.x > 0.2 && uv.x < 0.8 && uv.y > 0.3 && uv.y < 0.7)` - Test if inside rectangle
   - X coordinate between 0.2 and 0.8 (60% of width, centered)
   - Y coordinate between 0.3 and 0.7 (40% of height, centered)
3. `gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);` - Red color for inside pixels
4. `gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);` - Black color for outside pixels

## Drawing Principles

### Rectangle Definition
A rectangle is defined by four boundaries:
- **Left edge**: `uv.x > leftBoundary`
- **Right edge**: `uv.x < rightBoundary`
- **Bottom edge**: `uv.y > bottomBoundary`
- **Top edge**: `uv.y < topBoundary`

### Coordinate System Notes
- Origin (0,0) is typically at bottom-left
- X increases from left to right
- Y increases from bottom to top
- All coordinates normalized to 0.0-1.0 range

### Boolean Logic
```glsl
// All conditions must be true for pixel to be inside rectangle
bool inside = (left_test && right_test && bottom_test && top_test);
```

## Performance Optimization

1. **Minimize Branching**: GPU prefers fewer conditional branches
2. **Early Exit**: Structure conditions for common cases first
3. **Vectorized Operations**: Use step() function for smoother performance

### Alternative Implementation (Branchless)
```glsl
vec2 inBounds = step(vec2(0.2, 0.3), uv) * step(uv, vec2(0.8, 0.7));
float inside = inBounds.x * inBounds.y;
vec3 color = mix(vec3(0.0), vec3(1.0, 0.0, 0.0), inside);
```

## Practice Tips

1. **Try Different Sizes**:
   ```glsl
   // Small rectangle
   if (uv.x > 0.4 && uv.x < 0.6 && uv.y > 0.4 && uv.y < 0.6)
   
   // Wide rectangle
   if (uv.x > 0.1 && uv.x < 0.9 && uv.y > 0.45 && uv.y < 0.55)
   ```

2. **Different Positions**:
   ```glsl
   // Top-left corner
   if (uv.x > 0.0 && uv.x < 0.3 && uv.y > 0.7 && uv.y < 1.0)
   
   // Bottom-right corner
   if (uv.x > 0.7 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 0.3)
   ```

3. **Multiple Rectangles**:
   ```glsl
   bool rect1 = (uv.x > 0.1 && uv.x < 0.4 && uv.y > 0.1 && uv.y < 0.4);
   bool rect2 = (uv.x > 0.6 && uv.x < 0.9 && uv.y > 0.6 && uv.y < 0.9);
   
   if (rect1) {
       gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Red
   } else if (rect2) {
       gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);  // Green
   } else {
       gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);  // Black
   }
   ```

## Common Variations

### Centered Rectangle
```glsl
vec2 center = vec2(0.5, 0.5);
vec2 size = vec2(0.3, 0.2);
vec2 halfSize = size * 0.5;

bool inside = (abs(uv.x - center.x) < halfSize.x && 
               abs(uv.y - center.y) < halfSize.y);
```

### Rectangle with Border
```glsl
bool outer = (uv.x > 0.2 && uv.x < 0.8 && uv.y > 0.3 && uv.y < 0.7);
bool inner = (uv.x > 0.25 && uv.x < 0.75 && uv.y > 0.35 && uv.y < 0.65);

if (outer && !inner) {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Red border
} else if (inner) {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);  // Green fill
} else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);  // Black background
}
```

### Rounded Rectangle (Preview)
```glsl
vec2 center = vec2(0.5, 0.5);
vec2 size = vec2(0.6, 0.4);
float radius = 0.1;

vec2 dist = abs(uv - center) - size * 0.5 + radius;
float roundedRect = length(max(dist, 0.0)) - radius;

if (roundedRect < 0.0) {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
} else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
```

## Extended Thinking

1. **Why use normalized coordinates?** Makes shapes resolution-independent
2. **Performance implications**: Conditional statements can impact GPU performance
3. **Mathematical foundation**: Boolean algebra and set theory
4. **Real-world applications**: UI elements, game objects, architectural visualization

## Common Applications

- **UI Design**: Buttons, panels, windows, progress bars
- **Game Development**: Platforms, obstacles, collision detection
- **Data Visualization**: Bar charts, grid layouts
- **Architectural Rendering**: Building blocks, floor plans

## Debugging Tips

1. **Visualize Boundaries**: Use different colors for each boundary test
2. **Check Coordinate Ranges**: Ensure your bounds are within 0.0-1.0
3. **Test Edge Cases**: What happens at exactly the boundary values?
4. **Use Console Output**: Log coordinate values for debugging

## Next Steps

After mastering rectangles, explore:
- Circles and ellipses using distance functions
- Triangles and polygons
- Shape transformations (rotation, scaling)
- Smooth edges using smoothstep()
- Complex shapes using signed distance fields (SDFs)