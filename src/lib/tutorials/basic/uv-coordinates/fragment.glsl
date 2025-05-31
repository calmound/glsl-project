// UV坐标基础
// 教程ID: uv-coordinates

precision mediump float;

uniform vec2 u_resolution; // 画布尺寸
uniform float u_time; // 时间（秒）

void main() {
    // 标准化坐标 (0.0 - 1.0)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 将坐标从 [0,1] 映射到 [-1,1]
    vec2 ndc = uv * 2.0 - 1.0;
    
    // 棋盘格效果 - 通过对UV坐标进行分段
    float grid = step(0.1, fract(uv.x * 10.0)) * step(0.1, fract(uv.y * 10.0));
    
    // 创建UV坐标可视化效果
    vec3 color = vec3(0.0);
    
    // X轴为红色分量
    color.r = uv.x;
    
    // Y轴为绿色分量
    color.g = uv.y;
    
    // 为边缘添加参考线
    if (abs(uv.x - 0.5) < 0.002 || abs(uv.y - 0.5) < 0.002) {
        color = vec3(1.0, 1.0, 1.0); // 白色参考线
    }
    
    // 添加动画中心点标记
    float centerDist = length(ndc - vec2(sin(u_time * 0.5), cos(u_time * 0.5)) * 0.5);
    if (centerDist < 0.02) {
        color = vec3(1.0, 1.0, 0.0); // 黄色中心点
    }
    
    // 在UV网格上叠加棋盘格
    color = mix(color, vec3(grid), 0.2);
    
    gl_FragColor = vec4(color, 1.0);
}
