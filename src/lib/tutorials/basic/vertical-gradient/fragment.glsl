#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){vec3 a=vec3(0.1,0.15,0.25);vec3 b=vec3(0.2,0.85,1.0);gl_FragColor=vec4(mix(a,b,vUv.y),1.0);}
