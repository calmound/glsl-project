#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){float t=clamp(vUv.x*1.8-0.4,0.0,1.0);gl_FragColor=vec4(vec3(t),1.0);}
