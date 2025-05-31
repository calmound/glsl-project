precision mediump float;

void main() {
    // 练习：平滑边缘
    // 目标：学习使用smoothstep函数创建平滑的边缘效果
    
    // 获取归一化坐标
    vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
    
    // 将坐标原点移到中心
    vec2 center = uv - vec2(0.5, 0.5);
    
    // 计算到中心的距离
    float distance = length(center);
    
    // 练习1：使用step函数创建硬边缘圆形
    // 提示：step(edge, x) 当x >= edge时返回1.0，否则返回0.0
    float hardCircle = step(/* 请填写边缘值 */, /* 请填写比较值 */);
    
    // 练习2：使用smoothstep创建平滑边缘圆形
    // 提示：smoothstep(edge0, edge1, x) 在edge0和edge1之间平滑过渡
    float radius = 0.2;
    float softness = 0.05;
    float smoothCircle = 1.0 - smoothstep(/* 请填写起始边缘 */, /* 请填写结束边缘 */, distance);
    
    // 练习3：创建方形的平滑边缘
    // 提示：使用max函数和abs函数
    vec2 squareCoord = abs(center);
    float squareDistance = max(/* 请填写方形距离计算 */);
    float smoothSquare = 1.0 - smoothstep(0.15, /* 请填写平滑范围 */, squareDistance);
    
    // 练习4：组合多个形状
    // 提示：使用max函数组合形状
    float combined = max(/* 请填写形状组合 */);
    
    // 练习5：添加颜色渐变
    // 提示：根据距离创建颜色变化
    vec3 innerColor = vec3(1.0, 0.8, 0.2); // 金色
    vec3 outerColor = vec3(0.2, 0.4, 1.0); // 蓝色
    vec3 finalColor = mix(outerColor, innerColor, /* 请填写混合因子 */);
    
    gl_FragColor = vec4(finalColor, 1.0);
}