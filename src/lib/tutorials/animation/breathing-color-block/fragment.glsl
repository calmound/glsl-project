#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
varying vec2 vUv;

void main() {
    float brightness = 0.5 + 0.5 * sin(u_time);
    vec3 color = vec3(brightness, 0.6, 0.9);
    gl_FragColor = vec4(color, 1.0);
}
