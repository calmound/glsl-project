# Centered Circle Mask

## Learning Objectives

This lesson teaches how to draw a circular mask centered in the screen using GLSL's `distance()` and `step()` functions, and blend colors based on that mask.

---

## Key Concepts Explained

### 1. `distance(a, b)`: Measuring Distance

To measure the distance from the current fragment to the center of the screen:

```glsl
vec2 center = vec2(0.5, 0.5);
float dist = distance(vUv, center);
```

---

### 2. `step(edge, x)`: Binary Threshold Function

The `step()` function behaves as:

```glsl
float result = step(edge, x);
```

- If `x < edge`, it returns 0.0
- If `x >= edge`, it returns 1.0

Used to make hard-edged masks like circles.

---

### 3. Creating the Circular Mask

We want a circular area with radius `0.3` centered at (0.5, 0.5). Use `step()` like this:

```glsl
float inside = step(dist, 0.3);
```

This gives 1.0 for fragments inside the circle, and 0.0 outside.

---

### 4. Blending Color with `mix()`

Now use the mask to blend between black and yellow:

```glsl
vec3 color = mix(vec3(0.0), vec3(1.0, 0.8, 0.2), inside);
```

Final output:

```glsl
gl_FragColor = vec4(color, 1.0);
```

This renders a sharp-edged golden circle in the center of the canvas.
