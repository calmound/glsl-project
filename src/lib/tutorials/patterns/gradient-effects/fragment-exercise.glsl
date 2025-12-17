precision mediump float;

uniform float u_time;

void main() {
    // 练习：创建渐变效果
    // 目标：创建一个从左下角到右上角的彩虹渐变
    
    // 获取当前像素的归一化坐标
    vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
    
    // 练习1：创建基础渐变
    // 提示：可以直接使用 uv 坐标作为颜色分量
    // TODO: 蓝色分量可以用 (uv.x + uv.y) * 0.5 或常量
    vec3 color1 = vec3(uv.x, uv.y, (uv.x + uv.y) * 0.5);
    
    // 练习2：创建径向渐变
    // 计算到中心的距离
    vec2 center = uv - vec2(0.5);
    float distance = length(center);
    
    // 使用距离创建径向渐变
    // TODO: 绿色分量可用 1.0 - distance
    vec3 color2 = vec3(distance, 1.0 - distance, 1.0 - distance);
    
    // 练习3：创建动态渐变
    // 使用时间创建动画效果
    float timeOffset = sin(u_time) * 0.5 + 0.5;
    vec3 color3 = vec3(
        uv.x + timeOffset * 0.3,
        // TODO: 给 y 分量一个时间偏移（如 timeOffset * 0.2）
        uv.y + timeOffset * 0.2,
        0.8
    );
    
    // 练习4：混合不同的渐变
    // 使用 mix 函数组合渐变效果
    vec3 finalColor = mix(
        // TODO: 混合因子可用 0.5 或 distance
        mix(color1, color2, 0.5),
        color3,
        sin(u_time * 0.5) * 0.5 + 0.5
    );
    
    gl_FragColor = vec4(finalColor, 1.0);
}
