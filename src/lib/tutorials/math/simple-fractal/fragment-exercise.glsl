precision mediump float;

uniform float u_time;

void main() {
    // 练习：简单分形
    // 目标：创建多层次的重复圆形图案
    
    // 获取当前像素的归一化坐标
    vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
    
    // 将坐标移到中心并添加时间动画
    vec2 pos = (uv - 0.5) * 2.0;
    pos += sin(u_time * 0.5) * 0.1;
    
    // 练习1：初始化分形参数
    float fractal = 0.0;
    // TODO: 设置初始振幅（建议 0.5）
    float amplitude = 0.5;
    
    // 练习2：创建分形循环
    // 通过多次迭代创建分形效果
    for (int i = 0; i < 4; i++) {
        // 缩放坐标
        pos *= 2.0;
        
        // 取小数部分，创建重复
        pos = fract(pos) - 0.5;
        
        // 计算到中心的距离
        // TODO: distance = length(pos)
        float distance = length(pos);
        
        // 创建圆形并添加到分形中
        float circle = smoothstep(0.4, 0.3, distance);
        // TODO: fractal += circle * amplitude
        fractal += circle * amplitude;
        
        // 减小振幅，为下一层做准备
        // TODO: amplitude *= 0.5
        amplitude *= 0.5;
    }
    
    // 练习3：添加动态颜色
    // 根据分形值和时间创建颜色
    vec3 color1 = vec3(1.0, 0.3, 0.5); // 粉红色
    vec3 color2 = vec3(0.3, 0.7, 1.0); // 蓝色
    vec3 color3 = vec3(1.0, 0.8, 0.2); // 黄色
    
    // 练习4：创建颜色混合
    // 使用分形值在不同颜色间混合
    vec3 finalColor;
    if (fractal < 0.5) {
        finalColor = mix(
            vec3(0.1, 0.1, 0.2), // 背景色
            color1,
            // TODO: 用 fractal 作为混合因子（可适当放大）
            fractal / 0.5
        );
    } else {
        finalColor = mix(
            color1,
            mix(color2, color3, sin(u_time) * 0.5 + 0.5),
            (fractal - 0.5) * 2.0
        );
    }
    
    // 练习5：添加额外的动画效果
    // 让整体颜色随时间脉动
    float pulse = sin(u_time * 2.0) * 0.1 + 0.9;
    // TODO: 让 finalColor 乘以 pulse
    finalColor *= pulse;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
