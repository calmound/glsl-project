// 卡通渲染（练习版）
// 教程ID: toon-shading

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

vec3 toonShading(vec3 normal, vec3 lightDir, vec3 objectColor) {
    float intensity = dot(normal, lightDir);

    // TODO: 调整分级阈值/层数，观察卡通分段效果
    if (intensity > 0.75) return objectColor * 1.0;
    if (intensity > 0.45) return objectColor * 0.7;
    if (intensity > 0.2) return objectColor * 0.45;
    return objectColor * 0.25;
}

float outline(vec3 normal, vec3 viewDir, float thickness) {
    float edge = 1.0 - dot(normal, viewDir);
    return smoothstep(0.0, thickness, edge);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;

    vec3 ro = vec3(0.0, 0.0, 2.0);
    vec3 rd = normalize(vec3(uv, -1.0));

    float radius = 0.8;
    // TODO: 调整轮廓线 thickness（建议 0.3 - 0.6）
    float outlineThickness = 0.45 + sin(u_time) * 0.08;

    vec3 lightDir = normalize(vec3(cos(u_time * 0.5), sin(u_time * 0.5), 0.5));

    float t = castRay(ro, rd, radius);

    vec3 color = vec3(0.1);
    if (t < 5.0) {
        vec3 p = ro + rd * t;
        vec3 normal = calcNormal(p, radius);
        vec3 viewDir = normalize(ro - p);

        vec3 objectColor = vec3(0.4, 0.7, 0.9);
        color = toonShading(normal, lightDir, objectColor);

        float edgeFactor = outline(normal, viewDir, outlineThickness);
        color = mix(color, vec3(0.0), edgeFactor * 0.8);
    }

    gl_FragColor = vec4(color, 1.0);
}

