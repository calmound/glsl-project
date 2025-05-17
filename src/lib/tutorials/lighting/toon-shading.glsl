// 卡通渲染
// 教程ID: toon-shading

precision mediump float;

uniform vec2 u_resolution; // 画布尺寸
uniform float u_time; // 时间（秒）

// 球体SDF（有符号距离场）
float sphereSDF(vec3 p, float radius) {
    return length(p) - radius;
}

// 计算法线
vec3 calcNormal(vec3 p, float radius) {
    float eps = 0.001;
    vec3 n;
    n.x = sphereSDF(vec3(p.x + eps, p.y, p.z), radius) - sphereSDF(vec3(p.x - eps, p.y, p.z), radius);
    n.y = sphereSDF(vec3(p.x, p.y + eps, p.z), radius) - sphereSDF(vec3(p.x, p.y - eps, p.z), radius);
    n.z = sphereSDF(vec3(p.x, p.y, p.z + eps), radius) - sphereSDF(vec3(p.x, p.y, p.z - eps), radius);
    return normalize(n);
}

// 基本光线投射
float castRay(vec3 ro, vec3 rd, float radius) {
    float t = 0.0;
    for(int i = 0; i < 64; i ++ ) {
        vec3 p = ro + rd * t;
        float h = sphereSDF(p, radius);
        if (h < 0.001)break;
        t += h;
        if (t > 5.0)break;
    }
    return t;
}

// 卡通着色
vec3 toonShading(vec3 normal, vec3 lightDir, vec3 objectColor) {
    float intensity = dot(normal, lightDir);
    
    // 根据光照强度分几个级别
    vec3 color;
    if (intensity > 0.9) {
        color = objectColor * 1.0;
    } else if (intensity > 0.6) {
        color = objectColor * 0.8;
    } else if (intensity > 0.3) {
        color = objectColor * 0.6;
    } else if (intensity > 0.1) {
        color = objectColor * 0.4;
    } else {
        color = objectColor * 0.2;
    }
    
    return color;
}

// 添加轮廓线
float outline(vec3 normal, vec3 viewDir, float thickness) {
    float edge = dot(normal, viewDir);
    edge = 1.0 - edge;
    return smoothstep(0.0, thickness, edge);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv * 2.0 - 1.0; // 将uv映射到[-1, 1]
    uv.x *= u_resolution.x / u_resolution.y; // 宽高比校正
    
    // 摄像机与光源设置
    vec3 ro = vec3(0.0, 0.0, 2.0); // 射线原点（摄像机位置）
    vec3 rd = normalize(vec3(uv, - 1.0)); // 射线方向
    
    // 球体参数
    float radius = 0.8;
    float outlineThickness = 0.4 + sin(u_time) * 0.1; // 轮廓线厚度（带动画）
    
    // 光源方向（动态）
    vec3 lightDir = normalize(vec3(cos(u_time * 0.5), sin(u_time * 0.5), 0.5));
    
    // 光线投射
    float t = castRay(ro, rd, radius);
    
    vec3 color = vec3(0.1); // 背景色
    
    // 如果光线击中物体
    if (t < 5.0) {
        vec3 p = ro + rd * t; // 交点位置
        vec3 normal = calcNormal(p, radius); // 法线方向
        vec3 viewDir = normalize(ro - p); // 视线方向
        
        // 物体基础颜色
        vec3 objectColor = vec3(0.4, 0.7, 0.9);
        
        // 使用卡通着色
        color = toonShading(normal, lightDir, objectColor);
        
        // 添加轮廓线
        float edgeFactor = outline(normal, viewDir, outlineThickness);
        color = mix(color, vec3(0.0), edgeFactor * 0.8);
        
        // 添加高光点（简化的卡通高光）
        float specular = max(0.0, dot(reflect(-lightDir, normal), viewDir));
        specular = pow(specular, 10.0);
        specular = step(0.85, specular);
        color += specular * 0.5;
    }
    
    gl_FragColor = vec4(color, 1.0);
}
