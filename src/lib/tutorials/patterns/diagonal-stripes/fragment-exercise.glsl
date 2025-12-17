#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){float c=14.0;// TODO: v=fract((vUv.x+vUv.y)*c)
float v=0.0;float m=step(0.5,v);vec3 col=mix(vec3(0.06,0.07,0.1),vec3(1.0,0.85,0.25),m);gl_FragColor=vec4(col,1.0);}
