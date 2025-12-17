#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
void main(){float density=10.0;vec2 g=fract(vUv*density);float lw=0.05;float line=step(1.0-lw,g.x)+step(1.0-lw,g.y);line=min(line,1.0);vec3 c=mix(vec3(0.1,0.15,0.25),vec3(1.0),line);gl_FragColor=vec4(c,1.0);}
