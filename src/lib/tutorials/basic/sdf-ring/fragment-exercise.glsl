#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec2 p = vUv - 0.5;

    float radius = 0.28;
    float thickness = 0.03;
    float aa = 0.006;

    // TODO: 计算圆环距离 ringDist（提示：abs(length(p) - radius)）
    float ringDist = 0.0;

    // TODO: 用 smoothstep 把距离转成遮罩 mask（提示：1.0 - smoothstep(...)）
    float mask = 0.0;

    vec3 bg = vec3(0.06, 0.07, 0.1);
    vec3 fg = vec3(1.0, 0.85, 0.25);
    vec3 color = mix(bg, fg, mask);

    gl_FragColor = vec4(color, 1.0);
}

