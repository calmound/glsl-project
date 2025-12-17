#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
float sphereSDF(vec2 p, float r) {
    return length(p) - r;
}

vec3 estimateNormal(vec2 p) {
    float e = 0.001;
    float d = sphereSDF(p, 0.32);
    vec2 n = vec2(
        sphereSDF(p + vec2(e, 0.0), 0.32) - d,
        sphereSDF(p + vec2(0.0, e), 0.32) - d
    );
    vec3 normal = normalize(vec3(n, 0.35));
    return normal;
}
void main() {
    vec2 p = vUv - 0.5;
    float d = sphereSDF(p, 0.32);

    vec3 bg = vec3(0.05, 0.06, 0.08);
    if (d > 0.0) {
        gl_FragColor = vec4(bg, 1.0);
        return;
    }

    vec3 n = estimateNormal(p);
    vec3 lightDir = normalize(vec3(-0.4, 0.6, 0.7));

    // TODO: 计算漫反射 diff = max(dot(n, lightDir), 0.0)
    float diff = 0.0;

    vec3 base = vec3(0.25, 0.9, 0.85);
    vec3 color = base * (0.15 + 0.85 * diff);

    gl_FragColor = vec4(mix(bg, color, 1.0), 1.0);
}
