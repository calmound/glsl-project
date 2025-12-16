#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec3 leftColor = vec3(0.2, 1.0, 0.6);
    vec3 rightColor = vec3(0.9, 0.3, 0.3);

    // TODO: 使用 step(0.5, vUv.x) 生成遮罩 mask（左侧 0，右侧 1）
    float mask = 0.0;

    // TODO: 使用 mix(leftColor, rightColor, mask) 得到最终颜色
    vec3 color = leftColor;

    gl_FragColor = vec4(color, 1.0);
}
