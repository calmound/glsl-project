#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec2 uv = vUv;

    // TODO: 1) 用 step 构造矩形遮罩 rect（提示：比较 abs(uv - center) 与 halfSize）
    float rect = 0.0;

    // TODO: 2) 用 smoothstep 构造圆形遮罩 circle（提示：circle = 1.0 - smoothstep(r, r+aa, length(uv-0.5))）
    float circle = 0.0;

    // TODO: 3) 用 max(rect, circle) 合并成 combined
    float combined = max(rect, circle);

    vec3 bg = vec3(0.07, 0.08, 0.12);
    vec3 fg = vec3(0.35, 1.0, 0.65);
    vec3 color = mix(bg, fg, combined);

    gl_FragColor = vec4(color, 1.0);
}

