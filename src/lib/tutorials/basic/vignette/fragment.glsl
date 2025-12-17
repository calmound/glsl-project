#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main() {
    vec2 p = vUv - 0.5;
    float d = length(p);
    float v = 1.0 - smoothstep(0.25, 0.6, d);
    vec3 color = mix(vec3(0.03, 0.04, 0.06), vec3(0.25, 0.9, 0.85), v);
    gl_FragColor = vec4(color, 1.0);
}
