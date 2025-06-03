precision mediump float;

uniform float u_time;

void main() {
    // 练习：创建时间动画效果
    // 目标：创建一个会动的彩色圆形
    
    // 获取当前像素的归一化坐标
    vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
    
    // 练习1：创建动态的圆心位置
    // 让圆心在屏幕中央做圆周运动
    vec2 center = vec2(
        0.5 + sin(u_time) * /* 请填写运动半径 */,
        0.5 + cos(u_time) * /* 请填写运动半径 */
    );
    
    // 练习2：计算到动态圆心的距离
    vec2 pos = uv - center;
    float distance = /* 请填写距离计算 */;
    
    // 练习3：创建动态半径
    // 让圆的大小随时间变化
    float radius = 0.1 + sin(u_time * 2.0) * /* 请填写半径变化幅度 */;
    
    // 练习4：创建动态颜色
    // 让颜色随时间变化
    vec3 dynamicColor = vec3(
        sin(u_time) * 0.5 + 0.5,
        cos(u_time * 1.5) * 0.5 + 0.5,
        sin(u_time * 0.8) * 0.5 + 0.5
    );
    
    // 练习5：使用 smoothstep 创建平滑边缘
    // smoothstep(edge0, edge1, x) 在 edge0 和 edge1 之间创建平滑过渡
    float circle = smoothstep(
        radius + 0.02,  // 外边缘
        radius - 0.02,  // 内边缘
        /* 请填写距离变量 */
    );
    
    // 练习6：混合背景和圆形颜色
    vec3 backgroundColor = vec3(0.1, 0.1, 0.2);
    vec3 finalColor = mix(
        backgroundColor,
        /* 请填写圆形颜色 */,
        circle
    );
    
    gl_FragColor = vec4(finalColor, 1.0);
}