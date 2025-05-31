precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    // 设置一个纯红色
    // vec4(红, 绿, 蓝, 透明度)
    // 每个分量的值范围是 0.0 到 1.0
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    
    // 尝试修改这些值来改变颜色：
    // gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // 绿色
    // gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); // 蓝色
    // gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); // 黄色
    // gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0); // 灰色
}