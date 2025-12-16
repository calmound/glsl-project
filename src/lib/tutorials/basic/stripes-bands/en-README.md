# Stripes and Bands

This exercise builds a repeating stripe pattern using:

- `fract(x)` to repeat a value every 1.0
- `step(edge, x)` to convert a value into a hard 0/1 mask

## Exercise

1. Multiply `vUv.x` by a stripe count
2. Use `fract` to keep it in `[0, 1)`
3. Use `step` to split each stripe into two halves (0 vs 1)
4. Use `mix` to pick a color based on the mask

