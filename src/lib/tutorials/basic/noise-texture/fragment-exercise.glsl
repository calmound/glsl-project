precision mediump float;

uniform float u_time;

void main() {
    // 练习：噪声纹理
    // 目标：创建伪随机噪声纹理
    
    // 获取当前像素的归一化坐标
    vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
    
    // 练习1：实现伪随机函数
    // 这个函数将输入值转换为看似随机的输出
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * /* 请填写大数值 */);
    }
    
    // 练习2：实现噪声函数
    float noise(vec2 st) {
        // 获取整数和小数部分
        vec2 i = floor(st);
        vec2 f = fract(st);
        
        // 计算四个角的随机值
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(/* 请填写右上角坐标 */));
        
        // 使用 smoothstep 进行平滑插值
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        // 双线性插值
        return mix(
            mix(a, b, u.x),
            mix(c, d, u.x),
            /* 请填写 y 方向插值因子 */
        );
    }
    
    // 练习3：创建基础噪声
    // 缩放坐标以控制噪声的频率
    float scale = 8.0;
    vec2 scaledUV = uv * /* 请填写缩放因子 */;
    
    // 添加时间动画
    scaledUV += u_time * 0.1;
    
    // 生成基础噪声
    float baseNoise = noise(/* 请填写缩放后的坐标 */);
    
    // 练习4：创建分形噪声（多层噪声叠加）
    float fractalNoise = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    // 叠加多层不同频率的噪声
    for (int i = 0; i < 4; i++) {
        fractalNoise += noise(scaledUV * frequency) * /* 请填写振幅 */;
        frequency *= 2.0;
        amplitude *= /* 请填写衰减因子 */;
    }
    
    // 练习5：创建不同类型的噪声效果
    
    // 湍流噪声（取绝对值）
    float turbulence = abs(fractalNoise * 2.0 - 1.0);
    
    // 脊状噪声
    float ridge = 1.0 - abs(fractalNoise * 2.0 - 1.0);
    
    // 练习6：根据时间在不同噪声间切换
    float switchFactor = sin(u_time * 0.3) * 0.5 + 0.5;
    float finalNoise = mix(
        mix(baseNoise, fractalNoise, 0.7),
        mix(turbulence, ridge, 0.5),
        /* 请填写切换因子 */
    );
    
    // 练习7：将噪声转换为颜色
    // 创建基于噪声的颜色映射
    vec3 color1 = vec3(0.2, 0.3, 0.8); // 深蓝色
    vec3 color2 = vec3(0.8, 0.9, 1.0); // 浅蓝色
    vec3 color3 = vec3(1.0, 1.0, 1.0); // 白色
    
    vec3 finalColor;
    if (finalNoise < 0.4) {
        finalColor = mix(color1, color2, finalNoise / 0.4);
    } else {
        finalColor = mix(
            color2,
            color3,
            /* 请填写混合因子 */
        );
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
}