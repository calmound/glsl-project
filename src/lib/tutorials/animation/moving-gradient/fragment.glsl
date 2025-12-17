#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
void main() {
    float t = fract(vUv.x + u_time * 0.2);
    vec3 color = mix(vec3(0.05, 0.06, 0.08), vec3(0.9, 0.95, 1.0), t);
    gl_FragColor = vec4(color, 1.0);
}
