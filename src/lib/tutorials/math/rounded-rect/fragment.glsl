#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
float sdRoundBox(vec2 p, vec2 b, float r){vec2 d=abs(p)-b;return length(max(d,0.0))-r+min(max(d.x,d.y),0.0);}void main(){vec2 p=vUv-0.5;float d=sdRoundBox(p,vec2(0.22,0.14),0.05);float m=1.0-smoothstep(0.0,0.01,d);gl_FragColor=vec4(vec3(m),1.0);}
