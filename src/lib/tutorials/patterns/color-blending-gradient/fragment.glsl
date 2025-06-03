#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec3 colorA = vec3(1.0, 0.0, 0.0);
    vec3 colorB = vec3(0.0, 0.0, 1.0);
    vec3 color = mix(colorA, colorB, vUv.x);
    gl_FragColor = vec4(color, 1.0);
}
