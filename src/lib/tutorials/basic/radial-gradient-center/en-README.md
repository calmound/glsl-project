# Radial Gradient Center

## Learning Objectives

Learn to use `distance()` to compute radial distance from the center and apply `mix()` to create a center-outward gradient.

---

## Key Concepts

### 1. Compute distance from center

```glsl
float dist = distance(vUv, vec2(0.5));
```

Center = 0, edges have higher values.

---

### 2. Use `mix()` for radial blend

```glsl
vec3 color = mix(innerColor, outerColor, dist * scale);
```

- Closer to center → more innerColor
- Farther out → more outerColor

Adjust scale to tune gradient size.

---

### 3. Output the result

```glsl
gl_FragColor = vec4(color, 1.0);
```

You now have a radial gradient useful for glows, lighting effects, or backgrounds.
