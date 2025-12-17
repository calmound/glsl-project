#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){vec3 a=vec3(0.1,0.15,0.25);vec3 b=vec3(0.2,0.85,1.0);float t=0.0; // TODO: vUv.y
vec3 c=mix(a,b,t);gl_FragColor=vec4(c,1.0);}
