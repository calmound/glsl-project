# Basic Gradient Effect

In this exercise, you’ll implement a simple vertical gradient using GLSL. By learning how to map pixel coordinates to color values, you'll understand how to use position data to build visual effects.

---

## Learning Objectives

- Understand how to get the current fragment’s position using `gl_FragCoord`
- Learn to normalize coordinates using `u_resolution`
- Map position data to color values to create gradient effects
- Construct color outputs using `vec4`

---

## Key Concepts

### 1. Get the current pixel position

In the fragment shader, each pixel has a specific screen position. This is provided by `gl_FragCoord.xy`, measured in pixels.

```glsl
vec2 pos = gl_FragCoord.xy;
```

This gives us the exact pixel location being rendered.

---

### 2. Normalize screen coordinates to UV

To make the effect resolution-independent, we convert pixel coordinates to a normalized UV space ranging from 0.0 to 1.0.

We do this by dividing the pixel position by the total canvas size passed in through the `u_resolution` uniform.

```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
```

- Bottom-left corner → `uv = (0.0, 0.0)`
- Top-right corner → `uv = (1.0, 1.0)`

UV coordinates are the foundation of shader-based positioning and effects.

---

### 3. Use UV to control color channels

You can assign a component of the UV coordinates to control one of the RGB color channels.

- `uv.y` corresponds to vertical position. If you assign this to the blue channel, the image becomes bluer from bottom to top (a vertical gradient).
- Similarly, using `uv.x` will create a horizontal gradient from left to right.

You can even combine them, like `(uv.x + uv.y) / 2.0`, to create a diagonal blend. This technique is how we convert 2D spatial data into visual output.

---

### 4. Output the color

Colors in GLSL are represented as a `vec4` with four components:

```glsl
vec4 color = vec4(R, G, B, A);
gl_FragColor = color;
```

Each component is a float from 0.0 to 1.0. You can dynamically assign values from UV to individual channels to create gradient effects.

---

## Exercise

Using the concepts above, try to create a **vertical gradient** from white to blue:

1. Use `gl_FragCoord.xy` to get pixel position
2. Normalize it to UV using `u_resolution`
3. Extract `uv.y` as the gradient value
4. Keep red and green channels fixed
5. Use `vec4` to build the final color and assign it to `gl_FragColor`


