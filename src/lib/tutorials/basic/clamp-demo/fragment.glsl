#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){float t=clamp(vUv.x*1.6-0.3,0.0,1.0);vec3 c=mix(vec3(0.1),vec3(0.2,0.85,1.0),t);gl_FragColor=vec4(c,1.0);}
