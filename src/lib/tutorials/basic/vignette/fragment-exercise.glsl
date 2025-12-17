#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main() {
    vec2 p = vUv - 0.5;
    float d = length(p);

    // TODO: 用 smoothstep 做暗角遮罩 v（中心亮，四周暗）
    float v = 1.0;

    vec3 color = mix(vec3(0.03, 0.04, 0.06), vec3(0.25, 0.9, 0.85), v);
    gl_FragColor = vec4(color, 1.0);
}
