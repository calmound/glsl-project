#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
void main(){// TODO: 用 sin(u_time) 构造 RGB 循环
vec3 c=vec3(0.0);gl_FragColor=vec4(c,1.0);}
