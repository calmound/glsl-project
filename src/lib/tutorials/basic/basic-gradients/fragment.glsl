// 基础渐变效果
// 教程ID: basic-gradients

precision mediump float;

uniform vec2 u_resolution; // 画布尺寸
uniform float u_time; // 时间（秒）

void main() {
    // 归一化坐标 (0.0 - 1.0)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 线性渐变 - 垂直方向（从下到上）
    // 使用uv.y直接作为颜色
    vec3 color1 = vec3(0.0, 0.0, uv.y);
    
    // 线性渐变 - 水平方向（从左到右）
    // 使用uv.x作为颜色的红色通道
    vec3 color2 = vec3(uv.x, 0.0, 0.2);
    
    // 径向渐变
    // 计算到中心点的距离
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(uv, center);
    vec3 color3 = vec3(dist, 0.0, 0.5);
    
    // 动态混合渐变
    float mixFactor = abs(sin(u_time * 0.5));
    vec3 finalColor = mix(color1, mix(color2, color3, mixFactor), mixFactor);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
