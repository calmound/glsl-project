#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main() {
    vec2 uv = vUv;
    vec2 d = abs(uv - 0.5);

    vec2 halfSize = vec2(0.28, 0.18);
    float inside = (1.0 - step(halfSize.x, d.x)) * (1.0 - step(halfSize.y, d.y));

    float thickness = 0.03;
    vec2 innerHalf = halfSize - thickness;
    float insideInner = (1.0 - step(innerHalf.x, d.x)) * (1.0 - step(innerHalf.y, d.y));

    float border = clamp(inside - insideInner, 0.0, 1.0);

    vec3 bg = vec3(0.05, 0.06, 0.08);
    vec3 fg = vec3(1.0, 0.85, 0.25);
    vec3 color = mix(bg, fg, border);
    gl_FragColor = vec4(color, 1.0);
}
