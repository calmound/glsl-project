precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    // 将坐标标准化到 0.0 到 1.0 范围
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 波形参数
    float frequency = 5.0;  // 频率（波的密度）
    float amplitude = 0.1;  // 振幅（波的高度）
    float speed = 2.0;      // 速度（动画快慢）
    
    // 计算正弦波
    // sin(频率 * x坐标 + 时间 * 速度)
    float wave = sin(frequency * uv.x + u_time * speed);
    
    // 将波形从 [-1, 1] 范围映射到屏幕坐标
    float waveY = 0.5 + amplitude * wave;
    
    // 计算当前像素到波形的距离
    float dist = abs(uv.y - waveY);
    
    // 创建波形线条（使用 smoothstep 创建平滑边缘）
    float lineWidth = 0.02;
    float line = 1.0 - smoothstep(0.0, lineWidth, dist);
    
    // 设置颜色
    vec3 waveColor = vec3(0.0, 1.0, 1.0); // 青色波形
    vec3 bgColor = vec3(0.0, 0.0, 0.2);   // 深蓝色背景
    
    vec3 finalColor = mix(bgColor, waveColor, line);
    
    gl_FragColor = vec4(finalColor, 1.0);
    
    // 其他波形效果示例：
    // 多重波形
    // float wave1 = sin(frequency * uv.x + u_time * speed);
    // float wave2 = sin(frequency * 2.0 * uv.x + u_time * speed * 1.5);
    // float combinedWave = (wave1 + wave2 * 0.5) / 1.5;
    
    // 彩色波形（基于位置变色）
    // vec3 rainbowColor = vec3(
    //     0.5 + 0.5 * sin(uv.x * 10.0 + u_time),
    //     0.5 + 0.5 * sin(uv.x * 10.0 + u_time + 2.0),
    //     0.5 + 0.5 * sin(uv.x * 10.0 + u_time + 4.0)
    // );
}