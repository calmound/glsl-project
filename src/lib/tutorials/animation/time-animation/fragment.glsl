precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    // 使用 sin 函数创建在 -1.0 到 1.0 之间振荡的值
    float oscillation = sin(u_time);
    
    // 将振荡值转换为 0.0 到 1.0 的范围
    // sin 函数返回 -1 到 1，我们需要 0 到 1
    float normalizedOscillation = (oscillation + 1.0) * 0.5;
    
    // 使用这个值作为红色分量，创建呼吸效果
    gl_FragColor = vec4(normalizedOscillation, 0.0, 0.0, 1.0);
    
    // 尝试其他动画效果：
    // gl_FragColor = vec4(0.0, normalizedOscillation, 0.0, 1.0); // 绿色呼吸
    // gl_FragColor = vec4(normalizedOscillation, normalizedOscillation, 0.0, 1.0); // 黄色呼吸
    
    // 更快的动画（乘以2让时间流逝更快）：
    // float fastOscillation = (sin(u_time * 2.0) + 1.0) * 0.5;
    // gl_FragColor = vec4(fastOscillation, 0.0, 0.0, 1.0);
}