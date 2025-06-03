#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    float x = floor(vUv.x * 8.0);
    float y = floor(vUv.y * 8.0);
    float pattern = mod(x + y, 2.0);
    vec3 color = mix(vec3(1.0), vec3(0.0), pattern);
    gl_FragColor = vec4(color, 1.0);
}
