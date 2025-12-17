#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
void main(){vec2 p=vUv-0.5;float d=length(p);float ring=1.0-smoothstep(0.02,0.026,abs(d-0.28));float a=atan(p.y,p.x)+u_time;float t=(a+3.14159265)/6.2831853;vec3 c=mix(vec3(0.2,0.85,1.0),vec3(1.0,0.25,0.6),t);gl_FragColor=vec4(mix(vec3(0.06,0.07,0.1),c,ring),1.0);}
