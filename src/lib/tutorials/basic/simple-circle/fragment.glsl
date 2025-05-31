precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    // 将像素坐标转换为 0.0 到 1.0 的范围
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 将坐标系移动到中心 (0.5, 0.5 变成 0.0, 0.0)
    vec2 center = uv - vec2(0.5, 0.5);
    
    // 计算当前像素到中心的距离
    float dist = distance(center, vec2(0.0, 0.0));
    // 或者可以写成：float dist = length(center);
    
    // 定义圆的半径
    float radius = 0.3;
    
    // 如果距离小于半径，就是圆内，显示白色；否则显示黑色
    if (dist < radius) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // 白色
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // 黑色
    }
    
    // 更简洁的写法（使用 step 函数）：
    // float circle = step(dist, radius);
    // gl_FragColor = vec4(circle, circle, circle, 1.0);
}