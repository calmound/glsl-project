#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}
void main() {
    vec2 p = vUv - 0.5;

    // TODO: 用 rot(u_time * 0.8) 旋转坐标 p

    float d = max(abs(p.x), abs(p.y));
    float box = 1.0 - smoothstep(0.22, 0.23, d);

    vec3 bg = vec3(0.05, 0.06, 0.08);
    vec3 fg = vec3(0.35, 1.0, 0.65);
    gl_FragColor = vec4(mix(bg, fg, box), 1.0);
}
