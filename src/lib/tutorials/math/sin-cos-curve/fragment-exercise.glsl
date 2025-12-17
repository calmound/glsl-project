#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
void main(){// TODO: 计算曲线 y
float y=0.5;float d=abs(vUv.y-y);float m=1.0-smoothstep(0.0,0.01,d);vec3 c=mix(vec3(0.05),vec3(0.2,0.85,1.0),m);gl_FragColor=vec4(c,1.0);}
