#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
}
void main() {
    // TODO: 用 hash21 + floor(vUv * grid) 生成随机格点噪声
    float n = 0.0;
    gl_FragColor = vec4(vec3(n), 1.0);
}
