#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){vec2 g=floor(vUv*10.0);float m=mod(g.x+g.y,2.0);vec3 col=mix(vec3(0.1),vec3(0.9),m);gl_FragColor=vec4(col,1.0);}
