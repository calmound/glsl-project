precision mediump float;

uniform vec2 u_resolution;

void main() {
    // 练习：平滑边缘
    // 目标：学习使用smoothstep函数创建平滑的边缘效果
    
    // 获取归一化坐标
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 将坐标原点移到中心
    vec2 center = uv - vec2(0.5, 0.5);
    
    // 计算到中心的距离
    float distance = length(center);
    
    // 练习1：使用step函数创建硬边缘圆形
    // 提示：step(edge, x) 当x >= edge时返回1.0，否则返回0.0
    // TODO: 用 step 构造硬边缘圆，并让圆内为 1.0
    float hardCircle = 1.0 - step(0.2, distance);
    
    // 练习2：使用smoothstep创建平滑边缘圆形
    // 提示：smoothstep(edge0, edge1, x) 在edge0和edge1之间平滑过渡
    float radius = 0.2;
    float softness = 0.05;
    // TODO: 使用 radius 与 softness 构造平滑边缘
    float smoothCircle = 1.0 - smoothstep(radius, radius + softness, distance);
    
    // 练习3：创建方形的平滑边缘
    // 提示：使用max函数和abs函数
    vec2 squareCoord = abs(center);
    // TODO: 用 max(squareCoord.x, squareCoord.y) 计算方形距离
    float squareDistance = max(squareCoord.x, squareCoord.y);
    // TODO: 用 smoothstep 设置方形平滑范围（如 0.15 到 0.15 + softness）
    float smoothSquare = 1.0 - smoothstep(0.15, 0.15 + softness, squareDistance);
    
    // 练习4：组合多个形状
    // 提示：使用max函数组合形状
    // TODO: 尝试用 max 组合 smoothCircle 与 smoothSquare
    float combined = max(smoothCircle, smoothSquare);
    
    // 练习5：添加颜色渐变
    // 提示：根据距离创建颜色变化
    vec3 innerColor = vec3(1.0, 0.8, 0.2); // 金色
    vec3 outerColor = vec3(0.2, 0.4, 1.0); // 蓝色
    // TODO: 用 combined 或其它函数作为混合因子
    vec3 finalColor = mix(outerColor, innerColor, combined);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
