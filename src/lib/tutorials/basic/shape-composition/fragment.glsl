#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

float rectMask(vec2 uv, vec2 center, vec2 halfSize) {
    vec2 d = abs(uv - center);
    float insideX = 1.0 - step(halfSize.x, d.x);
    float insideY = 1.0 - step(halfSize.y, d.y);
    return insideX * insideY;
}

void main() {
    vec2 uv = vUv;

    float rect = rectMask(uv, vec2(0.5), vec2(0.18, 0.1));

    vec2 p = uv - 0.5;
    float r = 0.22;
    float aa = 0.008;
    float circle = 1.0 - smoothstep(r, r + aa, length(p));

    float combined = max(rect, circle);

    vec3 bg = vec3(0.07, 0.08, 0.12);
    vec3 fg = vec3(0.35, 1.0, 0.65);
    vec3 color = mix(bg, fg, combined);

    gl_FragColor = vec4(color, 1.0);
}

