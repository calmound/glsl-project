#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    // TODO: 将 vUv 映射为 RGB 颜色
    // TODO: 红色通道表示 vUv.x，绿色通道表示 vUv.y，蓝色设为 0
    // TODO: 输出颜色
    vec3 color = vec3(0.0);
    gl_FragColor = vec4(color, 1.0);
}
