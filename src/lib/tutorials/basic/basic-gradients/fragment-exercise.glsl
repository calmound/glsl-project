precision mediump float;
// 教程ID: basic-gradients

uniform vec2 u_resolution; // 画布尺寸
uniform float u_time; // 时间（秒）

void main() {
    // 归一化坐标 (0.0 - 1.0)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  
    gl_FragColor = vec4(1.,1.,1., 1.0);
}