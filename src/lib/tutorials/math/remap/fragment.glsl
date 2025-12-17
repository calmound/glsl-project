#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
float remap(float v, float inMin, float inMax, float outMin, float outMax) {
    float t = (v - inMin) / (inMax - inMin);
    return outMin + (outMax - outMin) * t;
}
void main() {
    float t = remap(vUv.x, 0.0, 1.0, -1.0, 1.0);
    t = abs(t);
    vec3 color = mix(vec3(0.2, 0.85, 1.0), vec3(1.0, 0.25, 0.6), t);
    gl_FragColor = vec4(color, 1.0);
}
