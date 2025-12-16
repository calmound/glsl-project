precision mediump float;

uniform vec2 u_resolution;

void main() {
    // 练习：绘制一个简单的矩形
    // 目标：在屏幕中央绘制一个白色矩形，背景为黑色
    
    // 获取当前像素的归一化坐标 (0.0 到 1.0)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // 练习1：定义矩形的边界
    // 矩形应该在 x: 0.3-0.7, y: 0.4-0.6 的范围内
    // TODO: 按注释目标填写边界值
    float left = 0.3;
    float right = 0.7;
    float bottom = 0.4;
    float top = 0.6;
    
    // 练习2：判断当前像素是否在矩形内
    // 提示：使用逻辑运算符 && 来组合条件
    bool insideRect = (uv.x >= left && uv.x <= right) && 
                      (uv.y >= bottom && uv.y <= top);
    
    // 练习3：根据位置设置颜色
    // 矩形内为白色 (1.0, 1.0, 1.0)，矩形外为黑色 (0.0, 0.0, 0.0)
    vec3 color;
    if (insideRect) {
        // TODO: 填写白色 vec3(1.0)
        color = vec3(1.0);
    } else {
        // TODO: 填写黑色 vec3(0.0)
        color = vec3(0.0);
    }
    
    gl_FragColor = vec4(color, 1.0);
}
