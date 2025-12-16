precision mediump float;

uniform vec2 u_resolution;

void main() {
    // 绘制一个圆形 - 完整实现
    // 这是最终效果代码，展示如何在屏幕中央绘制一个白色圆形
    
    // 获取当前像素的归一化坐标 (0.0 到 1.0)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 将坐标系移动到屏幕中心
    // 减去 0.5 可以将坐标范围从 [0,1] 变为 [-0.5, 0.5]
    vec2 center = uv - vec2(0.5, 0.5);
    
    // 计算当前像素到中心的距离
    // 使用 length() 函数计算向量的长度
    float distance = length(center);
    
    // 定义圆的半径
    float radius = 0.2;
    
    // 判断当前像素是否在圆内
    // 如果距离小于半径，则在圆内
    bool insideCircle = distance < radius;
    
    // 根据位置设置颜色
    vec3 color;
    if (insideCircle) {
        // 圆内为白色
        color = vec3(1.0, 1.0, 1.0);
    } else {
        // 圆外为黑色
        color = vec3(0.0, 0.0, 0.0);
    }
    
    gl_FragColor = vec4(color, 1.0);
}
