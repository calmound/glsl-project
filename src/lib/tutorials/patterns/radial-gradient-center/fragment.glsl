#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    float dist = distance(vUv, vec2(0.5));
    vec3 innerColor = vec3(0.1, 0.8, 1.0);
    vec3 outerColor = vec3(0.0);
    vec3 color = mix(innerColor, outerColor, dist * 1.5);
    gl_FragColor = vec4(color, 1.0);
}
