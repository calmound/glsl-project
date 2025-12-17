#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){vec2 p=vUv-0.5;float d=length(p);float rings=fract(d*12.0);float m=step(0.5,rings);vec3 col=mix(vec3(0.06,0.07,0.1),vec3(0.2,0.85,1.0),m);gl_FragColor=vec4(col,1.0);}
