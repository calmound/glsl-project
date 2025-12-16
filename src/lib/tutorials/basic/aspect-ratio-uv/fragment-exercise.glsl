#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform vec2 u_resolution;

void main() {
    vec2 uv = vUv;

    // TODO: 用 u_resolution 计算纵横比（aspect = u_resolution.x / u_resolution.y）
    // 提示：不修正时，在非正方形画布上圆可能看起来像椭圆
    float aspect = 1.0;

    vec2 p = uv - 0.5;
    p.x *= aspect;

    // 目标：绘制一个带平滑边缘的圆
    float d = length(p);
    float r = 0.25;
    float aa = 0.006;
    float mask = 1.0 - smoothstep(r, r + aa, d);

    vec3 bg = vec3(0.05, 0.06, 0.08);
    vec3 fg = vec3(0.2, 0.85, 1.0);
    vec3 color = mix(bg, fg, mask);

    gl_FragColor = vec4(color, 1.0);
}

