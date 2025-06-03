precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    // 练习：正弦波动画
    // 目标：学习如何使用三角函数创建波浪效果
    
    // 归一化坐标
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 练习1：创建基础正弦波
    // 提示：使用sin函数，输入为x坐标乘以频率
    float wave = sin(/* 请填写正弦波表达式 */);
    
    // 练习2：添加时间动画
    // 提示：在sin函数中加入u_time使波浪移动
    float animatedWave = sin(uv.x * 10.0 + /* 请填写时间相关项 */);
    
    // 练习3：调整波浪的振幅和偏移
    // 提示：sin函数返回[-1,1]，需要转换为[0,1]
    float normalizedWave = /* 请填写归一化表达式 */;
    
    // 练习4：创建波浪带
    // 提示：使用abs()和smoothstep()创建平滑的波浪带
    float waveStripe = 1.0 - smoothstep(0.0, 0.1, abs(uv.y - normalizedWave));
    
    // 练习5：添加颜色渐变
    // 提示：根据y坐标和时间创建颜色变化
    vec3 color1 = vec3(1.0, 0.5, 0.2); // 橙色
    vec3 color2 = vec3(0.2, 0.5, 1.0); // 蓝色
    float colorMix = sin(/* 请填写颜色混合因子 */) * 0.5 + 0.5;
    vec3 waveColor = mix(/* 请填写颜色混合 */);
    
    vec3 finalColor = waveColor * waveStripe;
    
    gl_FragColor = vec4(finalColor, 1.0);
}