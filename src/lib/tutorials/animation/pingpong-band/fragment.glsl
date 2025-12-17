#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
void main(){float x=sin(u_time)*0.5+0.5;float d=abs(vUv.x-x);float m=1.0-smoothstep(0.03,0.06,d);vec3 c=mix(vec3(0.05,0.06,0.08),vec3(1.0,0.85,0.25),m);gl_FragColor=vec4(c,1.0);}
