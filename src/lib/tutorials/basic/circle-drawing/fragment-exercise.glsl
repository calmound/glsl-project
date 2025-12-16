precision mediump float;

uniform vec2 u_resolution;

void main() {
    // 练习：绘制一个圆形
    // 目标：在屏幕中央绘制一个白色圆形，背景为黑色
    
    // 获取当前像素的归一化坐标 (0.0 到 1.0)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 练习1：将坐标系移动到屏幕中心
    // 提示：减去 0.5 可以将坐标范围从 [0,1] 变为 [-0.5, 0.5]
    // TODO: 使用 vec2(0.5) 作为中心点偏移
    vec2 center = uv - vec2(0.5);
    
    // 练习2：计算当前像素到中心的距离
    // 提示：使用 length() 函数计算向量的长度
    // TODO: 使用 length(center)
    float distance = length(center);
    
    // 练习3：定义圆的半径
    float radius = 0.2;
    
    // 练习4：判断当前像素是否在圆内
    // 提示：如果距离小于半径，则在圆内
    // TODO: 判断 distance < radius
    bool insideCircle = distance < radius;
    
    // 练习5：根据位置设置颜色
    vec3 color;
    if (insideCircle) {
        // TODO: 圆内颜色（白色）
        color = vec3(1.0);
    } else {
        // TODO: 圆外颜色（黑色）
        color = vec3(0.0);
    }
    
    gl_FragColor = vec4(color, 1.0);
}
