// 分形布朗运动
// 教程ID: fractal-brownian-motion

precision mediump float;

uniform vec2 u_resolution; // 画布尺寸
uniform float u_time; // 时间（秒）

// 伪随机数生成函数
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 值噪声函数
float noise(vec2 st) {
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

// 分形布朗运动
float fbm(vec2 st, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    // 累加多个不同频率和振幅的噪声
    for(int i = 0; i < 10; i ++ ) {
        if (i >= octaves)break;
        
        value += amplitude * noise(st * frequency);
        
        // 每次迭代，频率加倍，振幅减半
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    
    return value;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 坐标缩放
    vec2 pos = uv * 3.0;
    
    // 添加时间动画
    pos.x += u_time * 0.1;
    
    // 显示不同数量倍频的FBM效果
    vec3 color;
    
    if (uv.x < 0.33) {
        // 1倍频
        color = vec3(fbm(pos, 1));
    } else if (uv.x < 0.66) {
        // 3倍频
        color = vec3(fbm(pos, 3));
    } else {
        // 6倍频
        color = vec3(fbm(pos, 6));
    }
    
    // 添加分隔线
    if (abs(uv.x - 0.33) < 0.002 || abs(uv.x - 0.66) < 0.002) {
        color = vec3(1.0, 0.0, 0.0);
    }
    
    // 添加颜色
    color = mix(
        vec3(0.2, 0.1, 0.4),
        vec3(0.8, 0.7, 0.0),
        color
    );
    
    gl_FragColor = vec4(color, 1.0);
}
