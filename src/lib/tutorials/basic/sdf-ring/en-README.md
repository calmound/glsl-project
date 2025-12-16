# SDF Ring

A circle uses `length(p)` as its distance to the center. A **ring** is just the distance to a circle boundary:

```glsl
float ringDist = abs(length(p) - radius);
```

Then we turn that distance into a mask with `smoothstep`.

## Exercise

- Compute the centered coordinates `p = vUv - 0.5`
- Compute `ringDist`
- Use `smoothstep` to create a soft ring mask
- Mix foreground/background colors

