#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
void main(){float count=12.0;float x=fract(vUv.x*count+u_time*0.6);float m=step(0.5,x);vec3 c=mix(vec3(0.08,0.1,0.12),vec3(0.9,0.95,1.0),m);gl_FragColor=vec4(c,1.0);}
