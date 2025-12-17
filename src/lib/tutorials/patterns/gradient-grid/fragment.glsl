#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){vec2 cell=floor(vUv*6.0)/6.0;vec3 col=vec3(cell,0.0);gl_FragColor=vec4(col,1.0);}
