#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){float c=12.0;float x=fract(vUv.x*c);float m=step(0.5,x);vec3 col=mix(vec3(0.08,0.1,0.12),vec3(0.9,0.95,1.0),m);gl_FragColor=vec4(col,1.0);}
