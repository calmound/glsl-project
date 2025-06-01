# Smoothstep Edge Fade

## Learning Objectives

Use `smoothstep()` to create a soft fading edge around a shape, and understand how it compares to `step()`.

---

## Key Concepts

### 1. `smoothstep(edge0, edge1, x)`

A smoother alternative to `step()`:

```glsl
float result = smoothstep(0.3, 0.5, dist);
```

- Returns 0 when `x <= edge0`  
- Returns 1 when `x >= edge1`  
- Smooth transition in between

---

### 2. Radial distance and mask

```glsl
float dist = distance(vUv, vec2(0.5));
float mask = smoothstep(0.3, 0.5, dist);
```

Creates a soft-edged circular region centered on the canvas.

---

### 3. Blending for visual fade

```glsl
vec3 color = mix(highlight, background, mask);
```

When mask is near 0, highlight shows; as mask increases, it smoothly fades to black.
