# Breathing Color Block

## Learning Objectives

Learn to create a breathing animation using the `sin()` function and a time uniform (`u_time`), simulating a pulsating light effect.

---

## Key Concepts

### 1. Periodic sine function

The `sin()` function oscillates between -1 and 1. To map this to [0, 1]:

```glsl
float brightness = 0.5 + 0.5 * sin(u_time);
```

This produces a smooth brightness variation over time.

---

### 2. Color construction

Use the brightness to drive RGB values:

```glsl
vec3 color = vec3(brightness, 0.6, 0.9);
```

Only the red channel changes in this example.

---

### 3. Output result

Final output uses `gl_FragColor`:

```glsl
gl_FragColor = vec4(color, 1.0);
```

You can modify frequency, amplitude, or color mapping to personalize the effect.
