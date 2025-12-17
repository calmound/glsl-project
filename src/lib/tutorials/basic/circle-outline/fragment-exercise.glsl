#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main() {
    vec2 p = vUv - 0.5;
    float d = length(p);

    float r = 0.28;
    float w = 0.02;

    // TODO: 计算圆环遮罩 ring（提示：abs(d - r)）
    float ring = 0.0;

    vec3 bg = vec3(0.06, 0.07, 0.1);
    vec3 fg = vec3(0.9, 0.95, 1.0);
    gl_FragColor = vec4(mix(bg, fg, ring), 1.0);
}
