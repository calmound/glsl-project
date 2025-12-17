#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float u_time;
float hash21(vec2 p){p=fract(p*vec2(123.34,345.45));p+=dot(p,p+34.345);return fract(p.x*p.y);}float valueNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);float a=hash21(i);float b=hash21(i+vec2(1,0));float c=hash21(i+vec2(0,1));float d=hash21(i+vec2(1,1));vec2 u=f*f*(3.0-2.0*f);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}float fbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<4;i++){v+=a*valueNoise(p);p*=2.0;a*=0.5;}return v;}void main(){float n=fbm(vUv*6.0);n=1.0-abs(n*2.0-1.0);gl_FragColor=vec4(vec3(n),1.0);}
