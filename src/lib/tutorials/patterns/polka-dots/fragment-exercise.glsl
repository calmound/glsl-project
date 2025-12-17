#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main() {
    float count = 8.0;

    // TODO: 把 vUv 分成网格，并让每个单元以中心为原点（提示：fract(vUv*count)-0.5）
    vec2 gv = vec2(0.0);

    float d = length(gv);

    // TODO: 用 smoothstep 画圆点（单元中心为 1，外部为 0）
    float dot = 0.0;

    vec3 bg = vec3(0.06, 0.07, 0.1);
    vec3 fg = vec3(1.0, 0.85, 0.25);
    gl_FragColor = vec4(mix(bg, fg, dot), 1.0);
}
