uniform vec2 resolution;
uniform float blur;
uniform float angle;
uniform sampler2D diffuse;
uniform sampler2D map;
uniform vec2 offset;
uniform vec2 curve;
varying vec2 vUv;
vec2 rotate2d(vec2 param1, float param2){
    float param4 = cos(param2);
    float param5 = sin(param2);
    float param7 = param5 * -1.;
    mat2 param8 = mat2(param4, param7, param5, param4);
    vec2 param10 = param8 * param1;
    return param10;
}

void main(){
  vec2 uv = gl_FragCoord.xy / resolution;
  float amount = blur * pow(min(1.,max(0.,texture2D(map, offset+rotate2d(vUv-.5, angle)+.5).r + curve.x)), curve.y);
  float lod = amount * .2;
  vec4 col = texture2D( diffuse, uv + amount*vec2( 1., 1. ) / resolution,lod );
  col += texture2D( diffuse, uv + amount*vec2( 1, -1. ) / resolution ,lod);
  col += texture2D( diffuse, uv + amount*vec2( -1, 1. ) / resolution ,lod);
  col += texture2D( diffuse, uv + amount*vec2( -1., -1. ) / resolution ,lod);
  gl_FragColor = col/4.;
}