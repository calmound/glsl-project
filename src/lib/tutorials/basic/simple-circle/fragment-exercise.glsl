precision mediump float;

uniform vec2 u_resolution;

void main() {
    // 练习：绘制简单圆形
    // 目标：学习基础的距离函数和条件判断
    
    // 获取当前像素的归一化坐标 (0.0 到 1.0)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 练习1：将坐标原点移到屏幕中心
    // 提示：减去0.5使坐标范围变为[-0.5, 0.5]
    // TODO: 使用 vec2(0.5) 作为中心偏移
    vec2 center = uv - vec2(0.5);
    
    // 练习2：计算当前像素到中心的距离
    // 提示：使用length()函数
    // TODO: 使用 length(center)
    float distance = length(center);
    
    // 练习3：定义圆的半径
    // TODO: 选择一个合适的半径值（如 0.25）
    float radius = 0.25;
    
    // 练习4：创建圆形
    // 提示：当距离小于半径时为1.0，否则为0.0
    // TODO: 使用 step(radius, distance) 并取反得到圆内为 1.0
    float circle = 1.0 - step(radius, distance);
    
    // 练习5：设置颜色
    // 提示：圆内为白色，圆外为黑色
    // TODO: 使用 circle 作为颜色强度
    vec3 color = vec3(circle);
    
    gl_FragColor = vec4(color, 1.0);
}
