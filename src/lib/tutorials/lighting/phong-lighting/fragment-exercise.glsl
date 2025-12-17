// Phong光照模型（练习版）
// 教程ID: phong-lighting

precision mediump float;

uniform vec2 u_resolution; // 画布尺寸
uniform float u_time; // 时间（秒）

float sphereSDF(vec3 p, float radius) {
    return length(p) - radius;
}

vec3 calcNormal(vec3 p, float radius) {
    float eps = 0.001;
    vec3 n;
    n.x = sphereSDF(vec3(p.x + eps, p.y, p.z), radius) - sphereSDF(vec3(p.x - eps, p.y, p.z), radius);
    n.y = sphereSDF(vec3(p.x, p.y + eps, p.z), radius) - sphereSDF(vec3(p.x, p.y - eps, p.z), radius);
    n.z = sphereSDF(vec3(p.x, p.y, p.z + eps), radius) - sphereSDF(vec3(p.x, p.y, p.z - eps), radius);
    return normalize(n);
}

float castRay(vec3 ro, vec3 rd, float radius) {
    float t = 0.0;
    for (int i = 0; i < 64; i++) {
        vec3 p = ro + rd * t;
        float h = sphereSDF(p, radius);
        if (h < 0.001) break;
        t += h;
        if (t > 5.0) break;
    }
    return t;
}

vec3 phongLighting(vec3 p, vec3 normal, vec3 viewDir, vec3 lightPos, vec3 objectColor) {
    float ambientStrength = 0.2;
    vec3 ambient = ambientStrength * vec3(1.0);

    vec3 lightDir = normalize(lightPos - p);
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * vec3(1.0);

    float specularStrength = 1.0;
    // TODO: 调整 shininess（越大高光越小越锐利）
    float shininess = 32.0;
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = specularStrength * spec * vec3(1.0);

    return (ambient + diffuse + specular) * objectColor;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;

    vec3 ro = vec3(0.0, 0.0, 2.0);
    vec3 rd = normalize(vec3(uv, -1.0));

    vec3 lightPos = vec3(cos(u_time) * 2.0, sin(u_time) * 2.0, 1.0);
    float radius = 0.8;

    float t = castRay(ro, rd, radius);

    vec3 color = vec3(0.1);
    if (t < 5.0) {
        vec3 p = ro + rd * t;
        vec3 normal = calcNormal(p, radius);
        vec3 viewDir = normalize(ro - p);
        vec3 objectColor = vec3(0.5, 0.2, 0.7);

        // TODO: 观察 shininess 改变后的高光差异
        color = phongLighting(p, normal, viewDir, lightPos, objectColor);
    }

    gl_FragColor = vec4(color, 1.0);
}

