// 基础渐变效果
// 教程ID: basic-gradients

precision mediump float;

uniform vec2 u_resolution; // 画布尺寸
uniform float u_time; // 时间（秒）

void main() {
    // 归一化坐标 (0.0 - 1.0)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    // TODO: 将蓝色通道改为 uv.y 以得到从下到上的渐变
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}
