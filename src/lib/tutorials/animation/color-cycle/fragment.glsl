#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
void main(){vec3 c=vec3(sin(u_time)*0.5+0.5,sin(u_time+2.094)*0.5+0.5,sin(u_time+4.188)*0.5+0.5);gl_FragColor=vec4(c,1.0);}
