#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}void main(){vec2 p=vUv-0.5;p=rot(u_time)*p;vec2 uv=p+0.5;vec3 c=vec3(uv,0.0);gl_FragColor=vec4(c,1.0);}
