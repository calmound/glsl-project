precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    // 将坐标标准化到 0.0 到 1.0 范围
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 定义矩形的边界
    float left = 0.2;
    float right = 0.8;
    float bottom = 0.3;
    float top = 0.7;
    
    // 检查当前像素是否在矩形内
    bool insideRect = (uv.x > left && uv.x < right && uv.y > bottom && uv.y < top);
    
    // 根据是否在矩形内设置颜色
    vec3 color;
    if (insideRect) {
        color = vec3(1.0, 0.0, 0.0); // 红色矩形
    } else {
        color = vec3(0.0, 0.0, 0.0); // 黑色背景
    }
    
    gl_FragColor = vec4(color, 1.0);
    
    // 更简洁的写法（使用 step 函数）：
    // float rect = step(left, uv.x) * step(uv.x, right) * step(bottom, uv.y) * step(uv.y, top);
    // vec3 rectColor = vec3(1.0, 0.0, 0.0);
    // vec3 bgColor = vec3(0.0, 0.0, 0.0);
    // vec3 finalColor = mix(bgColor, rectColor, rect);
    // gl_FragColor = vec4(finalColor, 1.0);
    
    // 动态矩形示例：
    // float size = 0.3 + 0.2 * sin(u_time);
    // float halfSize = size * 0.5;
    // vec2 center = vec2(0.5, 0.5);
    // bool dynamicRect = (uv.x > center.x - halfSize && uv.x < center.x + halfSize && 
    //                     uv.y > center.y - halfSize && uv.y < center.y + halfSize);
}