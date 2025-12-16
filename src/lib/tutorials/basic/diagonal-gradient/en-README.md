# Diagonal Gradient

You already know how `vUv.x` produces a left-to-right gradient and `vUv.y` produces a bottom-to-top gradient. Here we combine them to form a **diagonal** gradient.

## Exercise

- Create a factor `t` from UV: `(vUv.x + vUv.y) * 0.5`
- Clamp it to `[0.0, 1.0]`
- Use `mix(colorA, colorB, t)` to output the final color

