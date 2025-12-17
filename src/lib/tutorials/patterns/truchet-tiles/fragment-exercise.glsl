#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
float hash21(vec2 p){p=fract(p*vec2(123.34,345.45));p+=dot(p,p+34.345);return fract(p.x*p.y);}void main(){vec2 uv=vUv*6.0;vec2 i=floor(uv);vec2 f=fract(uv);float r=hash21(i);// TODO: if(r<0.5) f.x=1.0-f.x
float m=step(length(f-0.5),0.35);vec3 col=mix(vec3(0.05,0.06,0.08),vec3(1.0,0.85,0.25),m);gl_FragColor=vec4(col,1.0);}
