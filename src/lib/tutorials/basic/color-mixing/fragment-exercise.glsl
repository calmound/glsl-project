precision mediump float;

uniform vec2 u_resolution;

void main() {
    // 练习：创建颜色混合效果
    // 目标：从左到右由红色渐变到蓝色
    
    // 获取当前像素的归一化坐标
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 练习1：定义红色和蓝色
    // TODO: 填写红色/蓝色的 RGB 值
    vec3 redColor = vec3(1.0, 0.0, 0.0);
    vec3 blueColor = vec3(0.0, 0.0, 1.0);
    
    // 练习2：使用 mix 函数进行颜色混合
    // 提示：mix(a, b, t) 在 a 和 b 之间按 t 的比例混合
    // 当 t=0 时返回 a，当 t=1 时返回 b
    // TODO: 使用 uv.x 作为混合因子，从左到右渐变
    vec3 finalColor = mix(redColor, blueColor, 0.0);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
