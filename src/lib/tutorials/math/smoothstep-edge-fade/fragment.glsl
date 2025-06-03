#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    float dist = distance(vUv, vec2(0.5));
    float mask = smoothstep(0.3, 0.5, dist);
    vec3 color = mix(vec3(1.0, 0.8, 0.2), vec3(0.0), mask);
    gl_FragColor = vec4(color, 1.0);
}
