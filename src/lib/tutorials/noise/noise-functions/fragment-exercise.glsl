// 噪声函数（练习版）
// 教程ID: noise-functions

precision mediump float;

uniform vec2 u_resolution; // 画布尺寸
uniform float u_time; // 时间（秒）

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float valueNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // TODO: 用平滑曲线替代线性插值（比如 u = f*f*(3-2f)）
    vec2 u = smoothstep(0.0, 1.0, f);

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    vec2 pos = uv * 5.0;
    pos.x += u_time * 0.5;

    // TODO: 修改 scale/pos，观察随机噪声与平滑噪声的区别
    float n = valueNoise(pos);

    gl_FragColor = vec4(vec3(n), 1.0);
}

