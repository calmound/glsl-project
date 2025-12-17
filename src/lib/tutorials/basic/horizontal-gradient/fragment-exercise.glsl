#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main() {
    vec3 a = vec3(0.15, 0.2, 0.95);
    vec3 b = vec3(1.0, 0.6, 0.15);

    // TODO: 使用 vUv.x 作为插值因子（从左到右渐变）
    float t = 0.0;

    vec3 color = mix(a, b, t);
    gl_FragColor = vec4(color, 1.0);
}
