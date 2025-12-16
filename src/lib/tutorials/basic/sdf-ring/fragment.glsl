#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

void main() {
    vec2 p = vUv - 0.5;

    float radius = 0.28;
    float thickness = 0.03;
    float aa = 0.006;

    float ringDist = abs(length(p) - radius);
    float mask = 1.0 - smoothstep(thickness, thickness + aa, ringDist);

    vec3 bg = vec3(0.06, 0.07, 0.1);
    vec3 fg = vec3(1.0, 0.85, 0.25);
    vec3 color = mix(bg, fg, mask);

    gl_FragColor = vec4(color, 1.0);
}

