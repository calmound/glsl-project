#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){float d=abs(vUv.y-0.5);float band=0.0; // TODO
vec3 c=mix(vec3(0.05,0.06,0.08),vec3(1.0,0.85,0.25),band);gl_FragColor=vec4(c,1.0);}
