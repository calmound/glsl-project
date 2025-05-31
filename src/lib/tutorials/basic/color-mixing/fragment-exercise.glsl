precision mediump float;

void main() {
    // 练习：创建颜色混合效果
    // 目标：从左到右由红色渐变到蓝色
    
    // 获取当前像素的归一化坐标
    vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
    
    // 练习1：定义红色和蓝色
    vec3 redColor = vec3(/* 请填写红色的 RGB 值 */);
    vec3 blueColor = vec3(/* 请填写蓝色的 RGB 值 */);
    
    // 练习2：使用 mix 函数进行颜色混合
    // 提示：mix(a, b, t) 在 a 和 b 之间按 t 的比例混合
    // 当 t=0 时返回 a，当 t=1 时返回 b
    vec3 finalColor = mix(/* 起始颜色 */, /* 结束颜色 */, /* 混合因子 */);
    
    gl_FragColor = vec4(finalColor, 1.0);
}