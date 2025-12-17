#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main() {
    float count = 8.0;
    vec2 gv = fract(vUv * count) - 0.5;
    float d = length(gv);
    float dot = 1.0 - smoothstep(0.18, 0.19, d);
    vec3 bg = vec3(0.06, 0.07, 0.1);
    vec3 fg = vec3(1.0, 0.85, 0.25);
    gl_FragColor = vec4(mix(bg, fg, dot), 1.0);
}
