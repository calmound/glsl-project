precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    // 将坐标转换为 -1 到 1 的范围，中心为原点
    vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
    
    // 计算到中心的距离
    float dist = length(uv);
    
    // 圆的半径
    float radius = 0.5;
    
    // 使用 step 函数创建硬边缘（对比用）
    // float hardEdge = step(dist, radius);
    
    // 使用 smoothstep 函数创建平滑边缘
    // smoothstep(edge0, edge1, x) 在 edge0 和 edge1 之间创建平滑过渡
    float edge0 = radius - 0.1; // 内边缘
    float edge1 = radius + 0.1; // 外边缘
    float smoothEdge = 1.0 - smoothstep(edge0, edge1, dist);
    
    // 创建颜色
    vec3 color = vec3(smoothEdge);
    
    gl_FragColor = vec4(color, 1.0);
    
    // 尝试不同的效果：
    // 彩色平滑圆
    // vec3 circleColor = vec3(1.0, 0.5, 0.0); // 橙色
    // vec3 backgroundColor = vec3(0.0, 0.0, 0.2); // 深蓝色
    // vec3 finalColor = mix(backgroundColor, circleColor, smoothEdge);
    // gl_FragColor = vec4(finalColor, 1.0);
}