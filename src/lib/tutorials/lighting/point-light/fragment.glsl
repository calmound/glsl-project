#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
float sphereSDF(vec2 p, float r){return length(p)-r;}vec3 estimateNormal(vec2 p){float e=0.001;float d=sphereSDF(p,0.32);vec2 n=vec2(sphereSDF(p+vec2(e,0),0.32)-d,sphereSDF(p+vec2(0,e),0.32)-d);return normalize(vec3(n,0.35));}void main(){vec2 p=vUv-0.5;float d=sphereSDF(p,0.32);vec3 bg=vec3(0.05,0.06,0.08);if(d>0.0){gl_FragColor=vec4(bg,1.0);return;}vec3 n=estimateNormal(p);vec3 lightPos=vec3(0.3,0.4,0.6);vec3 pos=vec3(p,0.0);vec3 l=normalize(lightPos-pos);float att=1.0/(1.0+3.0*dot(lightPos-pos,lightPos-pos));float diff=max(dot(n,l),0.0)*att;vec3 baseCol=vec3(0.25,0.9,0.85);vec3 col=baseCol*(0.1+diff*2.0);gl_FragColor=vec4(mix(bg,col,1.0),1.0);}
