precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

void main() {
    // 将坐标转换为 -1 到 1 的范围，中心为原点
    vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
    
    // 保持宽高比
    uv.x *= u_resolution.x / u_resolution.y;
    
    // 简单的分形：重复的圆形图案
    vec2 pos = uv;
    float pattern = 0.0;
    
    // 创建多层次的重复图案
    for (int i = 0; i < 4; i++) {
        // 缩放坐标
        pos *= 2.0;
        
        // 取小数部分，创建重复
        pos = fract(pos) - 0.5;
        
        // 计算到中心的距离
        float dist = length(pos);
        
        // 创建圆形图案
        float circle = 1.0 - smoothstep(0.1, 0.3, dist);
        
        // 累加图案，每层权重递减
        pattern += circle / pow(2.0, float(i + 1));
    }
    
    // 添加时间动画
    pattern += 0.1 * sin(u_time + length(uv) * 5.0);
    
    // 创建颜色
    vec3 color = vec3(pattern);
    
    // 彩色版本（注释掉上面的 color 赋值来使用）
    // vec3 color = vec3(
    //     pattern,
    //     pattern * 0.7,
    //     pattern * 0.5
    // );
    
    // 更复杂的颜色映射
    // vec3 color = vec3(
    //     0.5 + 0.5 * sin(pattern * 3.14159 + u_time),
    //     0.5 + 0.5 * sin(pattern * 3.14159 + u_time + 2.0),
    //     0.5 + 0.5 * sin(pattern * 3.14159 + u_time + 4.0)
    // );
    
    gl_FragColor = vec4(color, 1.0);
}