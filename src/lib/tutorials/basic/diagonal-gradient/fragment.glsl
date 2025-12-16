#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    float t = (vUv.x + vUv.y) * 0.5;
    t = clamp(t, 0.0, 1.0);

    vec3 colorA = vec3(0.15, 0.2, 0.95);
    vec3 colorB = vec3(1.0, 0.6, 0.15);
    vec3 color = mix(colorA, colorB, t);

    gl_FragColor = vec4(color, 1.0);
}

