#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){vec2 p=vUv-0.5;vec3 c=vec3(0.0); // TODO
gl_FragColor=vec4(c,1.0);}
