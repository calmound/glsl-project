#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main() {
    float count = 12.0;
    float y = fract(vUv.y * count);
    float mask = step(0.5, y);
    vec3 color = mix(vec3(0.08, 0.1, 0.12), vec3(0.9, 0.95, 1.0), mask);
    gl_FragColor = vec4(color, 1.0);
}
