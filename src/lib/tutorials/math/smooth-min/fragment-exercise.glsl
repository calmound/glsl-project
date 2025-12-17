#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
float smin(float a,float b,float k){float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);return mix(b,a,h)-k*h*(1.0-h);}void main(){vec2 p=vUv-0.5;float d1=length(p-vec2(-0.12,0.0))-0.18;float d2=length(p-vec2(0.12,0.0))-0.18;// TODO: d = smin(d1,d2,0.2)
float d=min(d1,d2);float m=1.0-smoothstep(0.0,0.01,d);gl_FragColor=vec4(vec3(m),1.0);}
