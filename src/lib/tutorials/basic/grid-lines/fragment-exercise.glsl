#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){float density=10.0;vec2 g=fract(vUv*density);float lw=0.05;float line=0.0; // TODO: 用 step 组合
vec3 c=mix(vec3(0.1,0.15,0.25),vec3(1.0),line);gl_FragColor=vec4(c,1.0);}
