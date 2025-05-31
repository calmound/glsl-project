// Phong光照模型
// 教程ID: phong-lighting

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

// Phong光照模型计算
vec3 phongLighting(vec3 p, vec3 normal, vec3 viewDir, vec3 lightPos, vec3 objectColor) {
    // 环境光
    float ambientStrength = 0.2;
    vec3 ambient = ambientStrength * vec3(1.0);
    
    // 漫反射
    vec3 lightDir = normalize(lightPos - p);
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * vec3(1.0);
    
    // 镜面反射
    float specularStrength = 1.0;
    float shininess = 32.0;
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = specularStrength * spec * vec3(1.0);
    
    // 合并光照效果
    return (ambient + diffuse + specular) * objectColor;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv * 2.0 - 1.0; // 将uv映射到[-1, 1]
    uv.x *= u_resolution.x / u_resolution.y; // 宽高比校正
    
    // 摄像机与光源设置
    vec3 ro = vec3(0.0, 0.0, 2.0); // 射线原点（摄像机位置）
    vec3 rd = normalize(vec3(uv, - 1.0)); // 射线方向
    
    // 移动光源位置
    vec3 lightPos = vec3(cos(u_time) * 2.0, sin(u_time) * 2.0, 1.0);
    
    // 球体参数
    float radius = 0.8;
    
    // 光线投射
    float t = castRay(ro, rd, radius);
    
    vec3 color = vec3(0.1); // 背景色
    
    // 如果光线击中物体
    if (t < 5.0) {
        vec3 p = ro + rd * t; // 交点位置
        vec3 normal = calcNormal(p, radius); // 法线方向
        vec3 viewDir = normalize(ro - p); // 视线方向
        
        // 物体颜色
        vec3 objectColor = vec3(0.5, 0.2, 0.7);
        
        // 使用Phong光照模型
        color = phongLighting(p, normal, viewDir, lightPos, objectColor);
    }
    
    // 显示光源位置
    float lightSize = 0.02;
    vec3 lightPosScreen = vec3((lightPos.xy / lightPos.z) * 0.5 + 0.5, 0.0);
    lightPosScreen.x = lightPosScreen.x * 2.0 - 1.0;
    lightPosScreen.x *= u_resolution.x / u_resolution.y;
    if (length(uv - lightPosScreen.xy) < lightSize) {
        color = vec3(1.0, 1.0, 0.5);
    }
    
    gl_FragColor = vec4(color, 1.0);
}
