precision mediump float;

uniform float u_time;

void main() {
    // 练习：坐标变换
    // 目标：创建旋转和缩放的图案
    
    // 获取当前像素的归一化坐标
    vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
    
    // 练习1：将坐标原点移到屏幕中心
    vec2 centered = uv - vec2(/* 请填写中心点坐标 */);
    
    // 练习2：创建旋转矩阵
    // 旋转角度随时间变化
    float angle = u_time;
    float cosA = cos(angle);
    float sinA = sin(angle);
    
    // 2D旋转矩阵的应用
    vec2 rotated = vec2(
        centered.x * cosA - centered.y * /* 请填写sin值 */,
        centered.x * sinA + centered.y * /* 请填写cos值 */
    );
    
    // 练习3：应用缩放变换
    // 缩放因子随时间变化
    float scale = 1.0 + sin(u_time * 2.0) * 0.5;
    vec2 scaled = rotated * /* 请填写缩放因子 */;
    
    // 练习4：创建重复图案
    // 使用 fract 函数创建重复效果
    vec2 repeated = fract(scaled * 3.0);
    
    // 练习5：在每个重复单元中绘制图案
    // 将重复坐标重新居中
    vec2 cellCenter = repeated - vec2(0.5);
    
    // 计算到单元中心的距离
    float distance = length(/* 请填写坐标变量 */);
    
    // 练习6：创建图案
    // 使用距离创建圆形图案
    float pattern = smoothstep(0.3, 0.25, distance);
    
    // 练习7：添加颜色
    // 根据原始坐标和变换后的坐标创建颜色
    vec3 color = vec3(
        pattern * (sin(u_time + uv.x * 10.0) * 0.5 + 0.5),
        pattern * (cos(u_time + uv.y * 10.0) * 0.5 + 0.5),
        pattern * /* 请填写蓝色分量 */
    );
    
    gl_FragColor = vec4(color, 1.0);
}