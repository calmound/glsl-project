precision mediump float;

varying vec2 vUv;

void main() {
    vec3 color1 = vec3(1.0, 0.0, 0.0);
    vec3 color2 = vec3(0.0, 1.0, 0.0);
    // TODO: 使用 mix 函数，根据 vUv.x 实现从 color1 到 color2 的渐变
    vec3 blendedColor = color1;

    // TODO: 输出颜色
    gl_FragColor = vec4(blendedColor, 1.0);
}
