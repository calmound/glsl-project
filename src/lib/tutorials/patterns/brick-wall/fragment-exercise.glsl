#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){vec2 uv=vUv*8.0;// TODO: 每隔一行偏移 0.5
vec2 f=fract(uv);float mortar=step(0.95,f.x)+step(0.95,f.y);mortar=min(mortar,1.0);vec3 brick=vec3(0.75,0.25,0.2);vec3 col=mix(brick,vec3(0.05),mortar);gl_FragColor=vec4(col,1.0);}
