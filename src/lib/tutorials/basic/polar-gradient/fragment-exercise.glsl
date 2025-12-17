#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main() {
    vec2 p = vUv - 0.5;

    // TODO: 计算角度 a = atan(p.y, p.x)，并映射到 0-1 得到 t
    float t = 0.0;

    vec3 color = mix(vec3(0.2, 0.85, 1.0), vec3(1.0, 0.25, 0.6), t);
    gl_FragColor = vec4(color, 1.0);
}
