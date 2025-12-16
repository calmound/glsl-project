precision mediump float;

uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    vec3 color1 = vec3(1.0, 0.0, 0.0); // 红色
    vec3 color2 = vec3(0.0, 0.0, 1.0); // 蓝色

    vec3 finalColor = mix(color1, color2, uv.x);

    gl_FragColor = vec4(finalColor, 1.0);
}
