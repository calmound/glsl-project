# Phong Lighting

Learn the classic Phong lighting model to create realistic 3D lighting effects.

## Learning Objectives

- Understand the three components of the Phong lighting model
- Learn how to calculate normal vectors and light directions
- Master implementation of ambient, diffuse, and specular lighting

## Key Concepts

### Phong Lighting Components

1. **Ambient**: Base illumination, simulates indirect lighting
2. **Diffuse**: Surface roughness, light scatters uniformly
3. **Specular**: Surface smoothness, creates highlights

### Lighting Calculation Formula

```glsl
vec3 ambient = ambientStrength * lightColor;
vec3 diffuse = max(dot(normal, lightDir), 0.0) * lightColor;
vec3 specular = pow(max(dot(viewDir, reflectDir), 0.0), shininess) * lightColor;
vec3 result = ambient + diffuse + specular;
```

### Key Vectors

- **Normal**: Surface perpendicular direction
- **Light Direction**: From surface to light source
- **View Direction**: From surface to observer
- **Reflect Direction**: Light reflection direction

## Exercise

Implement a complete Phong lighting model with ambient, diffuse, and specular components.

### Hints

1. Define light position and color
2. Calculate surface normal (can use simple sphere normal)
3. Implement calculations for all three lighting components
4. Adjust intensity parameters for each component
5. Combine final lighting result

## Expected Result

You should see a 3D surface with realistic lighting effects, including soft ambient light, angle-dependent diffuse lighting, and bright specular highlights.