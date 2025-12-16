precision mediump float;

uniform vec2 u_resolution;

void main() {
    // 练习：UV坐标系统
    // 目标：理解和使用UV坐标系统
    
    // 练习1：获取片段坐标
    // 提示：gl_FragCoord.xy包含当前像素的屏幕坐标
    // TODO: 使用 gl_FragCoord.xy
    vec2 fragCoord = gl_FragCoord.xy;
    
    // 练习2：归一化坐标
    // 提示：除以分辨率将坐标范围转换为[0,1]
    // TODO: 使用 u_resolution
    vec2 uv = fragCoord / u_resolution;
    
    // 练习3：使用UV坐标作为颜色
    // 提示：uv.x可以作为红色通道，uv.y可以作为绿色通道
    // TODO: 将 uv 映射到颜色：vec3(uv, 0.0)
    vec3 uvColor = vec3(uv, 0.0);
    
    // 练习4：创建坐标网格
    // 提示：使用fract函数创建重复图案
    // TODO: 设定网格密度（如 10.0）
    float gridDensity = 10.0;
    vec2 grid = fract(uv * gridDensity);
    
    // 练习5：在网格中绘制线条
    // 提示：当坐标接近0或1时绘制线条
    float lineWidth = 0.05;
    float gridLines = step(1.0 - lineWidth, grid.x) + step(1.0 - lineWidth, grid.y);
    gridLines = min(gridLines, 1.0);
    
    // 练习6：组合UV颜色和网格
    // 提示：使用mix函数混合颜色和网格
    vec3 gridColor = vec3(1.0, 1.0, 1.0); // 白色网格线
    // TODO: 使用 mix(uvColor, gridColor, gridLines) 混合
    vec3 finalColor = uvColor;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
