#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
void main(){vec2 center=vec2(0.5);float r=0.25;// TODO: 计算 pos
vec2 pos=center;float d=distance(vUv,pos);float dot=1.0-smoothstep(0.02,0.025,d);vec3 c=mix(vec3(0.05,0.06,0.08),vec3(0.2,0.85,1.0),dot);gl_FragColor=vec4(c,1.0);}
