#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){float t=fract(vUv.x*5.0);gl_FragColor=vec4(vec3(t),1.0);}
