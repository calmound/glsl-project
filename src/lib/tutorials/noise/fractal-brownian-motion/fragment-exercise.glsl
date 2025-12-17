// 分形布朗运动（练习版）
// 教程ID: fractal-brownian-motion

precision mediump float;

uniform vec2 u_resolution; // 画布尺寸
uniform float u_time; // 时间（秒）

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = smoothstep(0.0, 1.0, f);

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 st, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < 10; i++) {
        if (i >= octaves) break;
        value += amplitude * noise(st * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }

    return value;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 pos = uv * 3.0;
    pos.x += u_time * 0.1;

    // TODO: 修改 octaves（1/3/6）观察细节层次变化
    int octaves = 4;
    float n = fbm(pos, octaves);

    vec3 color = mix(vec3(0.2, 0.1, 0.4), vec3(0.8, 0.7, 0.0), n);
    gl_FragColor = vec4(color, 1.0);
}

