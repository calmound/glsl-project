precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    // 渐变效果 - 完整实现
    // 这是最终效果代码，展示多种渐变效果的组合
    
    // 归一化坐标 (0.0 - 1.0)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 线性渐变 - 对角线方向
    vec3 linearGrad = vec3(uv.x + uv.y) * 0.5;
    
    // 径向渐变 - 从中心向外
    vec2 center = vec2(0.5, 0.5);
    float radialDist = distance(uv, center);
    vec3 radialGrad = vec3(1.0 - radialDist * 2.0);
    
    // 角度渐变
    vec2 centered = uv - center;
    float angle = atan(centered.y, centered.x);
    float normalizedAngle = (angle + 3.14159) / (2.0 * 3.14159);
    vec3 angularGrad = vec3(normalizedAngle, 1.0 - normalizedAngle, 0.5);
    
    // 波浪渐变
    float wave = sin(uv.x * 10.0 + u_time * 2.0) * 0.5 + 0.5;
    vec3 waveGrad = vec3(wave, uv.y, 1.0 - wave);
    
    // 动态混合多种渐变
    float mixFactor1 = sin(u_time * 0.5) * 0.5 + 0.5;
    float mixFactor2 = cos(u_time * 0.3) * 0.5 + 0.5;
    
    vec3 blend1 = mix(linearGrad, radialGrad, mixFactor1);
    vec3 blend2 = mix(angularGrad, waveGrad, mixFactor2);
    vec3 finalColor = mix(blend1, blend2, sin(u_time * 0.7) * 0.5 + 0.5);
    
    // 增强对比度
    finalColor = smoothstep(0.0, 1.0, finalColor);
    
    gl_FragColor = vec4(finalColor, 1.0);
}