#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){// TODO: 用 fract 做循环
float t=vUv.x;gl_FragColor=vec4(vec3(t),1.0);}
