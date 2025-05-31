// 噪声函数
// 教程ID: noise-functions

precision mediump float;

uniform vec2 u_resolution; // 画布尺寸
uniform float u_time; // 时间（秒）

// 伪随机数生成函数
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 值噪声函数
float valueNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    // 四个角的随机值
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    // 平滑插值
    vec2 u = smoothstep(0.0, 1.0, f);
    
    // 混合4个角的值
    return mix(
        mix(a, b, u.x),
        mix(c, d, u.x),
        u.y
    );
}

// Perlin噪声（简化版）
float perlinNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    // 四个角的随机梯度
    vec2 a = random(i) * 2.0 - 1.0;
    vec2 b = random(i + vec2(1.0, 0.0)) * 2.0 - 1.0;
    vec2 c = random(i + vec2(0.0, 1.0)) * 2.0 - 1.0;
    vec2 d = random(i + vec2(1.0, 1.0)) * 2.0 - 1.0;
    
    // 计算点积
    float dotA = dot(a, f);
    float dotB = dot(b, f - vec2(1.0, 0.0));
    float dotC = dot(c, f - vec2(0.0, 1.0));
    float dotD = dot(d, f - vec2(1.0, 1.0));
    
    // 平滑插值
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(
        mix(dotA, dotB, u.x),
        mix(dotC, dotD, u.x),
        u.y
    ) * 0.5 + 0.5; // 将范围从[-1,1]转换到[0,1]
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 将画布分成三部分显示不同类型的噪声
    vec3 color;
    
    // 坐标缩放和动画
    vec2 pos = uv * 5.0;
    pos.x += u_time * 0.5;
    
    if (uv.x < 0.33) {
        // 随机噪声
        color = vec3(random(pos * 10.0));
    } else if (uv.x < 0.66) {
        // 值噪声
        color = vec3(valueNoise(pos));
    } else {
        // Perlin噪声
        color = vec3(perlinNoise(pos));
    }
    
    // 添加分隔线
    if (abs(uv.x - 0.33) < 0.002 || abs(uv.x - 0.66) < 0.002) {
        color = vec3(1.0, 0.0, 0.0);
    }
    
    gl_FragColor = vec4(color, 1.0);
}
