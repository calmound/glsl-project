precision mediump float;

void main() {
    // 练习：绘制简单圆形
    // 目标：学习基础的距离函数和条件判断
    
    // 获取当前像素的归一化坐标 (0.0 到 1.0)
    vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
    
    // 练习1：将坐标原点移到屏幕中心
    // 提示：减去0.5使坐标范围变为[-0.5, 0.5]
    vec2 center = uv - vec2(/* 请填写中心坐标 */);
    
    // 练习2：计算当前像素到中心的距离
    // 提示：使用length()函数
    float distance = /* 请填写距离计算 */;
    
    // 练习3：定义圆的半径
    float radius = /* 请填写合适的半径值 */;
    
    // 练习4：创建圆形
    // 提示：当距离小于半径时为1.0，否则为0.0
    float circle = step(/* 请填写比较条件 */);
    
    // 练习5：设置颜色
    // 提示：圆内为白色，圆外为黑色
    vec3 color = vec3(/* 请填写颜色值 */);
    
    gl_FragColor = vec4(color, 1.0);
}