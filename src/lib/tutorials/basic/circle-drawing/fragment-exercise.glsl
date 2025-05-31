precision mediump float;

void main() {
    // 练习：绘制一个圆形
    // 目标：在屏幕中央绘制一个白色圆形，背景为黑色
    
    // 获取当前像素的归一化坐标 (0.0 到 1.0)
    vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
    
    // 练习1：将坐标系移动到屏幕中心
    // 提示：减去 0.5 可以将坐标范围从 [0,1] 变为 [-0.5, 0.5]
    vec2 center = uv - vec2(/* 请填写中心点坐标 */);
    
    // 练习2：计算当前像素到中心的距离
    // 提示：使用 length() 函数计算向量的长度
    float distance = /* 请填写距离计算公式 */;
    
    // 练习3：定义圆的半径
    float radius = 0.2;
    
    // 练习4：判断当前像素是否在圆内
    // 提示：如果距离小于半径，则在圆内
    bool insideCircle = distance < /* 请填写判断条件 */;
    
    // 练习5：根据位置设置颜色
    vec3 color;
    if (insideCircle) {
        color = vec3(/* 请填写圆内颜色 */);
    } else {
        color = vec3(/* 请填写圆外颜色 */);
    }
    
    gl_FragColor = vec4(color, 1.0);
}