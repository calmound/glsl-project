#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){vec2 p=vUv-0.5;// TODO: 计算角度并归一化
float t=0.0;gl_FragColor=vec4(vec3(t),1.0);}
