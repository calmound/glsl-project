# Circle Outline

Draw a ring by using abs(distance - radius) and smoothstep().

## Learning Objectives
- Compute distance to center
- Build a ring mask from abs(d-r)

## Exercise
- Compute ring = 1 - smoothstep(w, w+aa, abs(d-r))

## Hints
- Use r=0.28, w=0.02
