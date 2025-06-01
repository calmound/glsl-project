# Rectangle Color Split

## Learning Objectives

Use `if` conditions in GLSL to divide the screen into regions and assign different colors based on position.

---

## Key Concepts

### 1. Conditional Logic

```glsl
if (vUv.x < 0.5) {
    color = leftColor;
} else {
    color = rightColor;
}
```

A simple branch based on horizontal position.

---

### 2. Region Determination

Use `vUv.x` to identify fragment location:

- Less than 0.5 → left side
- Greater or equal → right side

---

### 3. Output Color

Assign the color and render:

```glsl
gl_FragColor = vec4(color, 1.0);
```

This pattern is useful for UI states, graph regions, and interaction zones.
