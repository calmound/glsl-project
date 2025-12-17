#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
void main() {
    vec2 p = vUv - 0.5;
    float d = length(p);
    float wave = sin(12.0 * d - u_time * 3.0);
    float t = wave * 0.5 + 0.5;
    vec3 color = mix(vec3(0.1, 0.12, 0.18), vec3(0.2, 0.85, 1.0), t);
    gl_FragColor = vec4(color, 1.0);
}
