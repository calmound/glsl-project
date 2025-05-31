precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
    // 将坐标标准化到 0.0 到 1.0 范围
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 将鼠标坐标也标准化到相同范围
    vec2 mouse = u_mouse.xy / u_resolution.xy;
    
    // 计算当前像素到鼠标位置的距离
    float dist = distance(uv, mouse);
    
    // 创建一个跟随鼠标的圆形光晕
    float radius = 0.2;
    float glow = 1.0 - smoothstep(0.0, radius, dist);
    
    // 基于距离创建颜色渐变
    vec3 color = vec3(0.0);
    
    // 方法1：简单的光晕效果
    color = vec3(glow, glow * 0.5, glow * 0.8);
    
    // 方法2：彩色距离效果（注释掉上面的 color 赋值来使用）
    // float normalizedDist = dist / 0.5; // 归一化距离
    // color = vec3(
    //     1.0 - normalizedDist,           // 红色随距离减少
    //     0.5 + 0.5 * sin(dist * 10.0),   // 绿色波纹
    //     normalizedDist                  // 蓝色随距离增加
    // );
    
    // 方法3：脉冲效果（注释掉上面的 color 赋值来使用）
    // float pulse = 0.5 + 0.5 * sin(u_time * 3.0);
    // float dynamicRadius = radius * pulse;
    // float dynamicGlow = 1.0 - smoothstep(0.0, dynamicRadius, dist);
    // color = vec3(dynamicGlow, dynamicGlow * 0.7, dynamicGlow * 0.3);
    
    // 添加背景色
    vec3 bgColor = vec3(0.05, 0.05, 0.1); // 深色背景
    color = mix(bgColor, color, glow);
    
    gl_FragColor = vec4(color, 1.0);
}