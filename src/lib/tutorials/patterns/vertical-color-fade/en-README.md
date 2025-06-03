# Vertical Color Fade

## Learning Objectives

Learn how to apply a vertical gradient using `vUv.y` and `mix()`. This introduces vertical spatial control using UV coordinates.

## Key Concepts

### `vUv.y`

While `vUv.x` is for horizontal placement, `vUv.y` controls the vertical direction. Bottom values are near 0, top values are near 1.

### Gradient Principle

A vertical blend between two colors is achieved with `mix(bottomColor, topColor, vUv.y)`.
