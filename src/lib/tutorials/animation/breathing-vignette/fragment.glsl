#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
void main(){vec2 p=vUv-0.5;float d=length(p);float strength=sin(u_time)*0.25+0.55;float v=1.0-smoothstep(strength-0.15,strength,d);vec3 c=mix(vec3(0.03,0.04,0.06),vec3(0.25,0.9,0.85),v);gl_FragColor=vec4(c,1.0);}
