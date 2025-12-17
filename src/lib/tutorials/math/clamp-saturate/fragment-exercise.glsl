#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){// TODO: 用 clamp 得到 t
float t=0.0;gl_FragColor=vec4(vec3(t),1.0);}
