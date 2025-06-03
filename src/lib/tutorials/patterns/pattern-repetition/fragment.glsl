precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    // 图案重复 - 完整实现
    // 这是最终效果代码，展示如何创建重复的几何图案
    
    // 归一化坐标
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 创建重复网格
    float gridSize = 8.0;
    vec2 grid = uv * gridSize;
    vec2 gridId = floor(grid);
    vec2 gridUv = fract(grid);
    
    // 将每个网格单元的坐标居中
    vec2 centered = gridUv - vec2(0.5);
    
    // 为每个网格单元创建唯一的随机值
    float random = fract(sin(dot(gridId, vec2(12.9898, 78.233))) * 43758.5453);
    
    // 创建旋转动画
    float rotation = u_time * 0.5 + random * 6.28318;
    float cosR = cos(rotation);
    float sinR = sin(rotation);
    
    // 应用旋转变换
    vec2 rotated = vec2(
        centered.x * cosR - centered.y * sinR,
        centered.x * sinR + centered.y * cosR
    );
    
    // 创建多种图案
    // 图案1：圆形
    float circle = 1.0 - smoothstep(0.2, 0.25, length(rotated));
    
    // 图案2：方形
    vec2 square = abs(rotated);
    float squarePattern = 1.0 - smoothstep(0.15, 0.2, max(square.x, square.y));
    
    // 图案3：十字形
    float cross = min(
        1.0 - smoothstep(0.05, 0.1, abs(rotated.x)),
        1.0 - smoothstep(0.05, 0.1, abs(rotated.y))
    );
    cross = max(cross, min(
        1.0 - smoothstep(0.05, 0.1, abs(rotated.y)),
        1.0 - smoothstep(0.05, 0.1, abs(rotated.x))
    ));
    
    // 根据网格位置选择不同图案
    float patternType = mod(gridId.x + gridId.y, 3.0);
    float pattern;
    if (patternType < 1.0) {
        pattern = circle;
    } else if (patternType < 2.0) {
        pattern = squarePattern;
    } else {
        pattern = cross;
    }
    
    // 创建颜色变化
    vec3 color1 = vec3(1.0, 0.3, 0.5); // 粉红色
    vec3 color2 = vec3(0.3, 0.7, 1.0); // 蓝色
    vec3 color3 = vec3(0.9, 0.9, 0.2); // 黄色
    
    vec3 finalColor;
    if (patternType < 1.0) {
        finalColor = color1;
    } else if (patternType < 2.0) {
        finalColor = color2;
    } else {
        finalColor = color3;
    }
    
    finalColor *= pattern;
    
    gl_FragColor = vec4(finalColor, 1.0);
}