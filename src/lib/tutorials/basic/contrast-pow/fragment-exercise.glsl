#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){// TODO: 用 pow
float t=0.0;vec3 c=mix(vec3(0.1,0.15,0.25),vec3(1.0,0.85,0.25),t);gl_FragColor=vec4(c,1.0);}
