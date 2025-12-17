#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
void main() {
    float pulse = sin(u_time) * 0.5 + 0.5;
    vec3 base = vec3(0.15, 0.25, 0.95);
    vec3 color = base * (0.2 + 0.8 * pulse);
    gl_FragColor = vec4(color, 1.0);
}
