precision mediump float;

uniform float u_time;

void main() {
    // 坐标变换 - 完整实现
    // 这是最终效果代码，展示旋转和缩放的图案
    
    // 获取当前像素的归一化坐标
    vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
    
    // 将坐标原点移到屏幕中心
    vec2 centered = uv - vec2(0.5, 0.5);
    
    // 创建旋转矩阵
    // 旋转角度随时间变化
    float angle = u_time;
    float cosA = cos(angle);
    float sinA = sin(angle);
    
    // 2D旋转矩阵的应用
    vec2 rotated = vec2(
        centered.x * cosA - centered.y * sinA,
        centered.x * sinA + centered.y * cosA
    );
    
    // 应用缩放变换
    // 缩放因子随时间变化
    float scale = 1.0 + sin(u_time * 2.0) * 0.5;
    vec2 scaled = rotated * scale;
    
    // 创建重复图案
    // 使用 fract 函数创建重复效果
    vec2 repeated = fract(scaled * 3.0);
    
    // 在每个重复单元中绘制图案
    // 将重复坐标重新居中
    vec2 cellCenter = repeated - vec2(0.5);
    
    // 计算到单元中心的距离
    float dist = length(cellCenter);
    
    // 创建圆形图案
    float circle = smoothstep(0.3, 0.2, dist);
    
    // 创建颜色渐变
    vec3 color1 = vec3(1.0, 0.5, 0.2); // 橙色
    vec3 color2 = vec3(0.2, 0.5, 1.0); // 蓝色
    
    // 根据时间和位置混合颜色
    float colorMix = sin(u_time + dist * 10.0) * 0.5 + 0.5;
    vec3 finalColor = mix(color1, color2, colorMix) * circle;
    
    gl_FragColor = vec4(finalColor, 1.0);
}