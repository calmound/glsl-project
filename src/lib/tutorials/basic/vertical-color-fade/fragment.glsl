#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec3 bottomColor = vec3(0.0, 1.0, 0.0); // 绿色
    vec3 topColor = vec3(1.0, 1.0, 0.0);    // 黄色
    vec3 color = mix(bottomColor, topColor, vUv.y);
    gl_FragColor = vec4(color, 1.0);
}
