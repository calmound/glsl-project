#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main() {
    float steps = 6.0;

    // TODO: 将 vUv.x 量化成 steps 个等级（提示：floor）
    float t = 0.0;

    vec3 a = vec3(0.1, 0.15, 0.25);
    vec3 b = vec3(0.9, 0.35, 0.25);
    vec3 color = mix(a, b, t);

    gl_FragColor = vec4(color, 1.0);
}
