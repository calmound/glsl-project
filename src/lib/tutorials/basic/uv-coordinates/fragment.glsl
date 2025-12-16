// UV坐标基础
// 教程ID: uv-coordinates

precision mediump float;

uniform vec2 u_resolution; // 画布尺寸

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(uv, 0.0);
    gl_FragColor = vec4(color, 1.0);
}
