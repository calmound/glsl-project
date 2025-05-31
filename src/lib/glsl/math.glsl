// 数学工具函数
#pragma glslify: export(rotate2d)
#pragma glslify: export(smoothMin)
#pragma glslify: export(remap)
#pragma glslify: export(easeInOut)

// 2D 旋转矩阵
mat2 rotate2d(float angle) {
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
}

// 平滑最小值
float smoothMin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

// 重映射函数
float remap(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

// 缓动函数
float easeInOut(float t) {
    return t * t * (3.0 - 2.0 * t);
}

// 距离场函数
float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}