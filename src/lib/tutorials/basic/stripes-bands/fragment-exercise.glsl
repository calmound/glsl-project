#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec3 colorA = vec3(0.08, 0.1, 0.12);
    vec3 colorB = vec3(0.9, 0.95, 1.0);

    // TODO: 设置条纹数量（建议 8.0 - 20.0）
    float stripeCount = 8.0;

    // TODO: 使用 fract(vUv.x * stripeCount) 得到每条纹内部的 0-1 坐标
    float x = fract(vUv.x * stripeCount);

    // TODO: 使用 step(0.5, x) 得到 0/1 遮罩（条纹两种颜色切换）
    float mask = step(0.5, x);

    vec3 color = mix(colorA, colorB, mask);
    gl_FragColor = vec4(color, 1.0);
}

