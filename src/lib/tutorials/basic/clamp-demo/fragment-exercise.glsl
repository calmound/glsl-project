#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){// TODO: 用 clamp
float t=0.0;vec3 c=mix(vec3(0.1),vec3(0.2,0.85,1.0),t);gl_FragColor=vec4(c,1.0);}
