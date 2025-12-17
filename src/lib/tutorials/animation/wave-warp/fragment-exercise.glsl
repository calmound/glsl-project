#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
void main(){vec2 uv=vUv;// TODO: uv.y += sin(uv.x*10.0+u_time)*0.04
vec3 c=mix(vec3(0.1,0.15,0.25),vec3(0.9,0.95,1.0),uv.y);gl_FragColor=vec4(c,1.0);}
