uniform sampler2D diffuse;
uniform vec2 resolution;
#ifdef SHOW_MAP
varying vec2 vUv;
uniform sampler2D map;
uniform float angle;
uniform vec2 offset;
uniform vec2 curve;
vec2 rotate2d(vec2 param1, float param2){
    float param4 = cos(param2);
    float param5 = sin(param2);
    float param7 = param5 * -1.;
    mat2 param8 = mat2(param4, param7, param5, param4);
    vec2 param10 = param8 * param1;
    return param10;
}
#endif
void main(){
  vec2 uv = gl_FragCoord.xy / resolution;
  gl_FragColor = texture2D(diffuse, gl_FragCoord.xy/resolution);
  #ifdef SHOW_MAP
  	float r = pow(texture2D(map, offset+rotate2d(vUv-.5, angle)+.5).r+curve.x,curve.y);
		gl_FragColor = mix(gl_FragColor, vec4(r,r,r,1.), 0.5);
  #endif
}
