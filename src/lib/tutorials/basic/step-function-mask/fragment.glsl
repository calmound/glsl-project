#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    float mask = step(0.5, vUv.x);
    vec3 leftColor = vec3(1.0, 0.4, 0.4);
    vec3 rightColor = vec3(0.4, 0.4, 1.0);
    vec3 color = mix(leftColor, rightColor, mask);
    gl_FragColor = vec4(color, 1.0);
}
