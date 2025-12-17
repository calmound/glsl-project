# Vignette (Edge Darkening)

Use distance to center and smoothstep() to darken edges.

## Learning Objectives
- Compute distance from center
- Build a vignette mask with smoothstep

## Exercise
- Compute d = length(vUv - 0.5)
- Create v = 1 - smoothstep(inner, outer, d)

## Hints
- Try inner=0.25, outer=0.6
