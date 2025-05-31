precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    // 定义两种颜色
    vec3 color1 = vec3(1.0, 0.0, 0.0); // 红色
    vec3 color2 = vec3(0.0, 0.0, 1.0); // 蓝色
    
    // 创建一个在 0.0 到 1.0 之间变化的混合因子
    float mixFactor = (sin(u_time) + 1.0) * 0.5;
    
    // 使用 mix 函数混合两种颜色
    // mix(a, b, t) 当 t=0 时返回 a，当 t=1 时返回 b
    vec3 finalColor = mix(color1, color2, mixFactor);
    
    gl_FragColor = vec4(finalColor, 1.0);
    
    // 其他混合示例：
    // 固定混合比例（50% 红色 + 50% 蓝色 = 紫色）
    // vec3 purple = mix(color1, color2, 0.5);
    // gl_FragColor = vec4(purple, 1.0);
    
    // 基于位置的混合
    // vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    // vec3 gradientColor = mix(color1, color2, uv.x);
    // gl_FragColor = vec4(gradientColor, 1.0);
}