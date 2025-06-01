#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec2 center = vec2(0.5, 0.5);
    float radius = 0.3;
    float dist = distance(vUv, center);
    float inside = step(dist, radius);
    vec3 color = mix(vec3(0.0), vec3(1.0, 0.8, 0.2), inside);
    gl_FragColor = vec4(color, 1.0);
}
