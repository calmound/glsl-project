#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){float t=(vUv.x+vUv.y)*0.5;gl_FragColor=vec4(vec3(t),1.0);}
