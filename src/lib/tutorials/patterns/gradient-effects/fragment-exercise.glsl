precision mediump float;

uniform float u_time;

void main() {
    // 练习：创建渐变效果
    // 目标：创建一个从左下角到右上角的彩虹渐变
    
    // 获取当前像素的归一化坐标
    vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
    
    // 练习1：创建基础渐变
    // 提示：可以直接使用 uv 坐标作为颜色分量
    vec3 color1 = vec3(uv.x, uv.y, /* 请填写蓝色分量 */);
    
    // 练习2：创建径向渐变
    // 计算到中心的距离
    vec2 center = uv - vec2(0.5);
    float distance = length(center);
    
    // 使用距离创建径向渐变
    vec3 color2 = vec3(distance, /* 请填写绿色分量 */, 1.0 - distance);
    
    // 练习3：创建动态渐变
    // 使用时间创建动画效果
    float timeOffset = sin(u_time) * 0.5 + 0.5;
    vec3 color3 = vec3(
        uv.x + timeOffset * 0.3,
        uv.y + /* 请填写时间偏移 */,
        0.8
    );
    
    // 练习4：混合不同的渐变
    // 使用 mix 函数组合渐变效果
    vec3 finalColor = mix(
        mix(color1, color2, /* 请填写混合因子 */),
        color3,
        sin(u_time * 0.5) * 0.5 + 0.5
    );
    
    gl_FragColor = vec4(finalColor, 1.0);
}