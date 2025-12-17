#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
void main() {
    // TODO: 让渐变随时间向右移动（提示：fract(vUv.x + u_time * speed)）
    float t = vUv.x;
    vec3 color = mix(vec3(0.05, 0.06, 0.08), vec3(0.9, 0.95, 1.0), t);
    gl_FragColor = vec4(color, 1.0);
}
