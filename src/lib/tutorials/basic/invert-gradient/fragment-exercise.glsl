#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){float t=0.0; // TODO: 1.0 - vUv.x
gl_FragColor=vec4(vec3(t),1.0);}
