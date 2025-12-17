#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){float d=abs(vUv.x-0.5);// TODO: m = 1.0 - smoothstep(0.0,0.25,d)
float m=0.0;gl_FragColor=vec4(vec3(m),1.0);}
