# Checkerboard Pattern

## Learning Objectives

Learn to create a checkerboard pattern using `floor()` and `mod()`, and understand how to discretize UV coordinates into grid-based logic.

---

## Key Concepts

### 1. Discretizing UV space

To make a grid, scale and floor UV coordinates:

```glsl
float x = floor(vUv.x * 8.0);
float y = floor(vUv.y * 8.0);
```

This splits the screen into an 8×8 grid.

---

### 2. Alternating pattern logic

```glsl
float pattern = mod(x + y, 2.0);
```

- Even sum: 0 → white
- Odd sum: 1 → black

---

### 3. Blending two colors

```glsl
vec3 color = mix(vec3(1.0), vec3(0.0), pattern);
```

This creates a simple and efficient checkerboard.
