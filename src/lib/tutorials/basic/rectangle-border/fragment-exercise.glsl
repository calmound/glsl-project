#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main() {
    vec2 uv = vUv;
    vec2 d = abs(uv - 0.5);

    vec2 halfSize = vec2(0.28, 0.18);

    // TODO: 计算外矩形遮罩 inside（矩形内为 1，外为 0）
    float inside = 0.0;

    float thickness = 0.03;
    vec2 innerHalf = halfSize - thickness;

    // TODO: 计算内矩形遮罩 insideInner
    float insideInner = 0.0;

    // TODO: 边框遮罩 border = inside - insideInner
    float border = clamp(inside - insideInner, 0.0, 1.0);

    vec3 bg = vec3(0.05, 0.06, 0.08);
    vec3 fg = vec3(1.0, 0.85, 0.25);
    vec3 color = mix(bg, fg, border);
    gl_FragColor = vec4(color, 1.0);
}
