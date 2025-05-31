precision mediump float;

void main() {
    // 练习：UV坐标系统
    // 目标：理解和使用UV坐标系统
    
    // 练习1：获取片段坐标
    // 提示：gl_FragCoord.xy包含当前像素的屏幕坐标
    vec2 fragCoord = /* 请填写片段坐标 */;
    
    // 练习2：归一化坐标
    // 提示：除以分辨率将坐标范围转换为[0,1]
    vec2 uv = fragCoord / vec2(/* 请填写分辨率 */);
    
    // 练习3：使用UV坐标作为颜色
    // 提示：uv.x可以作为红色通道，uv.y可以作为绿色通道
    vec3 uvColor = vec3(/* 请填写UV颜色映射 */);
    
    // 练习4：创建坐标网格
    // 提示：使用fract函数创建重复图案
    vec2 grid = fract(uv * /* 请填写网格密度 */);
    
    // 练习5：在网格中绘制线条
    // 提示：当坐标接近0或1时绘制线条
    float lineWidth = 0.05;
    float gridLines = step(1.0 - lineWidth, grid.x) + step(1.0 - lineWidth, grid.y);
    gridLines = min(gridLines, 1.0);
    
    // 练习6：组合UV颜色和网格
    // 提示：使用mix函数混合颜色和网格
    vec3 gridColor = vec3(1.0, 1.0, 1.0); // 白色网格线
    vec3 finalColor = mix(/* 请填写颜色混合 */);
    
    gl_FragColor = vec4(finalColor, 1.0);
}