#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec3 colorA = vec3(0.15, 0.2, 0.95);
    vec3 colorB = vec3(1.0, 0.6, 0.15);

    // TODO: 构造对角线渐变因子 t（提示： (vUv.x + vUv.y) * 0.5）
    float t = 0.0;

    // TODO: 使用 clamp 将 t 限制在 0.0 - 1.0

    // TODO: 使用 mix(colorA, colorB, t) 得到 color
    vec3 color = mix(colorA, colorB, t);

    gl_FragColor = vec4(color, 1.0);
}

