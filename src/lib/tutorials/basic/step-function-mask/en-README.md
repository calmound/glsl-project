# Step Function Mask

## Learning Objectives

Learn to use the `step()` function to create a sharp left-right division on screen. This is a basic technique for masking, logic control, and crisp UI effects.

---

## Key Concepts

### 1. `step(edge, x)`

This function outputs:

```glsl
float result = step(edge, x);
```

- Returns `0.0` when `x < edge`
- Returns `1.0` when `x >= edge`

---

### 2. Creating a vertical split

We use `vUv.x` to get horizontal position:

```glsl
float mask = step(0.5, vUv.x);
```

Fragments on the left will return 0, right side returns 1.

---

### 3. Color blending using mask

```glsl
vec3 color = mix(leftColor, rightColor, mask);
```

This creates a hard edge color division in the middle of the screen.
