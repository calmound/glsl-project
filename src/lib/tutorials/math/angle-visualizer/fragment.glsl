#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){vec2 p=vUv-0.5;float a=atan(p.y,p.x);float t=(a+3.14159265)/6.2831853;gl_FragColor=vec4(vec3(t),1.0);}
