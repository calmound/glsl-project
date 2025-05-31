precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

// 伪随机函数
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 平滑噪声函数
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    // 获取四个角的随机值
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    // 使用平滑插值
    vec2 u = f * f * (3.0 - 2.0 * f); // 平滑曲线
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    // 将坐标标准化
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 缩放坐标以控制噪声的频率
    vec2 pos = uv * 8.0;
    
    // 生成基础噪声
    float n = noise(pos);
    
    // 添加时间动画
    float animatedNoise = noise(pos + u_time * 0.5);
    
    // 组合不同频率的噪声（分形噪声）
    float fractalNoise = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
        fractalNoise += amplitude * noise(pos * frequency + u_time * 0.1);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    
    // 选择要显示的噪声类型
    float finalNoise = fractalNoise; // 可以改为 n 或 animatedNoise
    
    // 创建颜色
    vec3 color = vec3(finalNoise);
    
    // 彩色噪声版本（注释掉上面的 color 赋值来使用）
    // vec3 color = vec3(
    //     finalNoise,
    //     finalNoise * 0.8,
    //     finalNoise * 0.6
    // );
    
    // 云朵效果（注释掉上面的 color 赋值来使用）
    // float cloud = smoothstep(0.3, 0.7, finalNoise);
    // vec3 skyColor = vec3(0.5, 0.7, 1.0);
    // vec3 cloudColor = vec3(1.0, 1.0, 1.0);
    // vec3 color = mix(skyColor, cloudColor, cloud);
    
    gl_FragColor = vec4(color, 1.0);
}