precision mediump float;

uniform float u_time;

void main() {
    // 练习：图案重复
    // 目标：创建重复的几何图案
    
    // 获取当前像素的归一化坐标
    vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
    
    // 练习1：创建基础重复
    // 使用 fract 函数将坐标重复
    float repeatCount = 5.0;
    // TODO: 使用 repeatCount
    vec2 repeated = fract(uv * repeatCount);
    
    // 练习2：在每个重复单元中创建图案
    // 将坐标重新居中到 [-0.5, 0.5] 范围
    // TODO: centered = repeated - vec2(0.5)
    vec2 centered = repeated - vec2(0.5);
    
    // 练习3：创建十字图案
    // 计算到坐标轴的距离
    float crossWidth = 0.1;
    float horizontal = step(-crossWidth, centered.y) * step(centered.y, crossWidth);
    // TODO: 竖线宽度也使用 crossWidth
    float vertical = step(-crossWidth, centered.x) * step(centered.x, crossWidth);
    
    // 组合十字图案
    // TODO: cross = max(horizontal, vertical)
    float cross = max(horizontal, vertical);
    
    // 练习4：创建圆形图案
    float distance = length(centered);
    // TODO: circle 使用 distance
    float circle = smoothstep(0.25, 0.2, distance);
    
    // 练习5：创建动态效果
    // 让图案随时间变化
    float timeOffset = sin(u_time + uv.x * 10.0 + uv.y * 10.0) * 0.5 + 0.5;
    
    // 练习6：组合不同图案
    // 根据时间在不同图案间切换
    float switchTime = sin(u_time * 0.5) * 0.5 + 0.5;
    float pattern = mix(
        cross,
        circle,
        // TODO: 使用 switchTime 作为切换因子
        switchTime
    );
    
    // 练习7：添加颜色变化
    // 根据位置和时间创建颜色
    vec3 color1 = vec3(1.0, 0.5, 0.2); // 橙色
    vec3 color2 = vec3(0.2, 0.8, 1.0); // 蓝色
    
    vec3 finalColor = mix(
        vec3(0.1), // 背景色
        mix(color1, color2, timeOffset),
        // TODO: 使用 pattern 作为遮罩
        pattern
    );
    
    gl_FragColor = vec4(finalColor, 1.0);
}
