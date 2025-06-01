# UV Visualizer

## Learning Objectives

This case helps you understand UV coordinates by directly visualizing `vUv` as color on screen.

---

## Key Concepts

### 1. What is `vUv`?

`vUv` contains the 2D texture coordinate of each fragment:

- `vUv.x` is horizontal position (left to right = 0 to 1)
- `vUv.y` is vertical position (bottom to top = 0 to 1)

---

### 2. Mapping to color

Use UV values directly for red and green channels:

```glsl
vec3 color = vec3(vUv, 0.0);
```

This gives:
- Red = X position
- Green = Y position
- Blue = 0

---

### 3. Output

```glsl
gl_FragColor = vec4(color, 1.0);
```

This creates a gradient overlay useful for debugging and spatial awareness in shaders.
