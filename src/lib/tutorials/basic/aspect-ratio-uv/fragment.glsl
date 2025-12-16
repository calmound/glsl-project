#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform vec2 u_resolution;

void main() {
    vec2 uv = vUv;

    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = uv - 0.5;
    p.x *= aspect;

    float d = length(p);
    float r = 0.25;
    float aa = 0.006;
    float mask = 1.0 - smoothstep(r, r + aa, d);

    vec3 bg = vec3(0.05, 0.06, 0.08);
    vec3 fg = vec3(0.2, 0.85, 1.0);
    vec3 color = mix(bg, fg, mask);

    gl_FragColor = vec4(color, 1.0);
}

