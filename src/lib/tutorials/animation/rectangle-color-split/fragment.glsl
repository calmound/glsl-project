#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec3 color;
    if (vUv.x < 0.5) {
        color = vec3(0.2, 1.0, 0.6);
    } else {
        color = vec3(0.9, 0.3, 0.3);
    }
    gl_FragColor = vec4(color, 1.0);
}
