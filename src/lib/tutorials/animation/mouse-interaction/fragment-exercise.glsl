precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    // 练习：鼠标交互
    // 目标：创建响应鼠标位置的交互效果
    
    // 归一化坐标
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 练习1：获取归一化的鼠标坐标
    // 提示：将鼠标坐标除以分辨率
    // TODO: mouse = u_mouse / u_resolution
    vec2 mouse = u_mouse / u_resolution;
    
    // 练习2：计算当前像素到鼠标位置的距离
    // 提示：使用distance函数
    // TODO: distToMouse = distance(uv, mouse)
    float distToMouse = distance(uv, mouse);
    
    // 练习3：创建以鼠标为中心的圆形效果
    // 提示：使用smoothstep创建平滑边缘
    // TODO: 调整半径值（建议 0.15 - 0.3）
    float circle = 1.0 - smoothstep(0.0, 0.2, distToMouse);
    
    // 练习4：根据鼠标位置改变颜色
    // 提示：使用鼠标的x和y坐标作为颜色分量
    // TODO: mouseColor = vec3(mouse, 0.5)
    vec3 mouseColor = vec3(mouse, 0.5);
    
    // 练习5：添加时间动画
    // 提示：使用sin函数创建脉动效果
    // TODO: pulse = sin(u_time * speed) * 0.5 + 0.5
    float pulse = sin(u_time * 2.0) * 0.5 + 0.5;
    
    // 最终颜色混合
    vec3 finalColor = mouseColor * circle * pulse;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
