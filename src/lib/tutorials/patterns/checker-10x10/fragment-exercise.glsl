#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){// TODO: g=floor(vUv*10.0); m=mod(g.x+g.y,2.0)
vec2 g=vec2(0.0);float m=0.0;vec3 col=mix(vec3(0.1),vec3(0.9),m);gl_FragColor=vec4(col,1.0);}
