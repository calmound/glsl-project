#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main() {
    float steps = 6.0;
    float t = floor(vUv.x * steps) / (steps - 1.0);

    vec3 a = vec3(0.1, 0.15, 0.25);
    vec3 b = vec3(0.9, 0.35, 0.25);
    vec3 color = mix(a, b, t);

    gl_FragColor = vec4(color, 1.0);
}
