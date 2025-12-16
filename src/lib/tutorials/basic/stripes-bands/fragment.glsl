#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    float stripeCount = 12.0;
    float x = fract(vUv.x * stripeCount);
    float mask = step(0.5, x);

    vec3 colorA = vec3(0.08, 0.1, 0.12);
    vec3 colorB = vec3(0.9, 0.95, 1.0);
    vec3 color = mix(colorA, colorB, mask);

    gl_FragColor = vec4(color, 1.0);
}

